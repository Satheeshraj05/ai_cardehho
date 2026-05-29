export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL ? "SET ✓" : "MISSING ✗",
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? "SET ✓" : "MISSING ✗",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY ? "SET ✓" : "MISSING ✗",
    NODE_ENV: process.env.NODE_ENV,
  });
}
