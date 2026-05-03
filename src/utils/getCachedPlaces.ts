import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase/firebase";
import { fetchNearbyPlaces } from "./places"; // overpass logic
import { PlaceType } from "./types";

export const getCachedPlaces = async (
  lat: number,
  lon: number,
  type: PlaceType,
) => {
  const key = `${lat.toFixed(3)}_${lon.toFixed(3)}_${type}`;
  const ref = doc(db, "places_cache", key);

  const snap = await getDoc(ref);

  const TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

  if (snap.exists()) {
    const data = snap.data();

    if (Date.now() - data.createdAt < TTL) {
      return data.places;
    }
  }

  const fresh = await fetchNearbyPlaces(lat, lon, type);

  await setDoc(ref, {
    places: fresh,
    createdAt: Date.now(),
  });

  return fresh;
};
