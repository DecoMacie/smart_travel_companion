import React, { useState } from "react";
import { auth } from "../../services/firebase/firebase";
import { updateUser } from "../../services/firebase/user";
import { useNavigate } from "react-router-dom";

const Accessibility: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [simplifiedNavigation, setSimplifiedNavigation] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("User not logged in.");
      return;
    }

    try {
      setLoading(true);
      await updateUser(user.uid, {
        options: {
          simplifiedNavigation,
          largeText,
          highContrast,
        },
      });

      navigate("/onboarding/language");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to save preferences. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
    setter((prev) => !prev);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Accessibility Options
        </h2>

        <p className="text-gray-600 text-sm mb-6 text-center">
          Choose any options that make the app easier for you to use.
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleContinue} className="space-y-4">
          {/* Simplified Navigation */}
          <div
            onClick={() => toggle(setSimplifiedNavigation)}
            className={`p-4 border rounded-lg cursor-pointer transition ${
              simplifiedNavigation
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700"
            }`}
          >
            Simplified Navigation
          </div>

          {/* Large Text */}
          <div
            onClick={() => toggle(setLargeText)}
            className={`p-4 border rounded-lg cursor-pointer transition ${
              largeText
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700"
            }`}
          >
            Large Text Mode
          </div>

          {/* High Contrast */}
          <div
            onClick={() => toggle(setHighContrast)}
            className={`p-4 border rounded-lg cursor-pointer transition ${
              highContrast
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700"
            }`}
          >
            High Contrast Mode
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-4"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Accessibility;
