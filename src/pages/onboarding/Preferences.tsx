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
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-semibold text-center mb-1">
          Travel Preferences
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Help us personalise your trips
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleContinue} className="space-y-6">
          {/* Travel Style */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Travel Style
            </label>

            <div className="grid grid-cols-3 gap-3">
              {styleOptions.map((option) => {
                const selected = style?.id === option.id;

                return (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setStyle(option)}
                    className={`
                    p-3 rounded-xl border text-sm
                    flex flex-col items-center gap-1
                    transition
                    ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600 shadow"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }
                  `}
                  >
                    <span className="text-lg">
                      {option.id === "Budget" && "💸"}
                      {option.id === "Standard" && "🧳"}
                      {option.id === "Luxury" && "✨"}
                    </span>
                    {option.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trip Length */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Typical Trip Length
            </label>

            <div className="grid grid-cols-2 gap-3">
              {["Weekend", "1 week", "1–2 weeks", "2+ weeks"].map((option) => {
                const selected = tripLength === option;

                return (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setTripLength(option)}
                    className={`
                    py-2 rounded-xl border text-sm
                    transition
                    ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600 shadow"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }
                  `}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-sm font-medium mb-3 block">Interests</label>

            <div className="flex flex-wrap gap-2">
              {["Nature", "City", "Adventure", "Culture", "Relaxation"].map(
                (interest) => {
                  const selected = interests.includes(interest);

                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`
                      px-3 py-1.5 rounded-full text-sm border transition
                      ${
                        selected
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }
                    `}
                    >
                      {interest}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* CTA */}
          <button
            type="submit"
            className="
            w-full bg-blue-600 text-white py-3 rounded-xl
            hover:bg-blue-700 transition
            shadow-sm
          "
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Preferences;
