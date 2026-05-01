import { Place, PlaceType } from "./types";

type OverpassElement = {
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
  };
};

export const fetchNearbyPlaces = async (
  lat: number,
  lon: number,
  type: PlaceType
): Promise<Place[]> => {
  const radius = 1200; // 🔽 reduced for reliability

  const queries: Record<PlaceType, string> = {
    restaurant: `node["amenity"="restaurant"](around:${radius},${lat},${lon});`,
    hotel: `node["tourism"="hotel"](around:${radius},${lat},${lon});`,
    attraction: `node["tourism"="attraction"](around:${radius},${lat},${lon});`,
  };

  const query = `
    [out:json][timeout:10];
    ${queries[type]}
    out body;
  `;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // ⏱️ hard timeout

  try {
    const res = await fetch(
      "https://overpass.kumi.systems/api/interpreter", // 🔥 better endpoint
      {
        method: "POST",
        body: query,
        headers: {
          "Content-Type": "text/plain",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Overpass error: ${res.status}`);
    }

    const data = await res.json();

    return (data.elements as OverpassElement[])
      .filter((el) => el.tags?.name)
      .slice(0, 20) // 🔥 limit results (huge UX + perf win)
      .map((el) => ({
        id: `ext-${type}-${el.id}`,
        name: el.tags!.name!,
        lat: el.lat,
        lon: el.lon,
        type,
        source: "external",
      }));
  } catch (err) {
    console.error("Overpass error:", err);
    return [];
  }
};