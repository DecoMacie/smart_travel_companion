import React from "react";

interface SettingsRowProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  rightElement?: React.ReactNode;
  icon?: string;
  className?: string;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  label,
  onClick,
  icon,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className="
        group w-full flex items-center justify-between 
        px-4 py-3 
        hover:bg-gray-50 
        active:scale-[0.98]
        transition
      "
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100">
            <span className="text-base">{icon}</span>
          </div>
        )}

        <span className={`font-medium ${className ?? "text-gray-800"}`}>
          {label}
        </span>
      </div>

      <span className="text-gray-300 text-lg transition group-hover:text-gray-500">
        ›
      </span>
    </button>
  );
};

export default SettingsRow;
