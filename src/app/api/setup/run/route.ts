import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureDatabaseSchema } from "@/lib/ensure-schema";
import { disconnectSeedClient, seedIfEmpty } from "@/lib/seed-database";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function checkKey(request: NextRequest): boolean {
  const key = request.nextUrl.searchParams.get("key");
  const password = process.env.ADMIN_PASSWORD;
  return Boolean(password && key && key === password);
}

/** 免費版無 Shell：瀏覽器訪問 /api/setup/run?key=你的ADMIN_PASSWORD */
export async function GET(request: NextRequest) {
  if (!checkKey(request)) {
    return NextResponse.json({ ok: false, error: "無效 key，請使用 ?key=ADMIN_PASSWORD" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: "未配置 DATABASE_URL" }, { status: 500 });
  }

  let schemaResult: { created: boolean; message: string };
  let seedResult: { seeded: boolean; productCount: number };

  try {
    schemaResult = await ensureDatabaseSchema(prisma);
    seedResult = await seedIfEmpty();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
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
    schema: schemaResult.message,
    seeded: seedResult.seeded,
    productCount,
    hint: productCount > 0 ? "完成，可訪問 /categories 與 /api/health" : "仍失敗，請檢查 Render 日誌",
  });
}
