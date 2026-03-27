import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserTrips, Trip } from "../../services/firebase/trips";
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
        // console.log("User:", user);
        console.log("Trips:", data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  console.log("This");

  if (loading) {
    return <p className="p-6 text-gray-500">Loading your trips…</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Trips</h2>

        <button
          onClick={() => navigate("/trips/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Add Trip
        </button>
      </div>

      {/* Empty State */}
      {trips.length === 0 && (
        <div className="text-center mt-10">
          <p className="text-gray-600">You have no trips yet.</p>
          <p className="text-sm text-gray-400 mt-1">
            Start by adding your first trip.
          </p>
        </div>
      )}

      {/* Trips Grid */}
      <div className="grid gap-4">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
};

export default TripsList;
