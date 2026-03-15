import React from "react";

interface Props {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TextInput: React.FC<Props> = ({
  label,
  type = "text",
  value,
  onChange,
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
    />
  </div>
);
