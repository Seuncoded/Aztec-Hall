// /api/contributors.js
export default async function handler(req, res) {
  const SHEET_URL = process.env.SHEET_JSON_URL;
  if (!SHEET_URL) {
    return res.status(500).json({ error: "SHEET_JSON_URL env var not set" });
  }
  try {
    // fetch is built-in on Vercel (Node 18+)
    const r = await fetch(SHEET_URL, { cache: "no-store" });
    if (!r.ok) throw new Error(`Upstream ${r.status}`);
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=86400");
    return res.status(200).json(data); // must return an array
  } catch (e) {
    console.error("contributors error:", e);
    return res.status(200).json([]); // fail-soft
  }
}