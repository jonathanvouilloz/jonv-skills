-- Volumes : lignes estimées et tailles par table (table, index, TOAST).
-- Lecture seule. Sert à calibrer l'impact de chaque constat.
SELECT
  n.nspname                                   AS schema,
  c.relname                                   AS table,
  CASE WHEN c.reltuples < 0 THEN s.n_live_tup ELSE c.reltuples::bigint END AS lignes_estimees,
  s.n_dead_tup                                AS lignes_mortes,
  pg_size_pretty(pg_relation_size(c.oid))     AS taille_table,
  pg_size_pretty(pg_indexes_size(c.oid))      AS taille_index,
  pg_size_pretty(pg_total_relation_size(c.oid) - pg_relation_size(c.oid) - pg_indexes_size(c.oid)) AS taille_toast,
  pg_size_pretty(pg_total_relation_size(c.oid)) AS taille_totale
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_stat_user_tables s ON s.relid = c.oid
WHERE c.relkind IN ('r', 'p')
  AND n.nspname NOT IN ('pg_catalog', 'information_schema')
  AND n.nspname NOT LIKE 'pg_toast%'
ORDER BY pg_total_relation_size(c.oid) DESC
LIMIT 50;

SELECT pg_size_pretty(pg_database_size(current_database())) AS taille_base;
