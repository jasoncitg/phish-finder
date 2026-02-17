import { pnetFetch } from "@/lib/phishnet";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const song = searchParams.get("song");

  if (!song) {
    return NextResponse.json({ error: "Please provide a song parameter (slug)" }, { status: 400 });
  }

  try {
    const data = await pnetFetch(`/jamcharts/slug/${song}`);
    const entries = data.map((j) => ({
      showdate: j.showdate || "",
      song: j.song || "",
      description: j.description || "",
    }));

    return NextResponse.json({ song, entries });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
