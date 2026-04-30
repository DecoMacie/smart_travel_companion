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
      setError(
        err instanceof Error ? err.message : "Failed to save preferences.",
      );
    } finally {
      setLoading(false);
    }
  };

  const Option = ({
    title,
    description,
    icon,
    active,
    onClick,
  }: {
    title: string;
    description: string;
    icon: string;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-4 rounded-xl border
        transition text-left
        ${
          active
            ? "bg-blue-600 text-white border-blue-600 shadow"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }
      `}
    >
      <div
        className={`
          w-10 h-10 flex items-center justify-center rounded-lg
          ${active ? "bg-white/20" : "bg-gray-100"}
        `}
      >
        <span className="text-lg">{icon}</span>
      </div>

      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className={`text-xs ${active ? "text-white/80" : "text-gray-500"}`}>
          {description}
        </p>
      </div>

      {active && <span className="text-white">✓</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-semibold text-center mb-1">
          Accessibility
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Make the app easier for you to use
        </p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleContinue} className="space-y-3">
          <Option
            icon="🧭"
            title="Simplified Navigation"
            description="Fewer steps and a simpler interface"
            active={simplifiedNavigation}
            onClick={() => setSimplifiedNavigation((v) => !v)}
          />

          <Option
            icon="🔠"
            title="Large Text"
            description="Increase text size across the app"
            active={largeText}
            onClick={() => setLargeText((v) => !v)}
          />

          <Option
            icon="⚡"
            title="High Contrast"
            description="Improves visibility and readability"
            active={highContrast}
            onClick={() => setHighContrast((v) => !v)}
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-4 bg-blue-600 text-white py-3 rounded-xl
              hover:bg-blue-700 transition shadow-sm
            "
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Accessibility;
