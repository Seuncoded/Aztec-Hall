// /api/contributors.js
export default async function handler(req, res) {
  const SHEET_JSON_URL = process.env.SHEET_JSON_URL; // set on Vercel
  if (!SHEET_JSON_URL) {
    return res.status(500).json({ error: "SHEET_JSON_URL env var not set" });
  }
  try {
    const r = await fetch(SHEET_JSON_URL, { cache: "no-store" });
    if (!r.ok) throw new Error(`Upstream ${r.status}`);
    const data = await r.json();
    // Cache 5m at the edge; keep serving while revalidating for 1 day
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
    res.status(200).json(data);
  } catch (e) {
    res.status(200).json([]); // fail-soft so site still loads
  }
}