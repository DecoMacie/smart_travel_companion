import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Place } from "../../utils/types";
import { buildBookingLink } from "../../utils/hotelLinks";

interface TripMapProps {
  lat: number;
  lon: number;
  destination: string;
  places: Place[];
  startDate: string;
  endDate: string;
  selectedPlace?: Place | null;
  onSavePlace?: (place: Place) => void;
  loading: boolean;
}

const icons: Record<string, L.Icon> = {
  attraction: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  hotel: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/139/139899.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  restaurant: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  }),
  default: new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  }),
};

const FitBounds: React.FC<{ lat: number; lon: number; places: Place[] }> = ({
  lat,
  lon,
  places,
}) => {
  const map = useMap();
  const hasFitRef = useRef(false);

  useEffect(() => {
    if (!places.length) return;
    if (hasFitRef.current) return;

    const bounds = L.latLngBounds([
      L.latLng(lat, lon),
      ...places.map((p) => L.latLng(p.lat, p.lon)),
    ]);

    map.fitBounds(bounds, { padding: [50, 50] });
    hasFitRef.current = true;
  }, [lat, lon, places, map]);

  return null;
};

const selectedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // or any standout icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const TripMap: React.FC<TripMapProps> = ({
  lat,
  lon,
  destination,
  places,
  startDate,
  endDate,
  selectedPlace,
  onSavePlace,
  loading,
}) => {
  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden shadow">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      )}
      <MapContainer
        center={[lat, lon]}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds lat={lat} lon={lon} places={places} />

        {/* Destination */}
        <Marker position={[lat, lon]} icon={icons.default}>
          <Popup>{destination}</Popup>
        </Marker>

        {/* Places */}
        {places.map((p) => {
          const isSelected =
            selectedPlace &&
            selectedPlace.lat === p.lat &&
            selectedPlace.lon === p.lon;
          return (
            <Marker
              key={p.id}
              position={[p.lat, p.lon]}
              icon={
                isSelected
                  ? selectedIcon
                  : (icons[p.type as keyof typeof icons] ?? icons.default)
              }
            >
              <Popup>
                <strong>{p.name}</strong>
                <br />
                {p.type}

                {/* Save button */}

                <div className="mt-2">
                  {p.source === "external" ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSavePlace?.(p);
                      }}
                      className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded"
                    >
                      Save to trip
                    </button>
                  ) : (
                    <span className="text-green-600 text-sm">Saved</span>
                  )}
                </div>
                {p.type === "hotel" && (
                  <a
                    href={buildBookingLink(
                      p.name,
                      destination,
                      startDate,
                      endDate,
                    )}
                    target="_blank"
                    className="text-blue-600 text-sm underline mt-2 block"
                  >
                    View prices
                  </a>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default TripMap;
