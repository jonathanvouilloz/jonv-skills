-- Requêtes les plus coûteuses en temps cumulé (nécessite pg_stat_statements,
-- chargé via shared_preload_libraries puis CREATE EXTENSION pg_stat_statements).
-- Une requête de 5 ms appelée 100 000 fois pèse plus qu'une de 2 s appelée une fois.
-- Si l'extension est absente, ce script ne renvoie qu'un message : à mettre dans le plan de mesure.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_stat_statements') THEN
    RAISE NOTICE 'pg_stat_statements non installé : ajouter au plan de mesure.';
  END IF;
END $$;

SELECT
  calls                                         AS appels,
  round(total_exec_time::numeric, 1)            AS total_ms,
  round(mean_exec_time::numeric, 2)             AS moyenne_ms,
  round(max_exec_time::numeric, 1)              AS max_ms,
  rows                                          AS lignes,
  round(100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0), 1) AS pct_cache,
  left(regexp_replace(query, '\s+', ' ', 'g'), 200) AS requete
FROM pg_stat_statements
WHERE dbid = (SELECT oid FROM pg_database WHERE datname = current_database())
  -- exclut les commandes utilitaires et les requêtes d'audit sur le catalogue
  AND query !~* '^\s*(create|alter|drop|analyze|vacuum|set|show|begin|commit|rollback|do|grant|truncate)\M'
  AND query !~* '\m(pg_stat_\w+|pg_settings|pg_class|pg_index|pg_constraint|pg_extension|pg_db_role_setting|pg_database|pg_namespace)\M'
ORDER BY total_exec_time DESC
LIMIT 25;
