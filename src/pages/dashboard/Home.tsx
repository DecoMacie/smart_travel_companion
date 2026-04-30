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
      <div className="max-w-3xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">
            Welcome back{user?.displayName ? `, ${user.displayName}` : ""}
          </h1>
          <p className="text-gray-500 mt-1">Ready for your next adventure?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button
            onClick={() => navigate("/trips")}
            className="p-4 bg-white rounded-xl shadow hover:shadow-md transition text-left"
          >
            <div className="text-lg font-medium">My Trips</div>
            <p className="text-sm text-gray-500">View and manage your trips</p>
          </button>

          <button
            onClick={() => navigate("/trips/add")}
            className="p-4 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition text-left"
          >
            <div className="text-lg font-medium">+ New Trip</div>
            <p className="text-sm text-blue-100">Plan something new</p>
          </button>
        </div>

        {/* Upcoming Trips */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Upcoming Trips</h2>

          <button
            onClick={() => navigate("/trips")}
            className="text-sm text-blue-600 hover:underline"
          >
            See all
          </button>
        </div>

        {loading && (
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-20 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        )}

        {!loading && upcomingTrips.length === 0 && (
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-gray-600 mb-3">No trips planned yet ✈️</p>
            <button
              onClick={() => navigate("/trips/add")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Create your first trip
            </button>
          </div>
        )}

        <div className="grid gap-4">
          {upcomingTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
