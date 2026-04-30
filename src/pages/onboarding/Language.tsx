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
      setError(
        err instanceof Error ? err.message : "Failed to update language.",
      );
    }
  };

  const languages = [
    { code: "en", label: "English", icon: "🇬🇧" },
    { code: "pt", label: "Portuguese", icon: "🇵🇹" },
    { code: "es", label: "Spanish", icon: "🇪🇸" },
    { code: "fr", label: "French", icon: "🇫🇷" },
    { code: "de", label: "German", icon: "🇩🇪" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-semibold text-center mb-1">
          Choose Language
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Select your preferred language
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleContinue} className="space-y-3">
          {languages.map((lang) => {
            const selected = language === lang.code;

            return (
              <button
                type="button"
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`
                  w-full flex items-center gap-4 p-4 rounded-xl border
                  transition text-left
                  ${
                    selected
                      ? "bg-blue-600 text-white border-blue-600 shadow"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <div className="text-2xl">{lang.icon}</div>

                <div className="flex-1">
                  <p className="font-medium">{lang.label}</p>
                  <p
                    className={`text-xs ${
                      selected ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {lang.code.toUpperCase()}
                  </p>
                </div>

                {selected && <span className="text-white">✓</span>}
              </button>
            );
          })}

          <button
            type="submit"
            className="
              w-full mt-4 bg-blue-600 text-white py-3 rounded-xl
              hover:bg-blue-700 transition shadow-sm
            "
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Language;
