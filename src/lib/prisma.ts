import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createClient(): PrismaClient {
  const tursoUrl = (process.env.TURSO_DATABASE_URL ?? "").trim();
  const tursoToken = (process.env.TURSO_AUTH_TOKEN ?? "").trim();

  if (tursoUrl) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client") as typeof import("@libsql/client");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require("@prisma/adapter-libsql") as {
      PrismaLibSql: new (client: unknown) => unknown;
    };
    const turso = createClient({ url: tursoUrl, authToken: tursoToken });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PrismaClient({ adapter: new PrismaLibSql(turso) } as any);
  }

  // Local dev — SQLite
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3") as typeof import("@prisma/adapter-better-sqlite3");
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

// Getter — creates client on first access, not at import time
let _prisma: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  if (!_prisma) {
    _prisma = globalForPrisma.prisma ?? createClient();
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = _prisma;
    }
  }
  return _prisma;
}

// Keep named export for backwards compat — but now it's a getter
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as unknown as Record<string, unknown>)[prop as string];
  },
});
