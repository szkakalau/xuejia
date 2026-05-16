#!/bin/sh
# Run at container START only (Render build cannot reach Internal DATABASE_URL).

if [ -z "$DATABASE_URL" ]; then
  echo "==> DATABASE_URL not set, skip database setup."
  exit 0
fi

echo "==> Ensuring xuejia schema tables exist..."
if npx tsx scripts/ensure-schema.ts; then
  echo "==> Schema OK."
else
  echo "==> WARN: ensure-schema failed."
fi

echo "==> Prisma db push (sync)..."
npx prisma db push --skip-generate || echo "==> WARN: db push failed."

echo "==> Seeding if empty..."
if npx tsx scripts/seed-if-empty.ts; then
  echo "==> Seed step done."
else
  echo "==> WARN: seed failed. Open /api/setup/run?key=ADMIN_PASSWORD"
fi

exit 0
