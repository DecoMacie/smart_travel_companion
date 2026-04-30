import React, { useState, useEffect } from "react";
import { TextInput } from "../../components/forms/TextInput";
import { auth } from "../../services/firebase/firebase";
import { updateUser, getUser } from "../../services/firebase/user";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/vite.png";

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [name, setName] = useState("");
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

  useEffect(() => {
    const loadUser = async () => {
      if (!user) return;

      const data = await getUser(user.uid);

      if (data) {
        setName(data.name || "");
        setCountry(data.country || "");
        setLanguage(data.preferredLanguage || "en");
      }
    };

    loadUser();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-12 w-auto mb-3" />
          <h1 className="text-xl font-semibold text-gray-800">
            Let’s get started
          </h1>
          <p className="text-sm text-gray-500">Tell us a bit about you</p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
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

            {/* Select */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="
                  w-full px-3 py-2 border border-gray-200 rounded-lg
                  focus:ring-2 focus:ring-blue-500 focus:outline-none
                  bg-white
                "
              >
                <option value="en">English</option>
                <option value="pt">Portuguese</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>

            {/* CTA */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-blue-600 text-white py-2.5 rounded-lg
                hover:bg-blue-700
                active:scale-[0.98]
                transition
                font-medium
              "
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
