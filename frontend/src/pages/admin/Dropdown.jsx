// Dropdown.jsx
import React, { useState } from "react";

const Dropdown = ({ label, name, options, formData, setFormData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setFormData((prevData) => {
      let newSelection = [...prevData[name]];
      if (checked) {
        newSelection.push(value);
      } else {
        newSelection = newSelection.filter((item) => item !== value);
      }
      return { ...prevData, [name]: newSelection };
    });
  };

  return (
    <div className="relative">
      <label className="text-md text-gray-700 block mb-1 font-medium">{label}</label>
      <div
        className="bg-white border rounded py-1 px-3 border-gray-400 block cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        Select {label}
      </div>

      {isDropdownOpen && (
        <div className="absolute bg-white border border-gray-400 rounded mt-1 w-full p-2 space-y-2">
          {options.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                name={name}
                value={option}
                checked={formData[name].includes(option)}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}

      <p>Selected {label}: {formData[name].join(", ")}</p>
    </div>
  );
};

export default Dropdown;
