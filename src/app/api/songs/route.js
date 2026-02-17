import { pnetFetch } from "@/lib/phishnet";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await pnetFetch("/songs");
    const songs = data.map((s) => ({
      name: s.songname || s.song || "",
      slug: s.slug || "",
      times: parseInt(s.times) || 0,
      debut: s.debut || "",
      last: s.last || "",
      gap: parseInt(s.gap) || 0,
    }));

    return NextResponse.json({ songs });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
