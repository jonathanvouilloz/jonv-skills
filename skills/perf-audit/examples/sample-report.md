# Exemple de rapport (extrait anonymisé)

Extrait d'un vrai rapport produit sur une application de gestion de club sportif, avant sa mise en production. Le rapport complet contenait 20 constats ; seuls le calibrage, les priorités, le tableau et deux constats détaillés sont reproduits ici. Le rapport est rédigé dans la langue de l'utilisateur (ici le français).

> Excerpt of a real report produced on a sports club management app before going to production. The full report had 20 findings. Reports are written in the user's language (French here).

---

## Contexte et calibrage

- **Stack** : Hono + Drizzle (node-postgres) + PostgreSQL 17, worker maison (boucle de 15 s sur une table d'envois), web React SPA (Vite, TanStack Router et Query), mobile Expo. Pas encore déployé.
- **Volumes lus** (base de dev, 13 Mo) : invitations 3 698, attendance 2 018, group_members 216, events 138, people 90.
- **Instrumentation existante** : aucune.
- **Lecture du risque** : à ce volume, un parcours complet d'une table coûte moins d'une milliseconde. Le risque principal n'est pas la lenteur mais le **blocage** (attente sans fin, transaction longue).

## Priorités

### P1 — À faire maintenant
1. **Pool de connexions sans aucun délai** — une requête peut attendre une connexion indéfiniment, et rien ne coupe une requête SQL ou une transaction bloquée. (§1)
2. **Clés étrangères sans index utilisées par les purges** — la purge de nuit parcourt toute la table d'envois pour chaque notification supprimée : coût quadratique. (§2)

### P2 — Prochain cycle
- **Publication d'un événement : 15 à 20 requêtes par invité, en séquence, dans une transaction** qui verrouille l'événement. (§9)
- **Liste des salons : ~10 requêtes par salon en `Promise.all`** sur un pool de 10 connexions. (§11)

### P3 — À planifier
- **Listes sans filtre de saison** (`/events`, `/invitations`, `/attendance`) — sans effet aujourd'hui ; plusieurs centaines de Ko par chargement après trois saisons. (§12)

## Quick wins (dans l'ordre)

1. Délais du pool : une ligne, supprime le risque de blocage. (§1)
2. Une migration de six index. (§2)
3. `staleTime: 30_000` sur le client mobile. (§4)
4. Requête d'audit indexable et bornée, `findAttendance` direct. (§5, §7)
5. `Cache-Control: private, no-cache` par défaut sur l'API, compression au proxy ou dans Hono. (§3)

## Tableau des constats (extrait)

| # | Prio | Domaine | Problème | Emplacement | Nature | Impact | Effort | Statut |
|---|---|---|---|---|---|---|---|---|
| 1 | P1 | Base | Pool sans `connectionTimeoutMillis`, `statement_timeout`, `idle_in_transaction_session_timeout` | `packages/db/src/client.ts:9` | Blocage | Élevé | Faible | constaté |
| 2 | P1 | Base | Clés étrangères sans index utilisées en `WHERE` ou par les purges | `packages/db/src/schema.ts:412, 210, 265, 715` | Croissance | Moyen | Faible | constaté |
| 9 | P2 | Base | Fan-out des notifications en N+1 dans une transaction | `notifications/recipients.ts:101-137` | Blocage | Moyen | Moyen | constaté |
| 11 | P2 | Base | Liste des salons : ~10 requêtes par salon en `Promise.all` | `services/channels.ts:293-310` | Blocage | Moyen | Moyen | constaté (noté `shortcut:` dans le code) |
| 12 | P3 | Backend | Listes sans filtre de saison ni limite, lignes entières (jsonb compris) | `repositories/events.ts:5` | Croissance | Moyen à terme | Moyen | constaté |
| 16 | P3 | Web | recharts, FullCalendar, TipTap importés en statique dans leurs pages | `components/junior-dossier.tsx` | Lenteur | Faible à Moyen | Faible | suspecté (poids non mesuré) |

## Détail (deux constats)

### 1. Pool de connexions sans délai
- **Constat** : `drizzle(url, { schema })` crée un `pg.Pool` par défaut : 10 connexions, `connectionTimeoutMillis: 0` (attente infinie), aucun `statement_timeout`. L'API et le worker font deux pools, soit 20 connexions.
- **Pourquoi ça pèse** : combiné aux constats 9 et 11, une rafale de requêtes peut tout bloquer, y compris le healthcheck, ce qui ferait redémarrer l'application par l'hébergeur.
- **Correctif proposé** :
  ```ts
  drizzle({ connection: { connectionString: url, max: 10, connectionTimeoutMillis: 5_000,
    statement_timeout: 15_000, idle_in_transaction_session_timeout: 30_000 }, schema })
  ```
- **Mesurer** : `select state, wait_event, now() - xact_start from pg_stat_activity` pendant un test de charge sur `GET /channels`.
- **Effets de bord** : une purge de nuit plus longue que 15 s échouerait ; donner au worker un `statement_timeout` plus large.

### 2. Index sur les clés étrangères
- **Constat** : le catalogue liste 45 clés étrangères sans index. La plupart ne servent qu'aux suppressions et peuvent attendre. Six servent vraiment :
  ```sql
  CREATE INDEX ON event_staff (person_id);
  CREATE INDEX ON group_staff (person_id);
  CREATE INDEX ON events (season_id, starts_at);
  CREATE INDEX ON notification_deliveries (notification_id);
  CREATE INDEX ON notification_deliveries (person_id);
  CREATE INDEX ON notification_deliveries (channel_message_id) WHERE channel_message_id IS NOT NULL;
  ```
- **Pourquoi ça pèse** : les trois derniers servent la purge de nuit. Chaque notification supprimée vérifie la clé étrangère par un parcours complet d'une table qui garde 12 mois d'emails avec leur HTML. Le coût croît comme le carré de la table.
- **Mesurer** : `EXPLAIN (ANALYZE, BUFFERS) DELETE FROM notifications WHERE created_at < now() - interval '12 months';` dans une transaction annulée, sur un jeu de données gonflé.
- **Effets de bord** : aucun, sinon un peu de coût d'écriture.
