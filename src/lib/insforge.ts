/**
 * InsForge backend: uses Raw SQL API (same as MCP run-raw-sql).
 * Env: INSFORGE_URL (e.g. https://firstvibe.zeabur.app) or NEXT_PUBLIC_SUPABASE_URL,
 *      SUPABASE_SERVICE_ROLE_KEY (API Key).
 * Server-only INSFORGE_URL is read at runtime in API routes; no build-time dependency.
 * @see https://docs.insforge.dev/sdks/rest/database#execute-raw-sql-strict-mode
 */

/** Read at runtime so Vercel serverless always sees current env. */
function getBaseUrl(): string {
  const url =
    process.env.INSFORGE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  return url?.replace(/\/$/, "") ?? "";
}

function getApiKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  );
}

/** Use InsForge when we have URL+key and URL is NOT Supabase. */
function isInsforgeUrl(): boolean {
  const baseUrl = getBaseUrl();
  const apiKey = getApiKey();
  if (!baseUrl || !apiKey) return false;
  if (baseUrl.includes("supabase.co")) return false;
  return true;
}

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

interface RawSqlResponse {
  rows?: { total_clicks?: number }[];
  rowCount?: number;
  command?: string;
}

async function rawSql(query: string, params?: unknown[]): Promise<RawSqlResponse> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/database/advance/rawsql`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ query, params: params ?? [] }),
    cache: "no-store",
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `InsForge raw SQL failed: ${res.status}`);
  }
  return (await res.json()) as RawSqlResponse;
}

export async function insforgeGetTotalClicks(): Promise<number> {
  if (!isInsforgeUrl()) throw new Error("InsForge URL/API key not configured");
  const out = await rawSql("SELECT total_clicks FROM cyber_muyu WHERE id = 1 LIMIT 1");
  const row = out.rows?.[0];
  return row?.total_clicks ?? 0;
}

export async function insforgeIncrementClick(): Promise<number> {
  if (!isInsforgeUrl()) throw new Error("InsForge URL/API key not configured");
  const out = await rawSql(
    "UPDATE cyber_muyu SET total_clicks = total_clicks + 1, last_click_at = NOW() WHERE id = 1 RETURNING total_clicks"
  );
  const row = out.rows?.[0];
  if (row?.total_clicks == null) throw new Error("InsForge UPDATE returned no row");
  return row.total_clicks;
}

export function useInsforge(): boolean {
  return isInsforgeUrl();
}
