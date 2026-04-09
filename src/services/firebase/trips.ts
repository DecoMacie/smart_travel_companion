import { db } from "./firebase";
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

// Trip type definition
export interface Trip {
  id: string;
  userId: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  notes?: string;
  places?: Place[]
}

// Fetch all trips for a specific user
export const getUserTrips = async (userId: string): Promise<Trip[]> => {
  const q = query(collection(db, "trips"), where("userId", "==", userId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as Trip[];
};

// Fetch a single trip by ID
export const getTripById = async (tripId: string): Promise<Trip | null> => {
  const ref = doc(db, "trips", tripId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data()
  } as Trip;
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
  const ref = doc(db, "trips", tripId);
  await deleteDoc(ref);
};