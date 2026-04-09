import React, { useState } from "react";
import { auth } from "../../services/firebase/firebase";
import { updateUser } from "../../services/firebase/user";
import { useNavigate } from "react-router-dom";
import type { TravelStyle } from "../../services/firebase/user";

const Preferences: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [style, setStyle] = useState<TravelStyle | null>(null);
  const [tripLength, setTripLength] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState("");

  const styleOptions: TravelStyle[] = [
    { id: "Budget", hotelVal: "hostel", ticketVal: "economy" },
    { id: "Standard", hotelVal: "hostel", ticketVal: "economy" },
    { id: "Luxury", hotelVal: "5-star", ticketVal: "Business" },
  ];

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("User not logged in.");
      return;
    }
    if (!style) {
      setError("Please select a travel style.");
      return;
    }

    try {
      await updateUser(user.uid, {
        travelPreferences: {
          style,
          tripLength,
          interests,
        },
      });

      navigate("/onboarding/accessibility");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong on setting preferences.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Your Travel Preferences
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleContinue}>
          {/* Travel Style */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Travel Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {styleOptions.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  onClick={() => setStyle(option)}
                  className={`py-2 rounded-lg border ${
                    style?.id === option.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {option.id}
                </button>
              ))}
            </div>
          </div>

          {/* Trip Length */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Typical Trip Length
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Weekend", "1 week", "1–2 weeks", "2+ weeks"].map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => setTripLength(option)}
                  className={`py-2 rounded-lg border ${
                    tripLength === option
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Interests</label>
            <div className="grid grid-cols-2 gap-2">
              {["Nature", "City", "Adventure", "Culture", "Relaxation"].map(
                (interest) => (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`py-2 rounded-lg border ${
                      interests.includes(interest)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {interest}
                  </button>
                ),
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Preferences;
