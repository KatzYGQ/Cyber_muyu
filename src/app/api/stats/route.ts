import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getBaseUrl, useInsforge, insforgeGetTotalClicks } from "@/lib/insforge";

export const dynamic = "force-dynamic";

const INSFORGE_URL_HINT =
  "In Vercel: Settings → Environment Variables → Add INSFORGE_URL = https://firstvibe.zeabur.app, then Redeploy.";

export async function GET() {
  try {
    const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    if (apiKey.startsWith("ik_")) {
      const url = getBaseUrl();
      if (!url) {
        return NextResponse.json({ error: INSFORGE_URL_HINT }, { status: 500 });
      }
      const total_clicks = await insforgeGetTotalClicks();
      return NextResponse.json({ total_clicks });
    }
    if (useInsforge()) {
      const total_clicks = await insforgeGetTotalClicks();
      return NextResponse.json({ total_clicks });
    }
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("cyber_muyu")
      .select("total_clicks")
      .eq("id", 1)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ total_clicks: data?.total_clicks ?? 0 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
