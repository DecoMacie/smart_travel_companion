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
  const radius = 2000;

  const queries: Record<PlaceType, string> = {
    restaurant: `node["amenity"="restaurant"](around:${radius},${lat},${lon});`,
    hotel: `node["tourism"="hotel"](around:${radius},${lat},${lon});`,
    attraction: `node["tourism"="attraction"](around:${radius},${lat},${lon});`,
  };

  const query = `
    [out:json];
    ${queries[type]}
    out;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    if (!res.ok) {
      throw new Error("Failed to fetch places");
    }

    const data = await res.json();

    return (data.elements as OverpassElement[])
      .filter((el) => el.tags?.name)
      .map((el) => ({
        id: `ext-${type}-${el.id}`,
        name: el.tags!.name!,
        lat: el.lat,
        lon: el.lon,
        type,
        source: "external", // 👈 nice improvement using your model
      }));
  } catch (err) {
    console.error("Overpass error:", err);
    return [];
  }
};