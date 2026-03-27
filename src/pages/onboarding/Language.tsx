import React, { useState } from "react";
import { auth } from "../../services/firebase/firebase";
import { updateUser } from "../../services/firebase/user";
import { useNavigate } from "react-router-dom";

const Language: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [language, setLanguage] = useState("en");
  const [error, setError] = useState("");

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("User not logged in.");
      return;
    }

    try {
      await updateUser(user.uid, { preferredLanguage: language });
      navigate("/onboarding/privacy");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update language.");
      }
    }
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "pt", label: "Portuguese" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Choose Your Language
        </h2>

        <p className="text-gray-600 text-sm mb-6 text-center">
          Select the language you prefer to use in the app.
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleContinue} className="space-y-4">
          {languages.map((lang) => (
            <div
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-4 border rounded-lg cursor-pointer transition ${
                language === lang.code
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700"
              }`}
            >
              {lang.label}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-4"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Language;
