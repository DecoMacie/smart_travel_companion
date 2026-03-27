import React, { useState } from "react";
import { TextInput } from "../../components/forms/TextInput";
import { auth } from "../../services/firebase/firebase";
import { updateUser } from "../../services/firebase/user";
import { useNavigate } from "react-router-dom";

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [name, setName] = useState(user?.displayName || "");
  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("User not logged in.");
      return;
    }

    if (!name.trim() || !country.trim()) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      await updateUser(user.uid, {
        name: name.trim(),
        country: country.trim(),
        preferredLanguage: language,
      });

      navigate("/onboarding/preferences");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("User update failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Tell us about you
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleContinue}>
          <TextInput
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextInput
            label="Country (optional)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Preferred Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2 hover:bg-blue-700 transition"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
