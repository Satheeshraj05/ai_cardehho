import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const isLocal = !process.env.TURSO_DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: isLocal
    ? { url: process.env.DATABASE_URL ?? "file:./dev.db" }
    : {
        url: process.env.TURSO_DATABASE_URL!,
        adapter: new PrismaLibSql(
          createClient({
            url: process.env.TURSO_DATABASE_URL!,
            authToken: process.env.TURSO_AUTH_TOKEN,
          })
        ),
      },
});
