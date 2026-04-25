export type PlaceType = "attraction" | "hotel" | "restaurant";

export interface Place {
  id: string;
  lat: number;
  lon: number;
  name: string;
  address?: string;
  type: PlaceType;
  source?: "user" | "external"; 
}

export interface ItineraryDayType {
  id: string;
  dayNumber: number;
  date: string | null;
}