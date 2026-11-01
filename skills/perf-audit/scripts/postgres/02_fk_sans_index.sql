-- Clés étrangères dont les colonnes ne sont couvertes par aucun index
-- (aucun index dont les premières colonnes sont exactement celles de la FK).
-- PostgreSQL ne crée pas ces index automatiquement. Impact : jointures,
-- DELETE/UPDATE sur la table référencée (vérification de la FK = parcours complet).
WITH fk AS (
  SELECT
    con.oid,
    con.conrelid,
    con.conname,
    con.confrelid,
    con.conkey,
    con.confdeltype
  FROM pg_constraint con
  JOIN pg_namespace n ON n.oid = con.connamespace
  WHERE con.contype = 'f'
    AND n.nspname NOT IN ('pg_catalog', 'information_schema')
),
indexed AS (
  SELECT fk.oid
  FROM fk
  JOIN pg_index i ON i.indrelid = fk.conrelid
  WHERE (i.indkey::int2[])[0:array_length(fk.conkey, 1) - 1] @> fk.conkey
    AND (i.indkey::int2[])[0:array_length(fk.conkey, 1) - 1] <@ fk.conkey
    AND i.indpred IS NULL
)
SELECT
  fk.conrelid::regclass                               AS table,
  fk.conname                                          AS contrainte,
  (SELECT string_agg(a.attname, ', ' ORDER BY x.n)
     FROM unnest(fk.conkey) WITH ORDINALITY AS x(attnum, n)
     JOIN pg_attribute a ON a.attrelid = fk.conrelid AND a.attnum = x.attnum) AS colonnes,
  fk.confrelid::regclass                              AS reference,
  CASE fk.confdeltype WHEN 'c' THEN 'CASCADE' WHEN 'n' THEN 'SET NULL'
       WHEN 'd' THEN 'SET DEFAULT' WHEN 'r' THEN 'RESTRICT' ELSE 'NO ACTION' END AS on_delete,
  (SELECT reltuples::bigint FROM pg_class WHERE oid = fk.conrelid) AS lignes_table,
  'CREATE INDEX ON ' || fk.conrelid::regclass || ' (' ||
    (SELECT string_agg(quote_ident(a.attname), ', ' ORDER BY x.n)
       FROM unnest(fk.conkey) WITH ORDINALITY AS x(attnum, n)
       JOIN pg_attribute a ON a.attrelid = fk.conrelid AND a.attnum = x.attnum) || ');' AS suggestion
FROM fk
WHERE fk.oid NOT IN (SELECT oid FROM indexed)
ORDER BY lignes_table DESC, 1, 2;
