export const dynamic = "force-dynamic";

export async function GET() {
  const tursoUrl = (process.env.TURSO_DATABASE_URL ?? "").trim();

  // Check what the adapter actually exports
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const adapterModule = require("@prisma/adapter-libsql");
  const adapterKeys = Object.keys(adapterModule);

  // Try to create a client
  let clientTest = "not attempted";
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client");
    const turso = createClient({
      url: tursoUrl,
      authToken: (process.env.TURSO_AUTH_TOKEN ?? "").trim(),
    });
    const AdapterClass = adapterModule[adapterKeys[0]];
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient({ adapter: new AdapterClass(turso) });
    const count = await prisma.car.count();
    clientTest = `success — ${count} cars in DB`;
  } catch (e) {
    clientTest = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return Response.json({
    TURSO_DATABASE_URL: tursoUrl ? `SET ✓ (${tursoUrl.slice(0, 30)}...)` : "MISSING ✗",
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? "SET ✓" : "MISSING ✗",
    adapterExports: adapterKeys,
    clientTest,
  });
}
