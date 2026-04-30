import { UserProfile } from "../../utils/types";
import { db } from "./firebase";
import { doc, setDoc, getDoc, DocumentReference } from "firebase/firestore";

export type TravelStyle = {
  id: string;
  hotelVal: string;
  ticketVal: string;
};

export type TravelPreferences = {
  style?: TravelStyle;
  tripLength?: string;
  interests?: string[];
};

export type AccessibilityOptions = {
  simplifiedNavigation?: boolean;
  largeText?: boolean;
  highContrast?: boolean;
};

export const getUser = async (uid: string): Promise<UserProfile | null> => {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    return snap.exists() ? snap.data() as UserProfile : null;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return null;
  }
};

export const userDoc = (uid: string) =>
  doc(db, "users", uid) as DocumentReference<UserProfile>;

export const updateUser = async (
  userId: string,
  data: Partial<{
    name: string;
    country: string;
    preferredLanguage: string;
    travelPreferences: TravelPreferences;
    options: AccessibilityOptions;
    privacyAccepted: boolean;
    onboardingCompleted: boolean;
  }>
) => {
  const ref = doc(db, "users", userId);
  await setDoc(ref, data, { merge: true });
};