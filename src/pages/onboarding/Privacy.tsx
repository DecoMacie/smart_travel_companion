import React, { useState } from "react";
import { auth } from "../../services/firebase/firebase";
import { updateUser } from "../../services/firebase/user";
import { useNavigate } from "react-router-dom";

const Privacy: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("User not logged in.");
      return;
    }

    if (!accepted) {
      setError("Please confirm to continue.");
      return;
    }

    try {
      await updateUser(user.uid, {
        privacyAccepted: true,
        onboardingCompleted: true,
      });
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update privacy.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Privacy Notice
        </h2>

        <p className="text-gray-700 text-sm mb-4">
          We value your privacy. Here’s how we use your data:
        </p>

        <ul className="text-gray-600 text-sm space-y-2 mb-6">
          <li>
            • Your profile and preferences help personalize your travel
            experience.
          </li>
          <li>
            • Your data is stored securely and never sold to third parties.
          </li>
          <li>• You can update or delete your data at any time.</li>
          <li>
            • We only collect information needed to improve your experience.
          </li>
        </ul>

        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
            className="mr-2 h-4 w-4"
          />
          <label className="text-sm text-gray-700">
            I understand and agree to continue.
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleFinish}
          className={`w-full py-2 rounded-lg transition ${
            accepted
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!accepted}
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default Privacy;
