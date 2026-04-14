import React, { useState } from "react";
import { buildGoogleFlightsLink } from "../../utils/flightLinks";

interface FlightPricesCardProps {
  destination: string;
  startDate: string;
}

const FlightPricesCard: React.FC<FlightPricesCardProps> = ({
  destination,
  startDate,
}) => {
  const [origin, setOrigin] = useState("London"); // default

  const googleLink = buildGoogleFlightsLink(origin, destination, startDate);

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-6">
      <h3 className="text-lg font-semibold mb-2">Flight Prices</h3>
      <div className="mb-3">
        <label className="text-sm text-gray-600">From</label>
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="e.g. London"
          className="w-full border px-3 py-2 rounded-lg"
        />
      </div>
      <p className="text-gray-600 mb-4">
        View live flight prices for your trip dates.
      </p>

      {/* Google Flights */}
      <a
        href={googleLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block my-0.5 w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Check on Google Flights →
      </a>
      {/* Skyscanner */}
      <a
        href={undefined}
        target="_blank"
        rel="noopener noreferrer"
        className="block my-0.5 w-full text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
      >
        Skyscanner →
      </a>
    </div>
  );
};

export default FlightPricesCard;
