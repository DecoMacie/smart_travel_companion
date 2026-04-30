import React from "react";
import { Trip } from "../../services/firebase/trips";
import { useNavigate } from "react-router-dom";

interface Props {
  trip: Trip;
  className?: string;
  onClick?: () => void;
  onDelete?: () => void;
}

const TripCard: React.FC<Props> = ({ trip, onDelete, onClick, className }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick();
    navigate(`/trips/${trip.id}`);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getDuration = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return `${diff} days`;
  };

  // 🔥 Image (fallback to Unsplash)
  const imageUrl = trip.imageUrl ?? "/fallback.jpg";

  return (
    <div
      onClick={handleClick}
      className={`
        group relative
        bg-white rounded-2xl shadow-sm overflow-hidden
        hover:shadow-md hover:-translate-y-1
        transition cursor-pointer
        ${className || ""}
      `}
    >
      {/* Accent bar */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gray-400 group-hover:bg-linear-to-r from-blue-500 to-indigo-300 transition z-10" />

      {/* 🖼 Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={trip.destination.name}
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes("fallback.jpg")) {
              target.src = "/fallback.jpg";
            }
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105transition"
        />

        {/* Optional gradient overlay (makes text pop later if needed) */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Top row */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {trip.title}
            </h3>
            <p className="text-sm text-gray-500">{trip.destination.name}</p>
          </div>

          {/* Delete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="
              opacity-0 group-hover:opacity-100
              transition
              p-2 rounded-full
              hover:bg-red-50
            "
          >
            <span className="text-red-500 text-sm">🗑️</span>
          </button>
        </div>

        {/* Dates */}
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
          </p>

          <span className="text-xs text-gray-400">{getDuration()}</span>

          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            Trip
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
