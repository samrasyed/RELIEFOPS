export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.API_KEY;
  const query = req.query.query;

  if (!API_KEY) {
    return res.status(500).json({ error: 'Geoapify API key is not configured' });
  }

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Missing required query parameter: query' });
  }

  const params = new URLSearchParams({
    text: query.trim(),
    filter: 'countrycode:in',
    limit: '5',
    apiKey: API_KEY,
  });

  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return res.status(response.status).json({
        error: 'Geoapify request failed',
        status: response.status,
        details: data?.message || data?.error || 'No error details returned',
      });
    }

    const features = Array.isArray(data?.features) ? data.features : [];

    return res.status(200).json({
      features: features.map((feature) => ({
        properties: {
          ...feature.properties,
          formatted: feature.properties?.formatted || '',
        },
        geometry: {
          ...feature.geometry,
          coordinates: Array.isArray(feature.geometry?.coordinates)
            ? feature.geometry.coordinates
            : [],
        },
      })),
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch Geoapify results',
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
