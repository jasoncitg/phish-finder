#!/usr/bin/env node
//
// Pre-fetches all Phish shows and setlists from the Phish.net API
// and writes a single static JSON file the app loads at runtime.
//
// Usage:
//   PHISHNET_API_KEY=your-key node scripts/build-shows.js
//   — or —
//   npm run build:data        (if the env var is already set)
//

const fs = require("fs");
const path = require("path");

const PNET_BASE = "https://api.phish.net/v5";
const API_KEY = process.env.PHISHNET_API_KEY;

if (!API_KEY) {
  console.error("Error: PHISHNET_API_KEY environment variable is required");
  console.error("Usage: PHISHNET_API_KEY=your-key node scripts/build-shows.js");
  process.exit(1);
}

// ── helpers ──────────────────────────────────────────────────────────────────

function getEra(d) {
  const y = parseInt(d.substring(0, 4));
  return y <= 2000 ? "1.0" : y <= 2004 ? "2.0" : y <= 2020 ? "3.0" : "4.0";
}

function deriveShowMetadata(date, rating, jamCharts) {
  const year = parseInt(date.substring(0, 4));
  const r = rating || 0;
  const jc = jamCharts || 0;

  let energy = 0;
  if (r >= 4.7) energy = 5;
  else if (r >= 4.5) energy = 4;
  else if (r >= 4.2) energy = 3;
  else if (r >= 3.8) energy = 2;
  else if (r > 0) energy = 1;

  let energyLevel = [];
  if (r >= 4.7) energyLevel = ["rageface"];
  else if (r >= 4.5) energyLevel = ["high-octane"];
  else if (r >= 4.2) energyLevel = ["building"];
  else if (r >= 3.8) energyLevel = ["steady-groove"];
  else if (r > 0) energyLevel = ["low-and-slow"];

  let style = [];
  if (jc >= 5) style = ["type-ii-heavy", "segue-fest"];
  else if (jc >= 3) style = ["type-ii-heavy"];
  else if (jc >= 2) style = ["segue-fest"];
  else if (jc >= 1) style = ["groove-based"];

  let vibes = [];
  if (year <= 1994) {
    vibes = ["raging", "melodic"];
    if (r >= 4.5) vibes.push("exploratory");
  } else if (year <= 1996) {
    vibes = ["raging", "celebratory"];
    if (jc >= 3) vibes.push("exploratory");
  } else if (year <= 1998) {
    vibes = ["funky", "dark", "exploratory"];
  } else if (year <= 2000) {
    vibes = ["blissful", "exploratory", "celebratory"];
  } else if (year <= 2004) {
    vibes = ["dark", "exploratory", "raging"];
  } else if (year <= 2012) {
    vibes = ["exploratory", "blissful"];
    if (r >= 4.5) vibes.push("raging");
  } else if (year <= 2018) {
    vibes = ["exploratory", "blissful", "melodic"];
    if (r >= 4.5) vibes.push("raging");
  } else {
    vibes = ["exploratory", "blissful"];
    if (jc >= 3) vibes.push("raging");
  }

  return { energy, energyLevel, style, vibes };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Curated show overrides (hand-picked metadata) ───────────────────────────

const CURATED = {
  "1993-02-20": { energy:5, vibes:["raging","melodic"], energyLevel:["rageface"], style:["power-rock","peak-and-soar"], features:["marathon-jams"], notableJams:["Split Open and Melt","YEM"], description:"Early '93 rager. Raw energy and tight playing." },
  "1993-08-13": { energy:5, vibes:["raging","melodic","exploratory"], energyLevel:["rageface","high-octane"], style:["type-ii-heavy","peak-and-soar"], features:["marathon-jams"], notableJams:["YEM (30 min)","David Bowie"], description:"Classic '93 with a titanic YEM and peak-era Bowie." },
  "1994-06-22": { energy:5, vibes:["raging","funky","exploratory"], energyLevel:["rageface"], style:["type-ii-heavy","groove-based"], features:["marathon-jams"], notableJams:["Tweezer (34 min)","Bowie (28 min)"], description:"Legendary '94 with a genre-defining Tweezer and monstrous Bowie." },
  "1994-12-31": { energy:5, vibes:["raging","celebratory","melodic"], energyLevel:["rageface","high-octane"], style:["peak-and-soar","power-rock"], features:["nye","marathon-jams"], notableJams:["Bowie (25 min)","Slave"], description:"The Gamehendge NYE with devastating Bowie." },
  "1995-10-31": { energy:4, vibes:["melodic","blissful","celebratory"], energyLevel:["steady-groove","building"], style:["composed-tight"], features:["halloween","cover-heavy"], notableJams:["Reba","Slave"], description:"The Quadrophenia Halloween." },
  "1995-12-31": { energy:5, vibes:["raging","blissful","celebratory"], energyLevel:["rageface","high-octane"], style:["type-ii-heavy","peak-and-soar"], features:["nye","marathon-jams"], notableJams:["Runaway Jim (25 min)"], description:"The time machine NYE with a massive Jim." },
  "1996-10-31": { energy:4, vibes:["funky","dark","exploratory"], energyLevel:["building","high-octane"], style:["groove-based","type-ii-heavy"], features:["halloween","cover-heavy"], notableJams:["Crosseyed and Painless","Antelope"], description:"Remain in Light Halloween. Catalyzed the funk era." },
  "1997-11-17": { energy:5, vibes:["dark","funky","exploratory"], energyLevel:["rageface","building"], style:["type-ii-heavy","groove-based","tension-release"], features:["marathon-jams"], notableJams:["Tweezer (35 min)","Ghost (22 min)"], description:"Peak fall '97. The Denver Tweezer is endlessly deep cow-funk." },
  "1997-11-22": { energy:5, vibes:["dark","funky","exploratory","raging"], energyLevel:["rageface"], style:["type-ii-heavy","segue-fest","tension-release"], features:["marathon-jams"], notableJams:["Halley's>Tweezer (40+ min)","Ghost"], description:"'Phish Destroys America' Hampton. One of the greatest shows ever." },
  "1997-12-31": { energy:5, vibes:["funky","celebratory","exploratory"], energyLevel:["high-octane"], style:["type-ii-heavy","groove-based"], features:["nye"], notableJams:["Runaway Jim (22 min)","DWD"], description:"NYE '97. Smoking Jim, transcendent Hood." },
  "1998-04-02": { energy:4, vibes:["ambient","exploratory","blissful"], energyLevel:["building"], style:["ambient-space","type-ii-heavy"], features:["marathon-jams"], notableJams:["Roses Are Free (20 min)","Bathtub Gin"], description:"Island Tour night 2. Roses Are Free goes to outer space." },
  "1998-04-03": { energy:5, vibes:["dark","raging","exploratory"], energyLevel:["rageface"], style:["type-ii-heavy","tension-release"], features:["marathon-jams"], notableJams:["Tweezer (30 min)","Piper"], description:"Island Tour night 3. One of the nastiest Tweezers ever." },
  "1999-12-31": { energy:5, vibes:["blissful","exploratory","celebratory","transcendent"], energyLevel:["building","high-octane"], style:["type-ii-heavy","ambient-space","peak-and-soar"], features:["festival","nye","marathon-jams"], notableJams:["Runaway Jim (60+ min sunrise)","Rock and Roll"], description:"The millennium show. Sunrise Jim is the most iconic moment in Phish history." },
  "2003-02-28": { energy:5, vibes:["raging","dark","exploratory"], energyLevel:["rageface"], style:["type-ii-heavy","tension-release","power-rock"], features:["marathon-jams"], notableJams:["Piper (25 min)","Tweezer"], description:"IT-era Nassau heater. Piper goes nuclear." },
  "2012-08-31": { energy:5, vibes:["raging","exploratory","blissful"], energyLevel:["rageface","high-octane"], style:["type-ii-heavy","peak-and-soar"], features:["marathon-jams"], notableJams:["Rock and Roll (24 min)","Light (22 min)"], description:"Legendary Dick's 2012. Rock and Roll hits escape velocity." },
  "2015-08-22": { energy:5, vibes:["blissful","exploratory","transcendent","raging"], energyLevel:["building","rageface"], style:["type-ii-heavy","peak-and-soar","segue-fest"], features:["festival","marathon-jams"], notableJams:["Tweezer>Caspian (50+ min)","No Men (20 min)"], description:"Magnaball Saturday. Tweezer>Caspian is a top-5 all-time jam." },
  "2017-07-25": { energy:5, vibes:["exploratory","dark","blissful"], energyLevel:["building"], style:["type-ii-heavy","ambient-space"], features:["marathon-jams"], notableJams:["Lawn Boy (18 min)","Everything's Right (20 min)"], description:"Baker's Dozen Jimmies Night. Lawn Boy goes type 2 for the first time." },
  "2017-08-06": { energy:5, vibes:["raging","blissful","celebratory"], energyLevel:["high-octane","rageface"], style:["type-ii-heavy","peak-and-soar"], features:["marathon-jams"], notableJams:["Soul Planet (22 min)","Simple (25 min)"], description:"Baker's Dozen finale. Simple reaches transcendence." },
  "2021-08-07": { energy:5, vibes:["raging","blissful","celebratory"], energyLevel:["rageface","high-octane"], style:["type-ii-heavy","peak-and-soar"], features:["marathon-jams"], notableJams:["Simple (28 min)","Tweezer"], description:"Comeback from the pandemic. Simple goes 28 minutes." },
  "2022-04-22": { energy:5, vibes:["raging","exploratory","dark"], energyLevel:["rageface"], style:["type-ii-heavy","tension-release"], features:["marathon-jams"], notableJams:["Carini (25 min)","Everything's Right (20 min)"], description:"Spring MSG heater. Carini goes to the darkest places." },
  "2023-12-31": { energy:5, vibes:["celebratory","blissful","raging"], energyLevel:["high-octane","rageface"], style:["type-ii-heavy","peak-and-soar"], features:["nye","marathon-jams"], notableJams:["Tweezer (30 min)","Ghost (22 min)"], description:"NYE 2023. Titanic Tweezer and Ghost for the ages." },
};

// ── API fetcher ──────────────────────────────────────────────────────────────

async function pnetFetch(urlPath, params = {}, retries = 3) {
  const qs = new URLSearchParams({ apikey: API_KEY, ...params }).toString();
  const url = `${PNET_BASE}${urlPath}.json?${qs}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      if (json.error && json.error !== 0) throw new Error(json.error_message || "API error");
      return json.data || [];
    } catch (e) {
      if (attempt === retries) throw e;
      await sleep(1000 * attempt);
    }
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Building Phish shows database...\n");

  // Phase 1: Fetch all shows by year
  const allShows = [];
  for (let year = 1983; year <= 2026; year++) {
    try {
      const data = await pnetFetch(`/shows/showyear/${year}`, { order_by: "showdate" });
      const shows = data
        .filter((s) => s.artistid === "1" || s.artist_name === "Phish")
        .map((s) => ({
          date: s.showdate,
          venue: s.venue || "",
          city: s.city || "",
          state: s.state || "",
          era: getEra(s.showdate),
          rating: parseFloat(s.rating) || 0,
          reviews: parseInt(s.reviews) || 0,
        }));
      allShows.push(...shows);
      process.stdout.write(`  ${year}: ${shows.length} shows\n`);
    } catch (e) {
      process.stdout.write(`  ${year}: FAILED (${e.message})\n`);
    }
    await sleep(150);
  }
  console.log(`\nTotal shows loaded: ${allShows.length}\n`);

  // Phase 2: Fetch setlists (batched, rate-limited)
  console.log("Fetching setlists...\n");
  const BATCH = 5;
  let done = 0;
  for (let i = 0; i < allShows.length; i += BATCH) {
    const batch = allShows.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async (show) => {
        try {
          const data = await pnetFetch(`/setlists/showdate/${show.date}`);
          show.songs = [...new Set(data.map((s) => s.song || s.songname || "").filter(Boolean))];
          const jc = data.filter((s) => s.isjamchart === "1");
          show.jamCharts = jc.length;
          show.notableJams = jc.map(
            (s) => s.song + (s.jamchart_description ? ` — ${s.jamchart_description.slice(0, 80)}` : "")
          );
        } catch {
          show.songs = [];
          show.jamCharts = 0;
          show.notableJams = [];
        }
      })
    );
    done += batch.length;
    if (done % 100 === 0 || done === allShows.length) {
      process.stdout.write(`  ${done}/${allShows.length} setlists\n`);
    }
    await sleep(200);
  }

  // Phase 3: Derive metadata + apply curated overrides
  console.log("\nDeriving metadata...");
  for (const show of allShows) {
    // Auto-detect features from date
    show.features = [];
    if (show.date.includes("-10-31")) show.features.push("halloween");
    if (show.date.includes("-12-31")) show.features.push("nye");
    if ((show.jamCharts || 0) >= 4) show.features.push("marathon-jams");

    // Derive energy / vibes / style from rating + jamCharts + era
    const meta = deriveShowMetadata(show.date, show.rating, show.jamCharts || 0);
    show.energy = meta.energy;
    show.energyLevel = meta.energyLevel;
    show.style = meta.style;
    show.vibes = meta.vibes;
    show.description = "";
    show.source = "live";

    // Curated overrides for hand-picked shows
    const c = CURATED[show.date];
    if (c) {
      Object.assign(show, c);
      show.source = "curated";
    }
  }

  // Save
  const outDir = path.join(__dirname, "..", "public", "data");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "shows.json");
  fs.writeFileSync(outPath, JSON.stringify(allShows));

  const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`\nDone! Saved ${allShows.length} shows to public/data/shows.json (${sizeKB} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
