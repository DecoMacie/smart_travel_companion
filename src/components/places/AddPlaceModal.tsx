import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebase/firebase";
import { geocodeLocation } from "../../utils/geocode";

interface AddPlaceModalProps {
  tripId: string;
  onClose: () => void;
  onAdded: () => void;
}

const AddPlaceModal: React.FC<AddPlaceModalProps> = ({
  tripId,
  onClose,
  onAdded,
}) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("attraction");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setError("");
    setLoading(true);

    if (!name) {
      setError("Please enter a place name.");
      setLoading(false);
      return;
    }

    try {
      // Geocode the place name
      const coords = await geocodeLocation(name);
      if (!coords) {
        setError("Could not find this location.");
        setLoading(false);
        return;
      }

      // Save to Firestore
      await addDoc(collection(db, "trips", tripId, "places"), {
        name,
        type,
        lat: coords.lat,
        lon: coords.lon,
        address: coords.address,
      });

      onAdded();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add place.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-1000">
      <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add Place</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Name */}
        <div className="mb-3">
          <label className="block text-sm mb-1">Place Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded-lg"
            placeholder="Eiffel Tower"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Type */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Type</label>
          <select
            className="w-full border px-3 py-2 rounded-lg"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="attraction">Attraction</option>
            <option value="hotel">Hotel</option>
            <option value="restaurant">Restaurant</option>
            <option value="activity">Activity</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPlaceModal;
