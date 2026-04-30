import React, { useState } from "react";
import { auth } from "../../services/firebase/firebase";
import { updateUser } from "../../services/firebase/user";
import { useNavigate } from "react-router-dom";

const Privacy: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleFinish = async () => {
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
      setError(
        err instanceof Error ? err.message : "Failed to update privacy.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">🔐</div>
          <h2 className="text-2xl font-semibold">Privacy & Data</h2>
          <p className="text-sm text-gray-500 mt-1">
            We keep your information safe and in your control
          </p>
        </div>

        {/* Content card */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3 text-sm text-gray-700">
          <p>• Your profile helps personalize your travel experience</p>
          <p>• Data is securely stored and never sold to third parties</p>
          <p>• You can update or delete your data anytime</p>
          <p>• We only collect what is needed to improve your experience</p>
        </div>

        {/* Agreement card */}
        <button
          type="button"
          onClick={() => setAccepted((v) => !v)}
          className={`
            w-full flex items-center gap-3 p-4 rounded-xl border
            transition text-left mb-4
            ${
              accepted
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }
          `}
        >
          <div className="text-xl">✓</div>

          <div className="flex-1">
            <p className="font-medium">I understand and agree</p>
            <p
              className={`text-xs ${accepted ? "text-white/80" : "text-gray-500"}`}
            >
              Required to continue
            </p>
          </div>
        </button>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* CTA */}
        <button
          onClick={handleFinish}
          disabled={!accepted}
          className={`
            w-full py-3 rounded-xl font-medium transition
            ${
              accepted
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          Finish Setup
        </button>
      </div>
    </div>
  );
};

export default Privacy;
