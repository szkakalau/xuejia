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
          ? "資料庫已連接但無商品。免費版請訪問 /api/setup/run?key=ADMIN_PASSWORD 或等待重新部署自動 seed"
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
