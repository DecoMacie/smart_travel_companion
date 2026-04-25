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

const Itinerary: React.FC<ItineraryProps> = ({ tripId, startDate }) => {
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

  const addDay = async () => {
    const nextDay =
      days.length > 0 ? Math.max(...days.map((d) => d.dayNumber)) + 1 : 1;

    const date = getDateForDay(startDate, nextDay);

    await addDoc(collection(db, "trips", tripId, "itinerary"), {
      dayNumber: nextDay,
      date,
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Itinerary</h3>

      <div className="space-y-4">
        {days.map((day) => (
          <ItineraryDay key={day.id} tripId={tripId} day={day} />
        ))}
      </div>

      <button
        onClick={addDay}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        + Add Day
      </button>
    </div>
  );
};

export default Itinerary;
