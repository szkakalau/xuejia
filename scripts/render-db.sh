#!/bin/sh
# Run at container START only (Render build cannot reach Internal DATABASE_URL).

if [ -z "$DATABASE_URL" ]; then
  echo "==> DATABASE_URL not set, skip database setup."
  exit 0
fi

echo "==> Applying database schema..."

if npx prisma migrate deploy; then
  echo "==> Migrations applied."
else
  echo "==> migrate deploy failed, syncing xuejia schema..."
  if npx prisma db push --skip-generate; then
    echo "==> db push ok."
  else
    echo "==> WARN: schema sync failed. After Live, open /api/setup/run?key=ADMIN_PASSWORD"
  fi
fi

echo "==> Seeding if empty..."
if npx tsx scripts/seed-if-empty.ts; then
  echo "==> Seed step done."
else
  echo "==> WARN: seed failed. After Live, open /api/setup/run?key=ADMIN_PASSWORD"
fi

exit 0
