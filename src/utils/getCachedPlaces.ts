import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase/firebase";
import { fetchNearbyPlacesFromOverpass } from "./places"; // overpass logic
import { PlaceType } from "./types";

export const getCachedPlaces = async (
  lat: number,
  lon: number,
  type: PlaceType
) => {
  const key = `${lat.toFixed(3)}_${lon.toFixed(3)}_${type}`;
  const ref = doc(db, "places_cache", key);

  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data().places;
  }

  const fresh = await fetchNearbyPlacesFromOverpass(lat, lon, type);

  await setDoc(ref, {
    places: fresh,
    createdAt: Date.now(),
  });

  return fresh;
};