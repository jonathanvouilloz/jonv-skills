#!/usr/bin/env bash
# Lance tous les scripts d'audit en LECTURE SEULE sur une base PostgreSQL.
# Usage : ./run_all.sh "postgres://user:pass@localhost:5432/ma_base" [dossier_sortie]
# Ne jamais pointer vers la production sans accord explicite.
set -euo pipefail
URL="${1:?Usage: run_all.sh <DATABASE_URL> [dossier_sortie]}"
OUT="${2:-}"
DIR="$(cd "$(dirname "$0")" && pwd)"
# Lecture seule forcée. Pas de statement_timeout ici : il masquerait la vraie
# valeur du serveur lue par 06_reglages.sql.
export PGOPTIONS="-c default_transaction_read_only=on"
for f in "$DIR"/0*.sql; do
  name="$(basename "$f" .sql)"
  echo "===== $name ====="
  if [ -n "$OUT" ]; then
    mkdir -p "$OUT"
    psql "$URL" -X -q -P pager=off -v ON_ERROR_STOP=0 -f "$f" 2>&1 | tee "$OUT/$name.txt"
  else
    psql "$URL" -X -q -P pager=off -v ON_ERROR_STOP=0 -f "$f" 2>&1
  fi
done
