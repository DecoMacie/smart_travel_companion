import React, { useEffect, useState } from "react";
import { db } from "../../services/firebase/firebase";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import ItineraryDay from "./ItineraryDay";
import { ItineraryDayType } from "../../utils/types";

interface ItineraryProps {
  tripId: string;
  startDate: string;
  endDate: string;
}

const Itinerary: React.FC<ItineraryProps> = ({
  tripId,
  startDate,
  endDate,
}) => {
  const [days, setDays] = useState<ItineraryDayType[]>([]);

  useEffect(() => {
    const ref = collection(db, "trips", tripId, "itinerary");
    const q = query(ref, orderBy("dayNumber", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ItineraryDayType[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ItineraryDayType, "id">),
      }));

      setDays(list);
    });

    return () => unsubscribe();
  }, [tripId]);

  const getDateForDay = (start: string, dayNumber: number) => {
    const date = new Date(start);
    date.setDate(date.getDate() + (dayNumber - 1));
    return date.toISOString().split("T")[0];
  };

  const getMaxDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff = end.getTime() - start.getTime();

    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  const addDay = async () => {
    const maxDays = getMaxDays();

    const highestDay =
      days.length > 0 ? Math.max(...days.map((d) => d.dayNumber)) : 0;

    if (highestDay >= maxDays) {
      alert("You've reached the maximum number of days for this trip.");
      return;
    }

    const nextDay = days.length + 1;

    const date = getDateForDay(startDate, nextDay);

    await addDoc(collection(db, "trips", tripId, "itinerary"), {
      dayNumber: nextDay,
      date,
    });
  };

  return (
    <div className="mt-6 p-4 bg-white rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-3">Itinerary</h3>

      <div className="space-y-4">
        {days.map((day) => (
          <ItineraryDay key={day.id} tripId={tripId} day={day} />
        ))}
      </div>

      <button
        onClick={addDay}
        disabled={days.length >= getMaxDays()}
        className={`mt-4 w-full py-2 rounded-lg transition ${
          days.length >= getMaxDays()
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        + Add Day
      </button>
    </div>
  );
};

export default Itinerary;
