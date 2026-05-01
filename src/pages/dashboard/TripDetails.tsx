import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTripById, Trip } from "../../services/firebase/trips";
import TripMap from "../../components/map/TripMap";
import AddPlaceModal from "../../components/places/AddPlaceModal";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../../services/firebase/firebase";
import { Place, ItineraryDayType } from "../../utils/types";
import PlaceCard from "../../components/places/PlaceCard";
import FlightPricesCard from "../../components/flights/FlightPricesCard";
import Itinerary from "../../components/itinerary/Itinerary";
import { fetchNearbyPlaces } from "../../utils/places";
import AddToDayModal from "../../components/itinerary/AddToDayModal";
import { buildBookingLink } from "../../utils/hotelLinks";

const FILTERS = ["restaurant", "hotel", "attraction"] as const;
type FilterType = (typeof FILTERS)[number];

const TripDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterType[]>([]);
  const [externalPlaces, setExternalPlaces] = useState<Place[]>([]);
  const [cache, setCache] = useState<Partial<Record<FilterType, Place[]>>>({});

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const [days, setDays] = useState<ItineraryDayType[]>([]);

  const mergedPlaces = React.useMemo(() => {
    const savedCoords = new Set(places.map((p) => `${p.lat}-${p.lon}`));

    return [
      ...places,
      ...externalPlaces.filter((p) => !savedCoords.has(`${p.lat}-${p.lon}`)),
    ];
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

  const handleSaveExternalPlace = async (place: Place) => {
    if (!trip?.id) return;

    try {
      await addDoc(collection(db, "trips", trip.id, "places"), {
        name: place.name,
        lat: place.lat,
        lon: place.lon,
        type: place.type,
        source: "user",
      });

      // refresh
      loadPlaces(trip.id);
    } catch (err) {
      console.error("Failed to save place:", err);
    }
  };

  const loadDays = async (tripId: string) => {
    try {
      const ref = collection(db, "trips", tripId, "itinerary");
      const snapshot = await getDocs(ref);

      const list: ItineraryDayType[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<ItineraryDayType, "id">;

        return {
          id: doc.id,
          dayNumber: data.dayNumber,
          date: data.date ?? null,
        };
      });

      setDays(list);
    } catch (err) {
      console.error("Failed to load days:", err);
    }
  };

  const handleSelectDay = async (day: ItineraryDayType) => {
    if (!trip?.id || !selectedPlace) return;

    try {
      const ref = collection(
        db,
        "trips",
        trip.id,
        "itinerary",
        day.id,
        "items",
      );

      await addDoc(ref, {
        name: selectedPlace.name,
        type: "place",
        placeId: selectedPlace.id,
        lat: selectedPlace.lat,
        lon: selectedPlace.lon,
        order: Date.now(), // better than length
      });

      setShowDayModal(false);
      setSelectedPlace(null);
    } catch (err) {
      console.error("Failed to add to itinerary:", err);
    }
  };

  useEffect(() => {
    if (trip?.id) {
      loadDays(trip.id);
    }
  }, [trip]);

  useEffect(() => {
    const load = async () => {
      if (!trip?.destination) return;

      if (activeFilters.length === 0) {
        setExternalPlaces([]);
        return;
      }

      setLoadingPlaces(true);

      const results: Place[] = [];
      const newCache = { ...cache };

      const filterResults = await Promise.all(
        activeFilters.map(async (type) => {
          if (cache[type]) return cache[type];

          const data = await fetchNearbyPlaces(
            trip.destination.lat,
            trip.destination.lon,
            type,
          );

          return data;
        }),
      );

      setExternalPlaces(filterResults.flat());

      setCache(newCache);
      setExternalPlaces(results);
      setLoadingPlaces(false);
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

  const getHotelLink = (place: Place) =>
    buildBookingLink(
      place.name,
      trip.destination.name,
      trip.startDate,
      trip.endDate,
    );

  const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-white rounded-2xl shadow-sm p-5 mt-8">{children}</div>
  );

  const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <div className="bg-white rounded-2xl shadow-sm p-5 mt-6">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-6">
          <img
            src={trip.imageUrl ?? "/fallback.jpg"}
            alt={trip.destination.name}
            className="w-full h-full object-cover object-center"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

          {/* Text */}
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-2xl font-semibold">{trip.title}</h1>
            <p className="text-sm opacity-90">{trip.destination.name}</p>
          </div>
        </div>

        <Section>
          <FlightPricesCard
            destinationName={trip.destination.name}
            startDate={trip.startDate}
            endDate={trip.endDate}
          />
        </Section>

        {/* Dates */}
        <SubSection title="Dates">
          <p>
            {trip.startDate} → {trip.endDate}
          </p>
        </SubSection>

        {/* Notes */}
        {trip.notes && (
          <SubSection title="Notes">
            <p className="text-gray-700 whitespace-pre-line">{trip.notes}</p>
          </SubSection>
        )}

        {/* Map */}
        <Section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Explore</h2>

            <button
              onClick={() => setShowPlaceModal(true)}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg"
            >
              + Add
            </button>
          </div>

          {/* filters */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {FILTERS.map((type) => (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`
          px-3 py-1 rounded-full text-sm border transition
          ${
            activeFilters.includes(type)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 text-gray-600"
          }
        `}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 ">
            {/* LEFT: Map */}
            <div className="w-full h-100 lg:h-125 rounded-xl overflow-hidden">
              <div className="sticky top-4">
                <TripMap
                  lat={trip.destination.lat}
                  lon={trip.destination.lon}
                  destination={trip.destination.name}
                  places={mergedPlaces}
                  startDate={trip.startDate}
                  endDate={trip.endDate}
                  onSavePlace={handleSaveExternalPlace}
                  selectedPlace={selectedPlace}
                  loading={loadingPlaces}
                />
              </div>
            </div>

            {/* RIGHT: Places */}
            <div className="space-y-6">
              {/* Add place */}
              {showPlaceModal && (
                <AddPlaceModal
                  tripId={trip.id}
                  onClose={() => setShowPlaceModal(false)}
                  onAdded={() => loadPlaces(trip.id)}
                />
              )}

              {places.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>No places yet</p>
                  <p className="text-sm">Start exploring the map</p>
                </div>
              ) : (
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-sm p-4 h-125 overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-3">Saved Places</h2>

                    <div className="space-y-3">
                      {places.map((place) => (
                        <PlaceCard
                          key={place.id}
                          place={place}
                          getHotelLink={getHotelLink}
                          onAddToDay={async (p) => {
                            if (trip?.id) {
                              await loadDays(trip.id); // ensure fresh data
                            }
                            setSelectedPlace(p);
                            setShowDayModal(true);
                          }}
                          onClick={() => setSelectedPlace(place)}
                          onDelete={() => {
                            handleDeletePlace(place.id);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* Itinerary */}
        <Section>
          <Itinerary
            tripId={trip.id}
            startDate={trip.startDate}
            endDate={trip.endDate}
          />
        </Section>

        {/* Add Place to Day modal */}
        {showDayModal && (
          <AddToDayModal
            days={days}
            onSelect={handleSelectDay}
            onClose={() => setShowDayModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TripDetails;
