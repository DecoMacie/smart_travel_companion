import React from "react";
import { Trip } from "../../services/firebase/trips";
import { useNavigate } from "react-router-dom";

interface Props {
  trip: Trip;
}

const TripCard: React.FC<Props> = ({ trip }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="p-4 bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer"
    >
      <h3 className="text-lg font-semibold">{trip.title}</h3>
      <p className="text-gray-600">{trip.destination}</p>
      <p className="text-sm text-gray-500 mt-2">
        {trip.startDate} → {trip.endDate}
      </p>
    </div>
  );
};

export default TripCard;
