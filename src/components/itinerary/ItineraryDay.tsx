import React, { useEffect, useState } from "react";
import { db } from "../../services/firebase/firebase";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { ItineraryDayType } from "../../utils/types";

interface ItineraryItem {
  id: string;
  name: string;
  type: string;
  order: number;
}

interface ItineraryDayProps {
  tripId: string;
  day: ItineraryDayType;
}

const ItineraryDay: React.FC<ItineraryDayProps> = ({ tripId, day }) => {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    const ref = collection(db, "trips", tripId, "itinerary", day.id, "items");

    const q = query(ref, orderBy("order", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: ItineraryItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<ItineraryItem, "id">),
      }));

      setItems(list);
    });

    return () => unsubscribe();
  }, [tripId, day.id]);

  const addItem = async () => {
    if (!newItem.trim()) return;

    const nextOrder =
      items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 1;

    await addDoc(
      collection(db, "trips", tripId, "itinerary", day.id, "items"),
      {
        name: newItem.trim(),
        type: "note",
        order: nextOrder,
      },
    );

    setNewItem("");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h4 className="font-semibold mb-3">
        Day {day.dayNumber}
        {day.date && (
          <span className="ml-2 text-sm text-gray-500">({day.date})</span>
        )}
      </h4>

      <div className="space-y-2 mb-3">
        {items.map((item) => (
          <div key={item.id} className="border p-2 rounded-lg bg-gray-50">
            {item.name}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add note or place"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          className="flex-1 border px-3 py-2 rounded-lg"
        />
        <button
          onClick={addItem}
          className="px-4 bg-blue-600 text-white rounded-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ItineraryDay;
