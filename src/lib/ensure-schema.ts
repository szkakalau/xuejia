import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";

function parseSqlFile(content: string): string[] {
  return content
    .split(/;\s*(?:\r?\n|$)/)
    .map((chunk) => chunk.replace(/--[^\n]*/g, "").trim())
    .filter((chunk) => chunk.length > 0);
}

function isAlreadyExistsError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return (
    msg.includes("already exists") ||
    msg.includes("42P07") ||
    msg.includes("42P06") ||
    msg.includes("42710")
  );
}

async function brandTableExists(prisma: PrismaClient): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'xuejia' AND table_name = 'Brand'
    ) AS exists
  `;
  return Boolean(rows[0]?.exists);
}

/** Apply init migration SQL when migrate history is out of sync (tables missing). */
export async function ensureDatabaseSchema(
  prisma?: PrismaClient
): Promise<{ created: boolean; message: string }> {
  const client = prisma ?? new PrismaClient();
  const ownsClient = !prisma;

  try {
    if (await brandTableExists(client)) {
      return { created: false, message: "tables already exist" };
    }

    const sqlPath = join(process.cwd(), "prisma/migrations/20250316000000_init/migration.sql");
    const statements = parseSqlFile(readFileSync(sqlPath, "utf8"));

    for (const statement of statements) {
      try {
        await client.$executeRawUnsafe(statement);
      } catch (error) {
        if (!isAlreadyExistsError(error)) throw error;
      }
    }

    if (!(await brandTableExists(client))) {
      throw new Error("Brand table still missing after applying migration SQL");
    }

    return { created: true, message: "applied init migration SQL" };
  } finally {
    if (ownsClient) await client.$disconnect();
  }
}
