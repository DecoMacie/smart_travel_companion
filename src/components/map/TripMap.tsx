import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

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

interface Place {
  id: string;
  lat: number;
  lon: number;
  name: string;
  type: "attraction" | "hotel" | "restaurant" | string;
}

interface TripMapProps {
  lat: number;
  lon: number;
  destination: string;
  places: Place[];
}

const TripMap: React.FC<TripMapProps> = ({ lat, lon, destination, places }) => {
  return (
    <div className="w-full h-72 rounded-xl overflow-hidden shadow">
      <MapContainer
        center={[lat, lon]}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Main destination marker */}
        <Marker position={[lat, lon]} icon={icons.default}>
          <Popup>{destination}</Popup>
        </Marker>

        {/* Additional places */}
        {places.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lon]}
            icon={icons[p.type] || icons.default}
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
