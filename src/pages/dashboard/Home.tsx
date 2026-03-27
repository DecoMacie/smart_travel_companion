import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase/firebase";
import { getUserTrips, Trip } from "../../services/firebase/trips";
import TripCard from "../../components/trips/TripCard";
import { onAuthStateChanged } from "firebase/auth";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const trips = await getUserTrips(user.uid);
        // Sort by start date

        const sorted = trips.sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        );
        // Only show next 2–3 trips
        setUpcomingTrips(sorted.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-2">
        Welcome back{user?.displayName ? `, ${user.displayName}` : ""}!
      </h1>
      <p className="text-gray-600 mb-6">Here’s what’s coming up.</p>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => navigate("/trips")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          View My Trips
        </button>

        <button
          onClick={() => navigate("/trips/add")}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          + Add Trip
        </button>
      </div>

      {/* Upcoming Trips */}
      <h2 className="text-lg font-semibold mb-3">Upcoming Trips</h2>

      {loading && <p className="text-gray-500">Loading trips…</p>}

      {!loading && upcomingTrips.length === 0 && (
        <p className="text-gray-500">No upcoming trips yet.</p>
      )}

      <div className="grid gap-4">
        {upcomingTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
};

export default Home;
