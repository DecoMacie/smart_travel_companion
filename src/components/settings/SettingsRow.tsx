import React from "react";

interface SettingsRowProps {
  label: string;
  onClick?: () => void;
  icon?: string;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ label, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3 px-1 border-b text-left"
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-gray-800">{label}</span>
      </div>

      <span className="text-gray-400">›</span>
    </button>
  );
};

export default SettingsRow;
