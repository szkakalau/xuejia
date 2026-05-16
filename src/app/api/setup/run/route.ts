import { execSync } from "node:child_process";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { disconnectSeedClient, seedIfEmpty } from "@/lib/seed-database";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function checkKey(request: NextRequest): boolean {
  const key = request.nextUrl.searchParams.get("key");
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password && key && key === password);
}

function runMigrations(): { migrate: string } {
  let migrateNote = "migrate deploy skipped";
  try {
    execSync("npx prisma migrate deploy", { stdio: "pipe", encoding: "utf8" });
    migrateNote = "migrate deploy ok";
  } catch {
    migrateNote = "migrate deploy failed (continuing)";
  }

  try {
    execSync("npx prisma db push --skip-generate", {
      stdio: "pipe",
      encoding: "utf8",
    });
    return { migrate: `${migrateNote}; db push ok` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { migrate: `${migrateNote}; db push failed: ${message}` };
  }
}

/** 免費版無 Shell 時：瀏覽器訪問 /api/setup/run?key=你的ADMIN_PASSWORD */
export async function GET(request: NextRequest) {
  if (!checkKey(request)) {
    return NextResponse.json({ ok: false, error: "無效 key，請使用 ?key=ADMIN_PASSWORD" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: "未配置 DATABASE_URL" }, { status: 500 });
  }

  const migrateResult = runMigrations();
  let seedResult;

  try {
    seedResult = await seedIfEmpty();
  } finally {
    await disconnectSeedClient();
  }

  let productCount = 0;
  try {
    productCount = await prisma.product.count();
  } catch {
    productCount = 0;
  }

  return NextResponse.json({
    ok: productCount > 0,
    migrate: migrateResult.migrate,
    seeded: seedResult.seeded,
    productCount,
    hint: productCount > 0 ? "完成，可訪問 /categories" : "仍無商品，請檢查 Render 日誌與 DATABASE_URL",
  });
}
