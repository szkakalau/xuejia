#!/bin/sh
set -e

echo "==> Preparing database..."

if npx prisma migrate deploy; then
  echo "==> Migrations applied."
else
  echo "==> migrate deploy failed (e.g. P3005 on shared DB), falling back to db push..."
  npx prisma db push --skip-generate
fi

echo "==> Starting Next.js..."
exec npm start
