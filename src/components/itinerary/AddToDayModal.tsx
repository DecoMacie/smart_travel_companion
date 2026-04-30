import React from "react";
import { ItineraryDayType } from "../../utils/types";

interface Props {
  days: ItineraryDayType[];
  onSelect: (day: ItineraryDayType) => void;
  onClose: () => void;
}

const AddToDayModal: React.FC<Props> = ({ days, onSelect, onClose }) => {
  if (!days.length) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Loading days...</p>
      </div>
    );
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80">
        <h2 className="text-lg font-semibold mb-4">Select Day</h2>
        <div className="space-y-2">
          {days.map((day) => (
            <button
              key={day.id}
              onClick={() => onSelect(day)}
              className="w-full text-left px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Day {day.dayNumber}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 py-2 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddToDayModal;
