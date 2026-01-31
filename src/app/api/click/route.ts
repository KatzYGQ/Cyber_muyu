import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getBaseUrl, useInsforge, insforgeIncrementClick } from "@/lib/insforge";

export const dynamic = "force-dynamic";

const INSFORGE_URL_HINT =
  "In Vercel: Settings → Environment Variables → Add INSFORGE_URL = https://firstvibe.zeabur.app, then Redeploy.";

export async function POST() {
  try {
    const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    if (apiKey.startsWith("ik_")) {
      const url = getBaseUrl();
      if (!url) {
        return NextResponse.json({ error: INSFORGE_URL_HINT }, { status: 500 });
      }
      const total_clicks = await insforgeIncrementClick();
      return NextResponse.json({ total_clicks });
    }
    if (useInsforge()) {
      const total_clicks = await insforgeIncrementClick();
      return NextResponse.json({ total_clicks });
    }
    const supabase = getSupabase();
    const { data: current } = await supabase
      .from("cyber_muyu")
      .select("total_clicks")
      .eq("id", 1)
      .single();

    const newTotal = (current?.total_clicks ?? 0) + 1;

    const { error } = await supabase
      .from("cyber_muyu")
      .update({
        total_clicks: newTotal,
        last_click_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ total_clicks: newTotal });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
