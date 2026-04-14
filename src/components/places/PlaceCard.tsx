import React from "react";
import { Place } from "../../utils/types";

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
  onDelete?: () => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onClick, onDelete }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{place.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{place.type}</p>
        </div>

        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">
          {place.type}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevents triggering card click
            onDelete?.();
          }}
          className="rounded-4xl text-sm hover:bg-red-500"
        >
          🗑️
        </button>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        Lat: {place.lat.toFixed(4)}, Lon: {place.lon.toFixed(4)}
      </div>
    </div>
  );
};

export default PlaceCard;
