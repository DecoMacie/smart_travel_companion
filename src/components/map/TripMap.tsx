import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Place } from "../../utils/types";

interface TripMapProps {
  lat: number;
  lon: number;
  destination: string;
  places: Place[];
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

const TripMap: React.FC<TripMapProps> = ({ lat, lon, destination, places }) => {
  return (
    <div className="w-full h-72 rounded-xl overflow-hidden shadow z-0">
      <MapContainer
        center={[lat, lon]}
        zoom={12}
        scrollWheelZoom={false}
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
        {places.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lon]}
            icon={icons[p.type] ?? icons.default}
          >
            <Popup>
              <strong>{p.name}</strong>
              <br />
              {p.type}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TripMap;
