#!/bin/sh
# Do not use set -e: DB setup may warn; Next.js should still start.

sh scripts/render-db.sh

echo "==> Starting Next.js..."
exec npm start
