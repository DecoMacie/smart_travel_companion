import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left side: Back button + Title */}
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 text-2xl"
          >
            ←
          </button>
        )}
      </div>
      <h1 className="text-xl font-semibold">{title}</h1>
      {/* Right side: Settings icon */}
      <button
        onClick={() => navigate("/settings")}
        className="text-gray-600 text-xl hover:text-gray-800 transition"
      >
        ⚙️
      </button>
    </div>
  );
};

export default Header;
