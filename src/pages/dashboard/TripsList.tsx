import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserTrips, Trip, deleteTrip } from "../../services/firebase/trips";
import { auth } from "../../services/firebase/firebase";
import TripCard from "../../components/trips/TripCard";
import { onAuthStateChanged } from "firebase/auth";

const TripsList: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserTrips(user.uid);
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (tripId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trip?",
    );

    if (!confirmDelete) return;

    try {
      await deleteTrip(tripId);

      // 🔥 instant UI update
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      console.error("Failed to delete trip:", err);
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading your trips…</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Your Trips</h1>
            <p className="text-sm text-gray-500">
              Plan, manage, and revisit your journeys
            </p>
          </div>

          <button
            onClick={() => navigate("/trips/add")}
            className="
          px-4 py-2 rounded-lg 
          bg-blue-600 text-white 
          hover:bg-blue-700 
          shadow-sm
          transition
        "
          >
            + New Trip
          </button>
        </div>

        {/* Empty State */}
        {!loading && trips.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-lg font-semibold text-gray-800">
              No trips yet
            </h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">
              Start planning your next adventure
            </p>

            <button
              onClick={() => navigate("/trips/add")}
              className="
            px-5 py-2 rounded-lg 
            bg-blue-600 text-white 
            hover:bg-blue-700 
            transition
          "
            >
              Create your first trip
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-gray-500 text-sm">Loading your trips…</p>
        )}

        {/* Trips Grid */}
        {!loading && trips.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onClick={() => navigate(`/trips/${trip.id}`)}
                onDelete={() => handleDelete(trip.id)}
                className="transition transform hover:-translate-y-1"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsList;
