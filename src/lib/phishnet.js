const PNET_BASE = "https://api.phish.net/v5";

export async function pnetFetch(path, params = {}) {
  const apiKey = process.env.PHISHNET_API_KEY;
  if (!apiKey) {
    throw new Error("PHISHNET_API_KEY environment variable is not set");
  }
  const qs = new URLSearchParams({ apikey: apiKey, ...params }).toString();
  const url = `${PNET_BASE}${path}.json?${qs}`;
  const resp = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour
  if (!resp.ok) {
    throw new Error(`Phish.net API error: ${resp.status}`);
  }
  const json = await resp.json();
  if (json.error && json.error !== 0) {
    throw new Error(json.error_message || "Phish.net API error");
  }
  return json.data || [];
}
