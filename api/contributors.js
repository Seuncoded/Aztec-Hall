const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const sheetUrl = process.env.SHEET_JSON_URL;

    if (!sheetUrl) {
      return res.status(500).json({ error: 'Missing SHEET_JSON_URL environment variable' });
    }

    const response = await fetch(sheetUrl);
    if (!response.ok) {
      throw new Error(`Google Sheet fetch failed: ${response.status}`);
    }

    const data = await response.json();

    // Optional: filter or process data here
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};