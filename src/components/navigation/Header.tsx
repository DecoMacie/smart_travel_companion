import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/vite.png";

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false }) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 bg-white/75 backdrop-blur shadow">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-6 w-1/3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
            >
              🔙
            </button>
          )}
          <img src={logo} className="w-18 h-12" alt="Logo" />
        </div>

        {/* Center */}
        <div className="flex items-center justify-center gap-2 w-1/3">
          <span className="font-semibold text-gray-800 truncate">{title}</span>
        </div>

        {/* Right */}
        <div className="flex justify-end w-1/3">
          <button
            onClick={() => navigate("/settings")}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
          >
            ⚙️
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
