import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTripById, Trip } from "../../services/firebase/trips";
import TripMap from "../../components/map/TripMap";
import AddPlaceModal from "../../components/places/AddPlaceModal";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../services/firebase/firebase";
import { Place } from "../../utils/types";
import PlaceCard from "../../components/places/PlaceCard";
import FlightPricesCard from "../../components/flights/FlightPricesCard";
import Itinerary from "../../components/itinerary/Itinerary";
import { fetchNearbyPlaces } from "../../utils/places";

const FILTERS = ["restaurant", "hotel", "attraction"] as const;
type FilterType = (typeof FILTERS)[number];

const TripDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [externalPlaces, setExternalPlaces] = useState<Place[]>([]);
  const [cache, setCache] = useState<Partial<Record<FilterType, Place[]>>>({});

  const mergedPlaces = React.useMemo(() => {
    const map = new Map<string, Place>();

    [...places, ...externalPlaces].forEach((p) => {
      map.set(p.id ?? `${p.lat}-${p.lon}-${p.name}`, p);
    });

    return Array.from(map.values());
  }, [places, externalPlaces]);

  const handleDeletePlace = async (placeId: string) => {
    try {
      if (!trip?.id) return;

      await deleteDoc(doc(db, "trips", trip.id, "places", placeId));

      // refresh UI
      setPlaces((prev) => prev.filter((p) => p.id !== placeId));
    } catch (err) {
      console.error("Failed to delete place:", err);
    }
  };

  const loadPlaces = async (tripId: string) => {
    try {
      const ref = collection(db, "trips", tripId, "places");
      const snapshot = await getDocs(ref);

      const list: Place[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Place, "id">),
      }));

      setPlaces(list);
    } catch {
      setError("Failed to load places.");
    }
  };

  const toggleFilter = (type: FilterType) => {
    setActiveFilters((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  useEffect(() => {
    const load = async () => {
      if (!trip?.destination) return;

      if (activeFilters.length === 0) {
        setExternalPlaces([]);
        return;
      }

      const results: Place[] = [];
      const newCache = { ...cache };

      for (const type of activeFilters) {
        if (newCache[type]) {
          results.push(...(newCache[type] as Place[]));
          continue;
        }

        const data = await fetchNearbyPlaces(
          trip.destination.lat,
          trip.destination.lon,
          type,
        );

        newCache[type] = data;
        results.push(...data);
      }

      setCache(newCache);
      setExternalPlaces(results);
    };

    load();
  }, [activeFilters, trip, cache]);

  useEffect(() => {
    let isMounted = true;

    const loadTrip = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getTripById(id);
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

  useEffect(() => {
    if (trip?.id) {
      loadPlaces(trip.id);
    }
  }, [trip]);

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

      <h1 className="text-3xl font-semibold mb-2">{trip.title}</h1>
      <p className="text-gray-600 text-lg">{trip.destination.name}</p>

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

      {/* Map */}
      <div className="mt-6 p-4 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Location</h2>

        <button
          onClick={() => setShowPlaceModal(true)}
          className="mb-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          + Add Place
        </button>

        {/* Add place */}
        {showPlaceModal && (
          <AddPlaceModal
            tripId={trip.id}
            onClose={() => setShowPlaceModal(false)}
            onAdded={() => loadPlaces(trip.id)}
          />
        )}

        {/* filter UI */}
        <div className="flex gap-2 mb-3">
          {FILTERS.map((type) => (
            <button
              key={type}
              onClick={() => toggleFilter(type)}
              className={`px-3 py-1 rounded-full border ${
                activeFilters.includes(type)
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <TripMap
          lat={trip.destination.lat}
          lon={trip.destination.lon}
          destination={trip.destination.name}
          places={mergedPlaces}
        />
        <FlightPricesCard
          destinationName={trip.destination.name}
          startDate={trip.startDate}
          endDate={trip.endDate}
        />
      </div>

      {/* Itinerary */}
      <div className="mt-8">
        <Itinerary
          tripId={trip.id}
          startDate={trip.startDate}
          endDate={trip.endDate}
        />
      </div>

      {/* Places */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Places</h2>

        {places.length === 0 ? (
          <p className="text-gray-500">No places added yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onClick={() => {
                  // optional: later connect to map focus
                  console.log("Clicked:", place);
                }}
                onDelete={() => {
                  handleDeletePlace(place.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
