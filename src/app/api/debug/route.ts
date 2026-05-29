export const dynamic = "force-dynamic";

export async function GET() {
  const tursoUrl = (process.env.TURSO_DATABASE_URL ?? "").trim();
  const tursoToken = (process.env.TURSO_AUTH_TOKEN ?? "").trim();

  let dbTest = "not attempted";
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client");
    // Pass config directly — no createClient needed
    const adapter = new PrismaLibSql({ url: tursoUrl, authToken: tursoToken });
    const prisma = new PrismaClient({ adapter });
    const count = await prisma.car.count();
    dbTest = `✓ connected — ${count} cars in DB`;
  } catch (e) {
    dbTest = `✗ ${e instanceof Error ? e.message : String(e)}`;
  }

  return Response.json({
    TURSO_DATABASE_URL: tursoUrl ? `SET (${tursoUrl.slice(0, 35)}...)` : "MISSING",
    TURSO_AUTH_TOKEN: tursoToken ? "SET" : "MISSING",
    dbTest,
  });
}
