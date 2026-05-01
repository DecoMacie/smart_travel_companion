type OverpassRequestBody = {
  query: string;
};

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: {
    name?: string;
  };
};

type OverpassResponse = {
  elements: OverpassElement[];
};

type VercelRequest = {
  method?: string;
  body: OverpassRequestBody;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (data: unknown) => void;
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body as OverpassRequestBody;

  const endpoints = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: query,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) continue;

      const data: OverpassResponse = await response.json();

      return res.status(200).json(data);
    } catch (err) {
      console.warn(`Overpass failed for ${url}`, err);
      continue; // 🔥 IMPORTANT: try next endpoint
    }
  }

  return res.status(500).json({
    error: "All Overpass endpoints failed",
  });
}