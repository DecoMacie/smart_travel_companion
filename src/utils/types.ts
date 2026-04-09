export interface Place {
  id: string;
  lat: number;
  lon: number;
  name: string;
  type: "attraction" | "hotel" | "restaurant" | string;
}