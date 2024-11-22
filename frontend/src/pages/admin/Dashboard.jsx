import React, { useState } from "react";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionToggle = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option) // Remove if already selected
        : [...prev, option] // Add if not selected
    );
  };

  return (
    <div className="relative w-64">
      {/* Dropdown Button */}
      <button
        onClick={toggleDropdown}
        className="w-full bg-gray-200 text-black py-2 px-4 rounded flex justify-between items-center"
      >
        {selectedOptions.length > 0 ? selectedOptions.join(", ") : "Select Options"}
        <span className={`ml-2 transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow-md mt-1">
          {options.map((option) => (
            <li
              key={option}
              className="px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionToggle(option)}
            >
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                className="mr-2"
                readOnly
              />
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
