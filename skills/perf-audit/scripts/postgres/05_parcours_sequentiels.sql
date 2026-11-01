-- Tables lues surtout par parcours complet (seq scan).
-- Inoffensif sur une petite table ; signal fort sur une table de plus de ~10 000 lignes.
SELECT
  relname                                    AS table,
  n_live_tup                                 AS lignes,
  seq_scan                                   AS parcours_complets,
  seq_tup_read                               AS lignes_lues_en_parcours,
  idx_scan                                   AS parcours_index,
  CASE WHEN seq_scan + coalesce(idx_scan, 0) = 0 THEN NULL
       ELSE round(100.0 * seq_scan / (seq_scan + coalesce(idx_scan, 0)), 1) END AS pct_parcours_complets,
  pg_size_pretty(pg_relation_size(relid))    AS taille
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC
LIMIT 30;
