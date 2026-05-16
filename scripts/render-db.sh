#!/bin/sh
# Migrate + seed when DATABASE_URL is set (build or start on Render).

if [ -z "$DATABASE_URL" ]; then
  echo "==> DATABASE_URL not set, skip database setup."
  exit 0
fi

echo "==> Applying database schema..."

if npx prisma migrate deploy; then
  echo "==> Migrations applied."
else
  echo "==> migrate deploy failed, syncing xuejia schema..."
  npx prisma db push --skip-generate
fi

echo "==> Seeding if empty..."
npx tsx scripts/seed-if-empty.ts
