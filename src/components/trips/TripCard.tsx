import React from "react";
import { Trip } from "../../services/firebase/trips";
import { useNavigate } from "react-router-dom";

interface Props {
  trip: Trip;
  onClick?: () => void;
  onDelete?: () => void;
}

const TripCard: React.FC<Props> = ({ trip, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="p-4 bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{trip.title}</h3>
          <p className="text-gray-600">{trip.destination.name}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="rounded-4xl text-sm hover:bg-red-500"
        >
          🗑️
        </button>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {trip.startDate} → {trip.endDate}
      </p>
    </div>
  );
};

export default TripCard;
