import React, { useEffect } from "react";
import { db } from "../../services/firebase/firebase";
import { collection, writeBatch, doc, getDocs } from "firebase/firestore";
import ItineraryDay from "./ItineraryDay";
import { ItineraryDayType } from "../../utils/types";
import { generateTripDays } from "../../utils/generateTripDays";
import { WeatherDay } from "../../services/weather/weather";

interface ItineraryProps {
  tripId: string;
  startDate: string;
  endDate: string;
  days: ItineraryDayType[];
  weather: WeatherDay[];
}

const Itinerary: React.FC<ItineraryProps> = ({
  tripId,
  startDate,
  endDate,
  days,
  weather,
}) => {
  // Create itinerary docs once
  useEffect(() => {
    const createDaysIfNeeded = async () => {
      if (!tripId) return;

      try {
        const ref = collection(db, "trips", tripId, "itinerary");

        const snapshot = await getDocs(ref);

        // Prevent duplicates
        if (!snapshot.empty) return;

        const generatedDays = generateTripDays(startDate, endDate);

        const batch = writeBatch(db);

        generatedDays.forEach((day) => {
          const docRef = doc(
            db,
            "trips",
            tripId,
            "itinerary",
            `day-${day.dayNumber}`,
          );

          batch.set(docRef, day, { merge: true });
        });

        await batch.commit();
      } catch (err) {
        console.error("Failed to create itinerary:", err);
      }
    };

    createDaysIfNeeded();
  }, [tripId, startDate, endDate]);
  console.log("weather", weather);
  console.log("days", days);

  return (
    <div className="mt-6 p-4 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Itinerary</h3>

      <div className="space-y-4">
        {days.map((day) => {
          const weatherDay = weather.find((w) => w.date === day.date);

          return (
            <ItineraryDay
              key={day.id}
              tripId={tripId}
              day={day}
              weather={weatherDay}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Itinerary;
