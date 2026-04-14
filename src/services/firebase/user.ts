import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

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