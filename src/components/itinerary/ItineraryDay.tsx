import React, { useEffect, useState } from "react";
import { db } from "../../services/firebase/firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  // writeBatch, //for future batch processes (reorder)
} from "firebase/firestore";
import { WeatherDay } from "../../services/weather/weather";
import { ItineraryDayType } from "../../utils/types";

interface ItineraryItem {
  id: string;
  name: string;
  type: "note" | "place";
  order: number;

  placeId?: string;
  lat?: number;
  lon?: number;
}

interface ItineraryDayProps {
  tripId: string;
  day: ItineraryDayType;
  weather?: WeatherDay;
}

const ItineraryDay: React.FC<ItineraryDayProps> = ({
  tripId,
  day,
  weather,
}) => {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [newItem, setNewItem] = useState("");

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const [editValue, setEditValue] = useState("");

  // Realtime listener
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

  // Add item
  const addItem = async () => {
    if (!newItem.trim()) return;

    const nextOrder =
      items.length > 0 ? Math.max(...items.map((i) => i.order)) + 1 : 1;

    try {
      await addDoc(
        collection(db, "trips", tripId, "itinerary", day.id, "items"),
        {
          name: newItem.trim(),
          type: "note",
          order: nextOrder,
        },
      );

      setNewItem("");
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  // Delete item
  const handleDelete = async (itemId: string) => {
    try {
      await deleteDoc(
        doc(db, "trips", tripId, "itinerary", day.id, "items", itemId),
      );
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  // Start editing
  const handleEdit = (item: ItineraryItem) => {
    setEditingItemId(item.id);
    setEditValue(item.name);
  };

  // Save edit
  const handleSaveEdit = async (itemId: string) => {
    if (!editValue.trim()) return;

    try {
      await updateDoc(
        doc(db, "trips", tripId, "itinerary", day.id, "items", itemId),
        {
          name: editValue.trim(),
        },
      );

      setEditingItemId(null);
      setEditValue("");
    } catch (err) {
      console.error("Failed to update item:", err);
    }
  };

  // Optional: reorder items using batched writes
  // const reorderItems = async (
  //   reordered: ItineraryItem[]
  // ) => {
  //   try {
  //     const batch = writeBatch(db);

  //     reordered.forEach((item, index) => {
  //       const ref = doc(
  //         db,
  //         "trips",
  //         tripId,
  //         "itinerary",
  //         day.id,
  //         "items",
  //         item.id
  //       );

  //       batch.update(ref, {
  //         order: index + 1,
  //       });
  //     });

  //     await batch.commit();
  //   } catch (err) {
  //     console.error("Failed to reorder items:", err);
  //   }
  // };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-lg">Day {day.dayNumber}</h4>

          {day.date && <p className="text-sm text-gray-500">{day.date}</p>}
        </div>

        {/* Weather */}
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg min-w-[110px] justify-center">
          {weather ? (
            <>
              <img
                src={weather.icon}
                alt={weather.condition}
                className="w-8 h-8"
              />

              <div className="text-right leading-tight">
                <div className="text-sm font-medium text-gray-700">
                  {Math.round(weather.temp)}°C
                </div>

                <div className="text-xs text-gray-500">{weather.condition}</div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-gray-400 leading-tight">
              <span className="text-xl">☁️</span>

              <span className="text-xs">Unavailable</span>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border p-2 rounded-lg bg-gray-50 flex justify-between items-center"
          >
            {editingItemId === item.id ? (
              <input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSaveEdit(item.id)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(item.id)}
                className="border px-2 py-1 rounded w-full mr-2"
                autoFocus
              />
            ) : (
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>

                <div className="text-xs text-gray-500 capitalize">
                  {item.type}
                </div>
              </div>
            )}

            <div className="flex gap-2 ml-2">
              {item.type === "note" && (
                <button
                  onClick={() => handleEdit(item)}
                  className="text-sm hover:bg-gray-200 rounded px-2"
                >
                  ✏️
                </button>
              )}

              <button
                onClick={() => handleDelete(item.id)}
                className="text-sm hover:bg-red-100 text-red-600 rounded px-2"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add item */}
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
          className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          ➕
        </button>
      </div>
    </div>
  );
};

export default ItineraryDay;
