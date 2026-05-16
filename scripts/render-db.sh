#!/bin/sh
# Run at container START only (Render build cannot reach Internal DATABASE_URL).

if [ -z "$DATABASE_URL" ]; then
  echo "==> DATABASE_URL not set, skip database setup."
  exit 0
fi

echo "==> Applying database schema..."

# migrate history may say "applied" while xuejia tables are missing (e.g. after schema change).
npx prisma migrate deploy || echo "==> migrate deploy returned non-zero (continuing)"

echo "==> Syncing schema with db push..."
if npx prisma db push --skip-generate; then
  echo "==> Schema ready."
else
  echo "==> WARN: db push failed. After Live, open /api/setup/run?key=ADMIN_PASSWORD"
fi

echo "==> Seeding if empty..."
if npx tsx scripts/seed-if-empty.ts; then
  echo "==> Seed step done."
else
  echo "==> WARN: seed failed. After Live, open /api/setup/run?key=ADMIN_PASSWORD"
fi

exit 0
