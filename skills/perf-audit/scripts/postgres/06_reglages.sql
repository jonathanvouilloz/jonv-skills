-- Réglages de la base qui influencent blocages et performances.
-- Les timeouts à 0 signifient "attente infinie".
SELECT name, setting, unit, source
FROM pg_settings
WHERE name IN (
  'server_version', 'max_connections',
  'statement_timeout', 'lock_timeout', 'idle_in_transaction_session_timeout',
  'idle_session_timeout', 'shared_buffers', 'effective_cache_size', 'work_mem',
  'maintenance_work_mem', 'random_page_cost', 'log_min_duration_statement',
  'shared_preload_libraries', 'autovacuum', 'track_io_timing'
)
ORDER BY name;

-- Réglages posés par rôle ou par base (ALTER ROLE/DATABASE ... SET)
SELECT coalesce(r.rolname, '(tous)') AS role, coalesce(d.datname, '(toutes)') AS base, s.setconfig AS reglages
FROM pg_db_role_setting s
LEFT JOIN pg_roles r ON r.oid = s.setrole
LEFT JOIN pg_database d ON d.oid = s.setdatabase;

-- Extensions installées (pg_stat_statements attendu pour le plan de mesure)
SELECT extname, extversion FROM pg_extension ORDER BY extname;

-- Connexions actuelles par état (transactions inactives longues = signal de blocage)
SELECT state, count(*) AS connexions,
       max(now() - xact_start) AS plus_longue_transaction
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY state
ORDER BY connexions DESC;
