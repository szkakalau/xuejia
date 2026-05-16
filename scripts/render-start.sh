#!/bin/sh
set -e

sh scripts/render-db.sh

echo "==> Starting Next.js..."
exec npm start
