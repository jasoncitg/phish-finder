import { pnetFetch } from "@/lib/phishnet";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  try {
    let data;
    if (year) {
      data = await pnetFetch(`/shows/showyear/${year}`, { order_by: "showdate" });
    } else {
      return NextResponse.json({ error: "Please provide a year parameter" }, { status: 400 });
    }

    // Filter to Phish only and shape the data
    const shows = data
      .filter((s) => s.artistid === "1" || s.artist_name === "Phish")
      .map((s) => ({
        date: s.showdate,
        venue: s.venue || "",
        city: s.city || "",
        state: s.state || "",
        country: s.country || "",
        rating: parseFloat(s.rating) || 0,
        reviews: parseInt(s.reviews) || 0,
        showid: s.showid,
        tourname: s.tourname || "",
        setlistnotes: s.setlistnotes || "",
      }));

    return NextResponse.json({ shows });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
