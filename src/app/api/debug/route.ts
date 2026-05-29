export const dynamic = "force-dynamic";

export async function GET() {
  const tursoUrl = process.env.TURSO_DATABASE_URL ?? "";
  return Response.json({
    TURSO_DATABASE_URL: tursoUrl ? `SET ✓ (${tursoUrl.slice(0, 30)}...)` : "MISSING ✗",
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN ? "SET ✓" : "MISSING ✗",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY ? "SET ✓" : "MISSING ✗",
    NODE_ENV: process.env.NODE_ENV,
    url_length: tursoUrl.length,
    url_trimmed_length: tursoUrl.trim().length,
  });
}
