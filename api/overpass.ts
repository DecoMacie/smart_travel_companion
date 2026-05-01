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

  const { query } = req.body;

  try {
    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: query,
      }
    );

    const data: OverpassResponse = await response.json();

    return res.status(200).json(data);
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ error: "Overpass failed" });
  }
}