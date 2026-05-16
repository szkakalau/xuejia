import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getDbErrorMessage } from "@/lib/db-error";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({
      ok: false,
      database: false,
      error: "DATABASE_URL 未配置",
    });
  }

  try {
    const [brandCount, productCount] = await Promise.all([
      prisma.brand.count(),
      prisma.product.count(),
    ]);
    return NextResponse.json({
      ok: true,
      database: true,
      brandCount,
      productCount,
      hint:
        productCount === 0
          ? "資料庫已連接但無商品，請在 Shell 執行：npm run db:seed"
          : undefined,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      database: false,
      error: getDbErrorMessage(error),
    });
  }
}
