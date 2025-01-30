import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdatePartners() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    telephone: "",
    email: "",
    address: "",
    gender: [],
    age_range: [],
    citizenship_status: [],
    insurance: [],
    zip_code: "",
    physical: [],
    mental: [],
    social_determinants_of_health: [],
    offers_transportation: "",
    emergency_room: ""
  });

  // Single state to handle open dropdowns
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = React.useRef(null);

  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const toggleDropdown = field => {
    setOpenDropdown(prev => (prev === field ? null : field));
  };

  const handleCheckboxChange = (field, event) => {
    const { value, checked } = event.target;
    setFormData(prevState => {
      const updatedField = prevState[field];
      if (checked) {
        return { ...prevState, [field]: [...updatedField, value] };
      } else {
        return {
          ...prevState,
          [field]: updatedField.filter(item => item !== value)
        };
      }
    });
  };

  const handleRadioChange = (field, e) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  // Fetch partner details
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/partners/${id}`)
        .then(response => {
          setFormData({ ...response.data });
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching partner details:', error);
          setLoading(false);
        });
    }
  }, [id]);

  // Handle clicks outside the dropdown to close it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure token is available for authorization
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authorization token is missing.');
      setError('Authorization token is missing.');
      toast.error("Authorization token is missing.");
      return;
    }
    
    // Send formData to the backend
    axios.put(`http://localhost:5000/api/partners/update/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Partner updated successfully:', response.data);
      toast.success("Partner Updated successfully!");
      setTimeout(() => {
        navigate('/user/managepatner'); 
      }, 2000);
    }) 
    .catch(error => {
      console.error('Error updating partner:', error.response ? error.response.data : error.message);
      setError('Error updating partner');  
      toast.error("Error updating partner!");
    });
  };
  
  const navigatePartner = () => {
    navigate('/admin/partner');
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full mt-4 mx-auto py-10">
      <div className="w-11/12 mx-auto pb-2 px-4 rounded border-gray-500 shadow-xl shadow-gray-600 bg-gray-200 ">
        <h1 className="text-center font-bold text-3xl text-black pt-2">
          Update Partner
        </h1>
        <div className="w-full flex justify-end">
          <button 
            className="text-end text-white text-xl font-semibold bg-red-700 px-2 py-1 rounded-md" 
            onClick={navigatePartner}
          >
            Close
          </button>
        </div>
        <div className="mt-8 grid lg:grid-cols-3 gap-4 ">
          <div className="text-xl font-bold text-center">
            <h1>Personal Information</h1>
          </div>
          <div className="text-xl font-bold text-center">
            <h1>Service Provided</h1>
          </div>
          <div className="text-xl font-bold text-center">
            <h1>Patient Information</h1>
          </div>
        </div>
        <form onSubmit={handleSubmit} ref={dropdownRef}>
          <div className="mt-8 grid lg:grid-cols-3 gap-4">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="Enter your name"
                required
              />
            </div>
            
            {/* Physical Dropdown */}
            <div>
              <label className="text-md text-gray-700 block mb-1 font-medium">
                Physical
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => toggleDropdown("physical")}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                >
                  <span>
                    {formData.physical.length > 0
                      ? formData.physical.join(", ")
                      : "Select Physical"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      openDropdown === "physical" ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openDropdown === "physical" && (
                  <div className="mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    {[
                      "Physical Care",
                      "Health Screenings",
                      "MAP Enrollment",
                      "Public Funded Health Insurance",
                    ].map((option) => (
                      <label
                        key={option}
                        className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          onChange={(e) => handleCheckboxChange("physical", e)}
                          checked={formData.physical.includes(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Age Range Dropdown */}
            <div>
              <label
                htmlFor="age_range"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Age Range(s) Served
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => toggleDropdown("age_range")}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                >
                  <span>
                    {formData.age_range.length > 0
                      ? formData.age_range.join(", ")
                      : "Select Age Range"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      openDropdown === "age_range" ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openDropdown === "age_range" && (
                  <div className="mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    {[
                      "Minors (under 18)",
                      "Adults (18-64)",
                      "Seniors (65 and over)",
                    ].map((option) => (
                      <label
                        key={option}
                        className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          onChange={(e) => handleCheckboxChange("age_range", e)}
                          checked={formData.age_range.includes(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="yourmail@gmail.com"
                required
              />
            </div>
            
            {/* Mental Dropdown */}
            <div>
              <label className="text-md text-gray-700 block mb-1 font-medium">
                Mental
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => toggleDropdown("mental")}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                >
                  <span>
                    {formData.mental.length > 0
                      ? formData.mental.join(", ")
                      : "Select Mental"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      openDropdown === "mental" ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openDropdown === "mental" && (
                  <div className="mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    {[
                      "Counseling",
                      "Nutrition Education",
                      "Psychiatric Assessments & Treatment",
                      "Trauma & Post-Traumatic Stress",
                      "Grief Assessments & Processing",
                      "Therapeutic Services for Severe Mental Illnesses",
                      "Counseling & Life Coaching Services",
                      "Medication Management",
                      "Substance Use Disorders",
                      "Coping Skills Improvement",
                    ].map((option) => (
                      <label
                        key={option}
                        className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          onChange={(e) => handleCheckboxChange("mental", e)}
                          checked={formData.mental.includes(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Citizenship Status Dropdown */}
            <div>
              <label
                htmlFor="citizenship_status"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Citizenship Status(es) Served
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => toggleDropdown("citizenship_status")}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                >
                  <span>
                    {formData.citizenship_status.length > 0
                      ? formData.citizenship_status.join(", ")
                      : "Select Citizenship Status"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      openDropdown === "citizenship_status" ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openDropdown === "citizenship_status" && (
                  <div className="mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    {[
                      "Citizen",
                      "Resident",
                      "Non-immigrant (temporary visa)",
                      "Undocumented",
                    ].map((option) => (
                      <label
                        key={option}
                        className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          onChange={(e) => handleCheckboxChange("citizenship_status", e)}
                          checked={formData.citizenship_status.includes(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Address Field */}
            <div>
              <label 
                htmlFor="address" 
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="Enter your Address"
                required
              />
            </div>
            
            {/* Social Determinants of Health Dropdown */}
            <div>
              <label
                htmlFor="social_determinants_of_health"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Social Determinants of Health
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => toggleDropdown("social_determinants_of_health")}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                >
                  <span>
                    {formData.social_determinants_of_health.length > 0
                      ? formData.social_determinants_of_health.join(", ")
                      : "Select Social Determinants of Health"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      openDropdown === "social_determinants_of_health" ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openDropdown === "social_determinants_of_health" && (
                  <div className="mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    {[
                      "Food",
                      "Diversion",
                      "Transportation",
                      "Workforce (Career Skills)",
                      "Training",
                      "PSH Supportive Services",
                      "Respite Medical Care Support",
                      "Reentry Support Services",
                    ].map((option) => (
                      <label
                        key={option}
                        className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          onChange={(e) => handleCheckboxChange("social_determinants_of_health", e)}
                          checked={formData.social_determinants_of_health.includes(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Insurance Dropdown */}
            <div>
              <label className="text-md text-gray-700 block mb-1 font-medium">
                Accepted Insurance status(es)
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => toggleDropdown("insurance")}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                >
                  <span>
                    {formData.insurance.length > 0
                      ? formData.insurance.join(", ")
                      : "Select Insurance"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      openDropdown === "insurance" ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openDropdown === "insurance" && (
                  <div className="mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    {[
                      "Accepts private insurance",
                      "Accepts Medicare",
                      "Accepts Medicaid",
                      "Accepts MAP",
                      "Accepts Ryan White Program",
                      "Accepts patients/clients without insurance",
                    ].map((option) => (
                      <label
                        key={option}
                        className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          onChange={(e) => handleCheckboxChange("insurance", e)}
                          checked={formData.insurance.includes(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Telephone Field */}
            <div>
              <label 
                htmlFor="telephone" 
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Contact Number
              </label>
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="Enter phone number"
                required
              />
            </div>
            
            {/* Offer Transportation Dropdown */}
            <div>
              <label className="text-md text-gray-700 block mb-1 font-medium">
                Offer Transportation
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => toggleDropdown("offers_transportation")}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                >
                  <span>
                    {formData.offers_transportation
                      ? formData.offers_transportation
                      : "Select Offer Transportation"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      openDropdown === "offers_transportation" ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openDropdown === "offers_transportation" && (
                  <div className="mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="radio"
                          value={option}
                          onChange={(e) => handleRadioChange("offers_transportation", e)}
                          checked={formData.offers_transportation === option}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Gender Dropdown */}
            <div>
              <label
                htmlFor="gender"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Gender
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => toggleDropdown("gender")}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                >
                  <span>
                    {formData.gender.length > 0
                      ? formData.gender.join(", ")
                      : "Select Gender"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      openDropdown === "gender" ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openDropdown === "gender" && (
                  <div className="mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {["Male", "Female", "Non-binary"].map((option) => (
                      <label
                        key={option}
                        className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          onChange={(e) => handleCheckboxChange("gender", e)}
                          checked={formData.gender.includes(option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Zip Code Field */}
            <div>
              <label 
                htmlFor="zip_code" 
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Zip Code
              </label>
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={e => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handleChange(e);
                  }
                }}
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="Enter Zip code in Number"
                required
              />
            </div>
            
            {/* Emergency Room Dropdown */}
            <div>
              <label className="text-md text-gray-700 block mb-1 font-medium">
                Emergency Room
              </label>
              <div>
                <button
                  type="button"
                  onClick={() => toggleDropdown("emergency_room")}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
                >
                  <span>
                    {formData.emergency_room
                      ? formData.emergency_room
                      : "Select Emergency Room"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${
                      openDropdown === "emergency_room" ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openDropdown === "emergency_room" && (
                  <div className="mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    {["Yes", "No"].map((option) => (
                      <label
                        key={option}
                        className="block px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        <input
                          type="radio"
                          value={option}
                          onChange={(e) => handleRadioChange("emergency_room", e)}
                          checked={formData.emergency_room === option}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="w-full flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="w-md py-2 px-4 mb-3 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
            >
              Update Partner
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}



export default UpdatePartners