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

export const fetchNearbyPlaces = async (
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
    const res = await fetch("/api/overpass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      console.error("Overpass API error:", res.status);
      return [];
    }

    const data: OverpassResponse = await res.json();
    const elements = data.elements ?? [];

    const mapped = elements.map((el): Place | null => {
      const finalLat = el.lat ?? el.center?.lat;
      const finalLon = el.lon ?? el.center?.lon;

      if (finalLat == null || finalLon == null) return null;
      if (!el.tags?.name) return null;

      return {
        id: `ext-${type}-${el.id}`,
        name: el.tags.name,
        lat: finalLat,
        lon: finalLon,
        type,
        source: "external",
      };
    });

    const places: Place[] = mapped.filter(
      (p): p is Place => p !== null
    ).slice(0, 20);

    return places;
  } catch (err) {
    console.error("Overpass fetch error:", err);
    return [];
  }
};