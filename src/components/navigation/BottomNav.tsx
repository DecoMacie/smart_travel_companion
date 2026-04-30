import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const NavItem = ({
    label,
    icon,
    path,
  }: {
    label: string;
    icon: string;
    path: string;
  }) => {
    const active = isActive(path);

    return (
      <button
        onClick={() => navigate(path)}
        className="flex flex-col items-center justify-center flex-1 relative"
      >
        {/* Active indicator */}
        {active && (
          <div className="absolute -top-2 w-6 h-1 bg-blue-600 rounded-full" />
        )}

        <span
          className={`text-lg transition ${
            active ? "scale-110" : "opacity-70"
          }`}
        >
          {icon}
        </span>

        <span
          className={`text-[11px] mt-1 transition ${
            active ? "text-blue-600 font-semibold" : "text-gray-500"
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <div
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2
        w-[95%] max-w-md
        bg-white/75 backdrop-blur-lg
        border border-gray-200
        shadow-lg rounded-2xl
        px-2 py-2
        flex items-center justify-between
        z-50
      "
    >
      <NavItem label="Home" icon="🏠" path="/dashboard" />
      <NavItem label="Trips" icon="🧳" path="/trips" />

      {/* 🔥 Floating Add Button */}
      <button
        onClick={() => navigate("/trips/add")}
        className="
          -mt-8
          w-14 h-14
          bg-blue-600 text-white
          rounded-full
          flex items-center justify-center
          shadow-lg
          text-2xl
          hover:scale-105 active:scale-95
          transition
        "
      >
        +
      </button>

      <NavItem label="Profile" icon="👤" path="/onboarding/profile" />
    </div>
  );
};

export default BottomNav;
