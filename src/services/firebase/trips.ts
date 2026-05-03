import { db, auth } from "./firebase";
import { Place } from "../../utils/types";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from "firebase/firestore";

interface Destination {
  name: string; // "Paris, France"
  lat: number;
  lon: number;
}

// Trip type definition
export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: Destination
  startDate: string;
  endDate: string;
  notes?: string;
  places?: Place[]
  imageUrl?: string | null;
}

/**
 * SAFE: always checks auth first
 */
export const getTripById = async (tripId: string): Promise<Trip | null> => {
  const user = auth.currentUser;

  if (!user) return null;

  const ref = doc(db, "trips", tripId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data() as Omit<Trip, "id">;

  if (data.userId !== user.uid) return null;

  return { id: snap.id, ...data };
};

export const getUserTrips = async (userId: string): Promise<Trip[]> => {
  if (!userId) return [];

  const q = query(collection(db, "trips"), where("userId", "==", userId));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Trip, "id">),
  }));
};

// Create a new trip
export const createTrip = async (trip: Omit<Trip, "id">) => {
  const ref = await addDoc(collection(db, "trips"), trip);
  return ref.id;
};

// Update an existing trip
export const updateTrip = async (tripId: string, data: Partial<Trip>) => {
  const ref = doc(db, "trips", tripId);
  await updateDoc(ref, data);
};

// Delete a trip
export const deleteTrip = async (tripId: string) => {
  await deleteDoc(doc(db, "trips", tripId));
};