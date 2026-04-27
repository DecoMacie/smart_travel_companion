import React from "react";
import { Place } from "../../utils/types";

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
  onDelete?: () => void;
  onAddToDay?: (place: Place) => void;
  getHotelLink?: (place: Place) => string;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onClick,
  onDelete,
  onAddToDay,
  getHotelLink,
}) => {
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

        <div className="flex items-center gap-2">
          {/* Delete Place with tooltip*/}
          <div className="relative group">
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevents triggering card click
                onDelete?.();
              }}
              className="rounded-full text-sm hover:bg-red-100"
            >
              🗑️
            </button>
            {/* Tooltip */}
            <div
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                  whitespace-nowrap px-2 py-1 text-xs text-white bg-black rounded 
                  opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
            >
              Delete place
            </div>
          </div>

          {/* Add to itinerary with tooltip */}
          <div className="relative group">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToDay?.(place);
              }}
              className="rounded-full text-sm hover:bg-blue-200 transition"
            >
              ➕
            </button>
            {/* Tooltip */}
            <div
              className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                  whitespace-nowrap px-2 py-1 text-xs text-white bg-black rounded 
                  opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
            >
              Add to itinerary
            </div>
          </div>

          {place.type === "hotel" && getHotelLink && (
            <a
              href={getHotelLink(place)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm underline"
            >
              View prices
            </a>
          )}
        </div>

        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">
          {place.type}
        </span>
      </div>

      <div className="mt-2 text-sm text-gray-600 line-clamp-2">
        {place.address || "No address available"}
      </div>
    </div>
  );
};

export default PlaceCard;
