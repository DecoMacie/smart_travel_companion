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
    <div className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left side: Back button + Title */}
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 text-2xl mt-25  hover:cursor-pointer"
          >
            ←
          </button>
        )}
      </div>

      {/* Middle side: Hero and title */}
      <div className="flex flex-col items-center">
        <img src={logo} className="w-48 h-auto" alt="Company Logo"></img>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      {/* Right side: Settings icon */}
      <div>
        <button
          onClick={() => navigate("/settings")}
          className="text-gray-600 text-xl mt-25  hover:cursor-pointer"
        >
          ⚙️
        </button>
      </div>
    </div>
  );
};

export default Header;
