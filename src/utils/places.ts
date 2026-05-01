import { Place, PlaceType } from "./types";

type OverpassElement = {
  id: number;
  lat: number;
  lon: number;
  center?: {
    lat: number; 
    lon: number
  };
  tags?: {
    name?: string;
  };
};

export const fetchNearbyPlaces = async (
  lat: number,
  lon: number,
  type: PlaceType
): Promise<Place[]> => {

  const radius = 1200;

  const queries: Record<PlaceType, string> = {
    restaurant: `
      (
        node["amenity"="restaurant"](around:${radius},${lat},${lon});
        way["amenity"="restaurant"](around:${radius},${lat},${lon});
        relation["amenity"="restaurant"](around:${radius},${lat},${lon});
      );
    `,
    hotel: `
      (
        node["tourism"="hotel"](around:${radius},${lat},${lon});
        way["tourism"="hotel"](around:${radius},${lat},${lon});
        relation["tourism"="hotel"](around:${radius},${lat},${lon});
      );
    `,
    attraction: `
      (
        node["tourism"="attraction"](around:${radius},${lat},${lon});
        way["tourism"="attraction"](around:${radius},${lat},${lon});
        relation["tourism"="attraction"](around:${radius},${lat},${lon});
      );
    `,
  };

  const query = `
    [out:json][timeout:10];
    ${queries[type]}
    out center;
  `;

  const endpoints = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
  ];

  for (const url of endpoints) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(url, {
        method: "POST",
        body: query,
        headers: {
          "Content-Type": "text/plain",
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        console.warn(`Overpass ${url} failed: ${res.status}`);
        continue;
      }

      const data = await res.json();

      return (data.elements as OverpassElement[])
        .filter((el) => el.tags?.name)
        .map((el): Place => ({
          id: `ext-${type}-${el.id}`,
          name: el.tags!.name!,
          lat: el.lat ?? el.center?.lat,
          lon: el.lon ?? el.center?.lon,
          type,
          source: "external",
        }))
        .filter((p) => p.lat != null && p.lon != null)
        .slice(0, 20);

    } catch (err) {
      console.warn(`Overpass ${url} error:`, err);
    } finally {
      clearTimeout(timeout);
    }

    // small delay to avoid hammering servers
    await new Promise((r) => setTimeout(r, 300));
  }

  console.error("All Overpass endpoints failed");
  return [];
};