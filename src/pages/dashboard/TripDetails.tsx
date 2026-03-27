import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTripById, Trip } from "../../services/firebase/trips";

const TripDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTrip = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getTripById(id);
        console.log(data);
        if (isMounted) setTrip(data);
      } catch {
        if (isMounted) setError("Failed to load trip.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTrip();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading trip details…</p>;
  }

  if (!trip) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Trip not found.</p>
        <button
          onClick={() => navigate("/trips")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Trips
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Trip Header */}
      <h1 className="text-3xl font-semibold mb-2">{trip.title}</h1>
      <p className="text-gray-600 text-lg">{trip.destination}</p>

      {/* Dates */}
      <div className="mt-4 p-4 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Dates</h2>
        <p className="text-gray-700">
          {trip.startDate} → {trip.endDate}
        </p>
      </div>

      {/* Notes */}
      {trip.notes && (
        <div className="mt-4 p-4 bg-white rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <p className="text-gray-700 whitespace-pre-line">{trip.notes}</p>
        </div>
      )}

      {/* Map Placeholder */}
      <div className="mt-6 p-4 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
          Map coming soon
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
