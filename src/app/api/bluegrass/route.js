import { pnetFetch } from "@/lib/phishnet";
import { NextResponse } from "next/server";
import { BLUEGRASS_SONGS, getEra } from "@/lib/bluegrass";

// Cache for 24 hours on Vercel — stays well within Hobby tier limits
export const revalidate = 86400;

export async function GET() {
  try {
    // Fetch all performances of every bluegrass song from Phish.net in parallel
    const results = await Promise.allSettled(
      BLUEGRASS_SONGS.map(async (song) => {
        const data = await pnetFetch(`/setlists/song/${song.slug}`);
        return { song, performances: Array.isArray(data) ? data : [] };
      })
    );

    // Aggregate: group performances by show date
    const showMap = new Map();

    results.forEach((result) => {
      if (result.status !== "fulfilled") return;
      const { song, performances } = result.value;

      performances.forEach((perf) => {
        // Phish.net v5 field names vary slightly — handle both
        const date = perf.showdate || perf.show_date || "";
        if (!date || date.length < 10) return;

        const era = getEra(date);
        if (!era) return; // skip hiatus years (2001, 2005-2008)

        if (!showMap.has(date)) {
          showMap.set(date, {
            date,
            era,
            venue: perf.venue || perf.venuename || "",
            city: perf.city || "",
            state: perf.state || "",
            country: perf.country || "",
            showid: perf.showid || "",
            bluegrassSongs: [],
          });
        }

        const show = showMap.get(date);
        // Avoid duplicate entries for the same song on the same date
        if (!show.bluegrassSongs.find((s) => s.slug === song.slug)) {
          show.bluegrassSongs.push({
            name: song.name,
            slug: song.slug,
            origin: song.origin,
            type: song.type,
            description: song.description,
            set: perf.set || "",
            position: parseInt(perf.position) || 0,
          });
        }
      });
    });

    // Sort songs within each show by set then position
    const setOrder = { "1": 1, "2": 2, "3": 3, e: 4, a: 5 };
    const shows = Array.from(showMap.values())
      .filter((s) => s.bluegrassSongs.length > 0)
      .map((s) => ({
        ...s,
        bluegrassSongs: s.bluegrassSongs.sort(
          (a, b) =>
            (setOrder[a.set] || 9) - (setOrder[b.set] || 9) ||
            a.position - b.position
        ),
      }))
      .sort((a, b) => b.date.localeCompare(a.date)); // newest first

    // Build per-song play counts for the stats panel
    const songStats = BLUEGRASS_SONGS.map((song) => {
      const result = results.find(
        (r) => r.status === "fulfilled" && r.value.song.slug === song.slug
      );
      const perfs = result ? result.value.performances : [];
      const byEra = { "1.0": 0, "2.0": 0, "3.0": 0, "4.0": 0 };
      perfs.forEach((p) => {
        const era = getEra(p.showdate || p.show_date || "");
        if (era) byEra[era]++;
      });
      return {
        name: song.name,
        slug: song.slug,
        origin: song.origin,
        type: song.type,
        description: song.description,
        total: perfs.length,
        byEra,
      };
    }).sort((a, b) => b.total - a.total);

    return NextResponse.json({
      shows,
      songStats,
      totalShows: shows.length,
      fetchedSongs: BLUEGRASS_SONGS.length,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
