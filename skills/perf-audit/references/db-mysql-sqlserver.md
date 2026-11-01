# MySQL / MariaDB et SQL Server

Les principes de `checklist-commune.md` s'appliquent. Ce fichier liste seulement ce qui diffère de PostgreSQL.

## MySQL 8 / MariaDB (InnoDB)

**Différences clés**
- InnoDB **crée automatiquement** un index sur chaque clé étrangère : le constat « FK sans index » n'existe pas ici, mais l'index créé peut être redondant avec un composite ajouté ensuite.
- La clé primaire est **l'index clusterisé** : une PK UUID aléatoire (v4) fragmente la table et ralentit les insertions. Préférer un entier auto-incrémenté ou un UUID ordonné (v7) stocké en `BINARY(16)`.
- Chaque index secondaire contient la PK : une PK large alourdit tous les index.
- Pas d'index partiel ; index fonctionnels depuis 8.0.13 ; colonnes générées indexables.

**Requêtes de catalogue (schéma `sys`, lecture seule)**
```sql
SELECT * FROM sys.schema_unused_indexes;              -- index inutilisés depuis le démarrage
SELECT * FROM sys.schema_redundant_indexes;           -- index redondants
SELECT * FROM sys.statements_with_full_table_scans ORDER BY exec_count DESC LIMIT 20;
SELECT * FROM sys.statement_analysis ORDER BY total_latency DESC LIMIT 20;
SELECT table_name, table_rows, ROUND((data_length+index_length)/1024/1024,1) AS mo
  FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY mo DESC;
SHOW VARIABLES WHERE Variable_name IN ('max_execution_time','innodb_buffer_pool_size',
  'max_connections','slow_query_log','long_query_time','innodb_lock_wait_timeout','wait_timeout');
```

**Mesure** : `EXPLAIN ANALYZE` (8.0.18+), `EXPLAIN FORMAT=TREE`, slow query log (`long_query_time = 0.2`).
**Timeouts** : `max_execution_time` (SELECT uniquement, en ms), `innodb_lock_wait_timeout` (50 s par défaut).
**Pièges** : collations différentes entre colonnes jointes (index ignoré), `ORDER BY RAND()`, `SELECT ... LIMIT` élevé avec `OFFSET`, `innodb_buffer_pool_size` laissé au défaut sur un serveur dédié.

## SQL Server / Azure SQL

**Différences clés**
- Comme PostgreSQL, **aucun index automatique sur les clés étrangères**.
- **Conversion implicite** : paramètre `nvarchar` comparé à une colonne `varchar` → index ignoré (fréquent avec les ORM qui envoient tout en Unicode). À vérifier dans les plans (`CONVERT_IMPLICIT`).
- **Parameter sniffing** : un plan compilé pour une valeur rare est réutilisé pour une valeur fréquente. Symptôme : même requête parfois rapide, parfois lente.
- **Blocages lecture/écriture** : sans `READ_COMMITTED_SNAPSHOT ON`, les lectures attendent les écritures. Vérifier ce réglage sur les apps métier très concurrentes.

**Requêtes de catalogue (lecture seule)**
```sql
-- Index manquants suggérés par le moteur (à filtrer, pas à appliquer en bloc)
SELECT TOP 20 d.statement, d.equality_columns, d.inequality_columns, d.included_columns,
       s.user_seeks, s.avg_user_impact
FROM sys.dm_db_missing_index_details d
JOIN sys.dm_db_missing_index_groups g ON g.index_handle = d.index_handle
JOIN sys.dm_db_missing_index_group_stats s ON s.group_handle = g.index_group_handle
ORDER BY s.user_seeks * s.avg_user_impact DESC;

-- Usage des index (lectures vs écritures)
SELECT OBJECT_NAME(i.object_id) AS table_name, i.name, s.user_seeks, s.user_scans, s.user_updates
FROM sys.indexes i LEFT JOIN sys.dm_db_index_usage_stats s
  ON s.object_id = i.object_id AND s.index_id = i.index_id AND s.database_id = DB_ID()
WHERE OBJECTPROPERTY(i.object_id, 'IsUserTable') = 1 ORDER BY s.user_updates DESC;

SELECT name, is_read_committed_snapshot_on FROM sys.databases WHERE name = DB_NAME();
```

**Mesure** : Query Store (top requêtes par durée cumulée, régressions de plan), plans d'exécution réels, `SET STATISTICS IO, TIME ON`.
**Connexions** : pool ADO.NET/JDBC par défaut à 100, `Connect Timeout` 15 s, `CommandTimeout` 30 s : vérifier qu'ils ne sont pas mis à 0.
