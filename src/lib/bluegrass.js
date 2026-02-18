/**
 * Curated list of bluegrass songs (covers + originals) that Phish plays live.
 * slug values match Phish.net's song slug identifiers.
 */
export const BLUEGRASS_SONGS = [
  {
    name: "Rocky Top",
    slug: "rocky-top",
    origin: "Felice & Boudleaux Bryant",
    type: "cover",
    description: "Tennessee's anthem — Phish's most beloved bluegrass singalong",
  },
  {
    name: "Nellie Kane",
    slug: "nellie-kane",
    origin: "Hot Rize",
    type: "cover",
    description: "Flat-pick showcase from the Colorado bluegrass legends",
  },
  {
    name: "Old Home Place",
    slug: "old-home-place",
    origin: "The Country Gentlemen",
    type: "cover",
    description: "Classic bluegrass lament — Phish plays it with fire",
  },
  {
    name: "Long Journey Home",
    slug: "long-journey-home",
    origin: "Traditional / Bill Monroe",
    type: "cover",
    description: "Old-time bluegrass standard, often acoustic",
  },
  {
    name: "Ginseng Sullivan",
    slug: "ginseng-sullivan",
    origin: "Norman Blake",
    type: "cover",
    description: "Acoustic fingerpicking folk-bluegrass gem",
  },
  {
    name: "Beauty of My Dreams",
    slug: "beauty-of-my-dreams",
    origin: "Del McCoury Band",
    type: "cover",
    description: "Contemporary bluegrass from Del McCoury",
  },
  {
    name: "Uncle Pen",
    slug: "uncle-pen",
    origin: "Bill Monroe",
    type: "cover",
    description: "A tribute to the father of bluegrass's fiddle-playing uncle",
  },
  {
    name: "Poor Heart",
    slug: "poor-heart",
    origin: "Phish",
    type: "original",
    description: "Phish's own fast-tempo bluegrass stomper — a crowd pleaser",
  },
  {
    name: "Dog Gone Dog",
    slug: "dog-gone-dog",
    origin: "Phish",
    type: "original",
    description: "Early Phish bluegrass-country original, rarely played",
  },
  {
    name: "If I Could",
    slug: "if-i-could",
    origin: "Phish",
    type: "original",
    description: "Gentle acoustic ballad with a bluegrass heart",
  },
  {
    name: "Fast Enough for You",
    slug: "fast-enough-for-you",
    origin: "Phish",
    type: "original",
    description: "Country-folk Phish original, often played softly acoustic",
  },
  {
    name: "Possum",
    slug: "possum",
    origin: "Phish",
    type: "original",
    description: "High-energy country-rock closer with deep roots",
  },
  {
    name: "Axilla",
    slug: "axilla",
    origin: "Phish",
    type: "original",
    description: "Short hard-rocking original — occasional setlist surprise",
  },
  {
    name: "Lawn Boy",
    slug: "lawn-boy",
    origin: "Phish",
    type: "original",
    description: "Lounge-country ballad featuring Page on Rhodes and vocals",
  },
  {
    name: "Farmhouse",
    slug: "farmhouse",
    origin: "Phish",
    type: "original",
    description: "Pastoral country closer from the Farmhouse album era",
  },
  {
    name: "Waste",
    slug: "waste",
    origin: "Phish",
    type: "original",
    description: "Tender acoustic love song — a softer side of Phish",
  },
];

export function getEra(dateStr) {
  const year = parseInt(dateStr?.substring(0, 4));
  if (year >= 1983 && year <= 2000) return "1.0";
  if (year >= 2002 && year <= 2004) return "2.0";
  if (year >= 2009 && year <= 2020) return "3.0";
  if (year >= 2021) return "4.0";
  return null; // hiatus or invalid
}

export const ERA_LABELS = {
  "1.0": { label: "Era 1.0", years: "1983–2000", color: "#f59e0b" },
  "2.0": { label: "Era 2.0", years: "2002–2004", color: "#ef4444" },
  "3.0": { label: "Era 3.0", years: "2009–2020", color: "#22c55e" },
  "4.0": { label: "Era 4.0", years: "2021–present", color: "#2dd4bf" },
};
