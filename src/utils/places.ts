import { Place, PlaceType } from "./types";

type GeoapifyFeature = {
  properties: {
    place_id: string;
    name?: string;
    lat: number;
    lon: number;
    categories?: string[];
    address_line2?: string;
  };
};

type GeoapifyResponse = {
  features: GeoapifyFeature[];
};

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const categoryMap: Record<PlaceType, string> = {
  restaurant: "catering.restaurant",
  hotel: "accommodation.hotel",
  attraction: "tourism.sights",
};

export const fetchNearbyPlaces = async (
  lat: number,
  lon: number,
  type: PlaceType
): Promise<Place[]> => {
  const radius = 1200;

   const url = `https://api.geoapify.com/v2/places?categories=${categoryMap[type]}&filter=circle:${lon},${lat},${radius}&limit=20&apiKey=${GEOAPIFY_KEY}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error("Geopify error:", res.status);
      return [];
    }

    const data: GeoapifyResponse = await res.json();

    return (data.features || [])
      .map((f): Place | null => {
        const props = f.properties;

        if (!props.name) return null;

        return {
          id: `geo-${type}-${props.place_id}`,
          name: props.name,
          lat: props.lat,
          lon: props.lon,
          type,
          source: "external",
        };
      })
       .filter((p: Place | null): p is Place => p !== null);
  } catch (err) {
    console.error("Geoapify fetch error:", err);
    return [];
  }
};