export const dynamic = "force-dynamic";

export async function GET() {
  const tursoUrl = (process.env.TURSO_DATABASE_URL ?? "").trim();
  const tursoToken = (process.env.TURSO_AUTH_TOKEN ?? "").trim();

  // Test different import paths for @libsql/client
  const results: Record<string, string> = {};

  // Test 1: default require
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const lib = require("@libsql/client");
    const keys = Object.keys(lib);
    results["require('@libsql/client') keys"] = keys.join(", ");
    if (lib.createClient) {
      const c = lib.createClient({ url: tursoUrl, authToken: tursoToken });
      results["createClient result"] = typeof c + " keys: " + Object.keys(c).slice(0, 5).join(", ");
    }
  } catch (e) {
    results["require error"] = String(e);
  }

  // Test 2: /node path
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const lib2 = require("@libsql/client/node");
    results["require('@libsql/client/node') keys"] = Object.keys(lib2).join(", ");
  } catch (e) {
    results["node path error"] = String(e);
  }

  // Test 3: full connection attempt with explicit url
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require("@prisma/adapter-libsql");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client");

    const client = createClient({ url: tursoUrl, authToken: tursoToken });
    results["libsql client url"] = (client as { config?: { url?: string } }).config?.url ?? "no url prop";

    const adapter = new PrismaLibSql(client);
    const prisma = new PrismaClient({ adapter });
    const count = await prisma.car.count();
    results["DB count"] = String(count);
  } catch (e) {
    results["full test error"] = e instanceof Error ? e.message : String(e);
  }

  return Response.json({ tursoUrl: tursoUrl.slice(0, 40), ...results });
}
