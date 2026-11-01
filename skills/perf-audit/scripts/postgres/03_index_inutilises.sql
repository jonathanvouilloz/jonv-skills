-- Index jamais utilisés depuis la dernière remise à zéro des statistiques.
-- Exclut clés primaires, contraintes uniques et index d'exclusion (ils ont un rôle d'intégrité).
-- ATTENTION : sur une base de dev peu utilisée, idx_scan = 0 ne prouve rien.
-- À confirmer sur la production (ou une base qui a reçu du trafic réel).
SELECT
  s.relname                                  AS table,
  s.indexrelname                             AS index,
  s.idx_scan                                 AS utilisations,
  pg_size_pretty(pg_relation_size(s.indexrelid)) AS taille,
  pg_get_indexdef(s.indexrelid)              AS definition
FROM pg_stat_user_indexes s
JOIN pg_index i ON i.indexrelid = s.indexrelid
WHERE s.idx_scan = 0
  AND NOT i.indisprimary
  AND NOT i.indisunique
  AND NOT EXISTS (SELECT 1 FROM pg_constraint c WHERE c.conindid = s.indexrelid)
ORDER BY pg_relation_size(s.indexrelid) DESC;

SELECT coalesce(stats_reset::text, 'initialisation du serveur') AS statistiques_depuis
FROM pg_stat_database WHERE datname = current_database();
