export type PlaceType = "attraction" | "hotel" | "restaurant";
export type PlaceSource = "external" | "user";

export interface Place {
  id: string;
  lat: number;
  lon: number;
  name: string;
  address?: string;
  type: PlaceType;
  source?: PlaceSource; 
}

export interface ItineraryDayType {
  id: string;
  dayNumber: number;
  date?: string | null;
}

export interface UserProfile {
  name: string;
  country?: string;
  preferredLanguage?: string;

  travelPreferences?: {
    style?: {
      id: string;
      hotelVal: string;
      ticketVal: string;
    };
    tripLength?: string;
    interests?: string[];
  };

  options?: {
    simplifiedNavigation?: boolean;
    largeText?: boolean;
    highContrast?: boolean;
  };

  privacyAccepted?: boolean;
  onboardingCompleted?: boolean;
}