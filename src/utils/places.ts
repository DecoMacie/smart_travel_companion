import { Place, PlaceType } from "./types";

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

export const fetchNearbyPlacesFromOverpass = async (
  lat: number,
  lon: number,
  type: PlaceType
): Promise<Place[]> => {
  const radius = 1200;

  const tagMap: Record<PlaceType, string> = {
    restaurant: `"amenity"="restaurant"`,
    hotel: `"tourism"="hotel"`,
    attraction: `"tourism"="attraction"`,
  };

  const query = `
    [out:json][timeout:10];
    (
      node[${tagMap[type]}](around:${radius},${lat},${lon});
      way[${tagMap[type]}](around:${radius},${lat},${lon});
      relation[${tagMap[type]}](around:${radius},${lat},${lon});
    );
    out center;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain", // ✅ critical fix
      },
      body: query,
    });

    if (!res.ok) {
      console.error("Overpass API error:", res.status);
      return [];
    }

    const data: OverpassResponse = await res.json();

    return (data.elements ?? [])
      .map((el): Place | null => {
        const latFinal = el.lat ?? el.center?.lat;
        const lonFinal = el.lon ?? el.center?.lon;

        if (latFinal == null || lonFinal == null) return null;
        if (!el.tags?.name) return null;

        return {
          id: `ext-${type}-${el.id}`,
          name: el.tags.name,
          lat: latFinal,
          lon: lonFinal,
          type,
          source: "external" as const,
        };
      })
      .filter((p): p is Place => p !== null)
      .slice(0, 20);
  } catch (err) {
    console.error("Overpass fetch error:", err);
    return [];
  }
};