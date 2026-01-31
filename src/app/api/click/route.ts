import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
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
