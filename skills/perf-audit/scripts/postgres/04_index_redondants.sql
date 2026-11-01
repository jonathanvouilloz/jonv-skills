-- Index dont les colonnes sont un préfixe d'un autre index de la même table
-- (même méthode, sans prédicat). Le plus court est généralement superflu,
-- sauf s'il est UNIQUE ou sert de contrainte.
SELECT
  a.indrelid::regclass                       AS table,
  a.indexrelid::regclass                     AS index_redondant,
  pg_size_pretty(pg_relation_size(a.indexrelid)) AS taille,
  b.indexrelid::regclass                     AS couvert_par,
  a.indisunique                              AS redondant_est_unique
FROM pg_index a
JOIN pg_index b
  ON a.indrelid = b.indrelid
 AND a.indexrelid <> b.indexrelid
 AND a.indnatts <= b.indnatts
 AND (b.indkey::int2[])[0:a.indnatts - 1] = (a.indkey::int2[])[0:a.indnatts - 1]
JOIN pg_class ca ON ca.oid = a.indexrelid
JOIN pg_class cb ON cb.oid = b.indexrelid
JOIN pg_namespace n ON n.oid = ca.relnamespace
WHERE ca.relam = cb.relam
  AND a.indpred IS NULL AND b.indpred IS NULL
  AND a.indexprs IS NULL AND b.indexprs IS NULL
  AND NOT a.indisprimary
  AND (a.indnatts < b.indnatts OR a.indexrelid > b.indexrelid)
  AND n.nspname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_relation_size(a.indexrelid) DESC;
