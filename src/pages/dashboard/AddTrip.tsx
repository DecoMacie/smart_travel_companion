import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { auth } from "../../services/firebase/firebase";
import { createTrip } from "../../services/firebase/trips";
import countriesData from "../../assets/travelcountries.json";
import { geocodeLocation } from "../../utils/geocode";
import { getDestinationImage } from "../../utils/getDestinationImage";

interface CountryOption {
  value: string;
  label: string;
}

const AddTrip: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState<CountryOption | null>(null);
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const DESTINATIONS: CountryOption[] = countriesData.countries.map((c) => ({
    value: c.code,
    label: c.name,
  }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (endDate < startDate) {
      alert("End date cannot be before start date");
      return;
    }

    if (!user) {
      setError("User not logged in.");
      return;
    }

    if (!title || !destination || !city || !startDate || !endDate) {
      setError("Please fill in all required fields.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError("End date cannot be before start date.");
      return;
    }

    setLoading(true);

    try {
      const fullLocation = `${city}, ${destination.label}`;

      // ✅ Geocode BEFORE saving
      const coords = await geocodeLocation(fullLocation);

      if (!coords) {
        setError("Could not find this location.");
        setLoading(false);
        return;
      }

      const imageUrl =
        (await getDestinationImage(`${fullLocation} travel`)) ||
        "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg";

      await createTrip({
        userId: user.uid,
        title,
        destination: {
          name: fullLocation,
          lat: coords.lat,
          lon: coords.lon,
        },
        startDate,
        endDate,
        notes,
        places: [],
        imageUrl,
      });

      // Reset form
      setTitle("");
      setDestination(null);
      setCity("");
      setStartDate("");
      setEndDate("");
      setNotes("");

      navigate("/trips");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to add trip.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Add a New Trip
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleCreate} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Trip Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-sm"
              placeholder="e.g., Paris Getaway"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Destination
            </label>

            <Select
              options={DESTINATIONS}
              value={destination}
              onChange={(option) => setDestination(option as CountryOption)}
              placeholder="Select a country"
              isSearchable
            />

            <input
              type="text"
              placeholder="City (e.g., Paris)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-sm mt-2"
            />
          </div>

          {/* Dates */}
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              min={startDate} // Prevents earlier dates
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-sm"
              rows={3}
              placeholder="Anything you want to remember for this trip..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Trip"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTrip;
