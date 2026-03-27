import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname.startsWith(path)
      ? "text-blue-600 font-semibold"
      : "text-gray-500";

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-inner border-t py-3 flex justify-around">
      <button
        onClick={() => navigate("/dashboard")}
        className={`flex flex-col items-center ${isActive("/dashboard")}`}
      >
        <span>🏠</span>
        <span className="text-xs">Home</span>
      </button>

      <button
        onClick={() => navigate("/trips")}
        className={`flex flex-col items-center ${isActive("/trips")}`}
      >
        <span>🧳</span>
        <span className="text-xs">Trips</span>
      </button>

      <button
        onClick={() => navigate("/trips/add")}
        className={`flex flex-col items-center ${isActive("/trips/add")}`}
      >
        <span>➕</span>
        <span className="text-xs">Add</span>
      </button>

      <button
        onClick={() => navigate("/onboarding/profile")}
        className={`flex flex-col items-center ${isActive("/profile")}`}
      >
        <span>👤</span>
        <span className="text-xs">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav;
