import { pnetFetch } from "@/lib/phishnet";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Please provide a date parameter (YYYY-MM-DD)" }, { status: 400 });
  }

  try {
    const data = await pnetFetch(`/setlists/showdate/${date}`);
    const songs = data.map((s) => ({
      song: s.song || s.songname || "",
      slug: s.slug || "",
      set: s.set || "",
      position: s.position || "",
      transition: s.transition || "",
      footnote: s.footnote || "",
      isjamchart: s.isjamchart || "0",
      jamchart_description: s.jamchart_description || "",
    }));

    return NextResponse.json({ date, songs });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
