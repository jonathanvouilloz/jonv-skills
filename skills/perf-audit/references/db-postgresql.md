# PostgreSQL (y compris Supabase, Neon, RDS, Cloud SQL)

## Scripts déterministes (à lancer en premier si une base de dev est joignable)

```bash
scripts/postgres/run_all.sh "$DATABASE_URL" ./perf-audit-sql
```

Le script force `default_transaction_read_only=on`. Il ne doit jamais viser la production sans accord explicite.

| Script | Ce qu'il donne | Comment l'interpréter |
|---|---|---|
| `01_volumes.sql` | Lignes et tailles par table | Base du calibrage. Recopier les tables principales en tête du rapport. |
| `02_fk_sans_index.sql` | Clés étrangères sans index, avec `CREATE INDEX` suggéré | Ne pas toutes les recommander : croiser avec le code. Retenir celles utilisées en `WHERE`/jointure, et celles dont la table référencée subit des `DELETE` (purges, cascades). Les colonnes d'audit (`created_by_user_id`) peuvent attendre. |
| `03_index_inutilises.sql` | Index jamais utilisés | Sur une base de dev, `idx_scan = 0` ne prouve rien. Statut « suspecté » sauf si les stats viennent de la production. |
| `04_index_redondants.sql` | Index couverts par un autre index | Constat fiable (catalogue). Impact faible sauf table très écrite. |
| `05_parcours_sequentiels.sql` | Tables lues par parcours complet | Signal seulement au-delà de ~10 000 lignes. |
| `06_reglages.sql` | Timeouts, mémoire, extensions, connexions | `statement_timeout`, `idle_in_transaction_session_timeout`, `lock_timeout` à 0 côté serveur : vérifier qu'ils sont posés côté client (pool). Sinon constat de blocage. |
| `07_top_requetes.sql` | Requêtes les plus coûteuses (pg_stat_statements) | Seulement si l'extension est active et que la base a reçu du trafic représentatif. |

## Index

- **Clés étrangères** : jamais indexées automatiquement par PostgreSQL. Une FK sans index sur une table enfant volumineuse rend chaque `DELETE` sur le parent coûteux (vérification par parcours complet) : coût quadratique dans les purges en masse.
- **Composites** : égalité d'abord, plage ensuite. `(season_id, starts_at)` sert `season_id = ? AND starts_at > ?` et `season_id = ?`, pas `starts_at > ?` seul.
- **Partiels** : `WHERE deleted_at IS NULL`, `WHERE status = 'pending'`, `WHERE col IS NOT NULL` pour les colonnes rarement remplies. Idéal pour les files de travail (`WHERE sent_at IS NULL`).
- **Couvrants** : `INCLUDE (col)` pour un index-only scan sur une liste chaude.
- **Expressions** : `lower(email)`, `(data->>'type')`. Le filtre du code doit utiliser exactement la même expression.
- **GIN** : `jsonb` interrogé par `@>`, tableaux, full-text (`tsvector`), `pg_trgm` pour `ILIKE '%…%'`.
- **BRIN** : très grosses tables d'événements/logs insérées dans l'ordre chronologique.
- Repérer les **filtres non indexables** dans le code : `col::date`, `date_trunc(...) = `, `col AT TIME ZONE 'X' BETWEEN`, `lower(col)` sans index d'expression, `col || ''`. Correctif type pour les dates : convertir les bornes, pas la colonne.

```sql
-- Non indexable
WHERE (at AT TIME ZONE 'Europe/Zurich')::date BETWEEN $1 AND $2
-- Indexable : on convertit les bornes
WHERE at >= ($1::date)::timestamp AT TIME ZONE 'Europe/Zurich'
  AND at <  ($2::date + 1)::timestamp AT TIME ZONE 'Europe/Zurich'
```

## Requêtes à repérer dans le code

- `OFFSET` élevé → pagination par clé (`WHERE (starts_at, id) < ($1, $2) ORDER BY starts_at DESC, id DESC LIMIT 50`).
- `SELECT count(*)` exact sur une grosse table à chaque affichage → estimation (`reltuples`), compteur maintenu, ou cache.
- Boucle d'`UPDATE ... WHERE id = $1` → `UPDATE ... WHERE id = ANY($1::int[])` ; boucle d'`INSERT` → insertion multi-lignes ou `COPY`.
- `SELECT ... FOR UPDATE` dans une boucle → une seule requête `WHERE id = ANY($1) ORDER BY id FOR UPDATE` (ordre stable = pas d'interblocage).
- `NOT IN (sous-requête)` sur colonne nullable → `NOT EXISTS`.
- CTE utilisée comme barrière d'optimisation (antérieur à PG 12, ou `MATERIALIZED` explicite).

## Confirmer par la mesure

```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE) <requête>;
-- Pour une requête qui écrit :
BEGIN; EXPLAIN (ANALYZE, BUFFERS) DELETE FROM ... ; ROLLBACK;
```

Lire : `Seq Scan` sur une grosse table, écart fort entre `rows` estimé et réel (statistiques à rafraîchir ou corrélation), `Sort Method: external merge` (work_mem), `Rows Removed by Filter` très élevé (index manquant ou mal ordonné), `Nested Loop` avec beaucoup de boucles.

Avertir que sur un petit jeu de données, le planificateur choisit souvent un parcours complet même si l'index existe : il faut un jeu de données gonflé pour que l'EXPLAIN soit parlant.

## Fonctionnement et connexions

- **Timeouts** à poser côté client ou par rôle : `statement_timeout` (ex. 15 s pour l'API, plus large pour les jobs de purge), `idle_in_transaction_session_timeout` (ex. 30 s), `lock_timeout` pour les migrations. `ALTER ROLE app_api SET statement_timeout = '15s'` est une alternative quand le pool ne le permet pas.
- **Nombre de connexions** : somme des pools de toutes les instances (API + worker + jobs) < `max_connections` avec marge. Serverless ou nombreuses instances → pooler (PgBouncer, Supavisor, pooler Neon) en mode transaction, en sachant que les requêtes préparées et `SET` de session ne survivent pas en mode transaction.
- **Autovacuum** : `n_dead_tup` élevé sur une table très mise à jour (files de travail, compteurs) → surveiller, ajuster par table.
- **Rétention** : tables de journaux, d'emails, d'audit qui gardent du HTML/JSON pendant des mois → TOAST volumineux, purges lentes. Vérifier que la purge s'appuie sur un index et procède par lots.
- **Vues matérialisées** pour tableaux de bord et statistiques, rafraîchies `CONCURRENTLY` (nécessite un index unique).
- Partitionnement et réplicas : seulement au-delà de dizaines de millions de lignes. Ne pas le proposer pour une app métier de PME.

## Plan de mesure PostgreSQL

1. `shared_preload_libraries = 'pg_stat_statements'` puis `CREATE EXTENSION pg_stat_statements;`
2. `log_min_duration_statement = 200` (ms) ; `0` ponctuellement en dev pour compter les requêtes d'un parcours.
3. `track_io_timing = on` pour des `BUFFERS` exploitables.
4. Supabase : le « Performance Advisor » et l'« Index Advisor » du dashboard exploitent ces données.
