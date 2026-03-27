import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export const updateUser = async (
  userId: string,
  data: Partial<{
    name: string;
    country: string;
    preferredLanguage: string;
    travelPreferences: {
      style: string;
      tripLength: string;
      interests: string[];
    };
    options: {
        simplifiedNavigation: boolean;
        largeText: boolean;
        highContrast: boolean;
    };
    privacyAccepted: boolean;
    onboardingCompleted: boolean;
  }>
) => {
  const ref = doc(db, "users", userId);
  await setDoc(ref, data, { merge: true });
};
