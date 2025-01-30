import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  zipCodeOptions,
  physicalServices,
  mentalServices,
  socialServices,
} from "../../utils/data";
import './AddUsers.css';
import { TransitionGroup, CSSTransition } from "react-transition-group";

Modal.setAppElement("#root");

const Dashboard = () => {
  // 1. Define 'fields' before using it in any hooks or functions
  const fields = [
    {
      label: "Gender",
      key: "gender",
      options: ["Male", "Female", "Non-binary"],
    },
    {
      label: "Age Range",
      key: "age_range",
      options: ["Minors (under 18)", "Adults (18-64)", "Seniors (65 and over)"],
    },
    {
      label: "Citizenship Status",
      key: "citizenship_status",
      options: [
        "Citizen",
        "Resident",
        "Non-immigrant (temporary visa)",
        "Undocumented",
      ],
    },
    {
      label: "Insurance",
      key: "insurance",
      options: [
        "Accepts private insurance",
        "Accepts Medicare",
        "Accepts Medicaid",
        "Accepts MAP",
        "Accepts Ryan White Program",
        "Accepts patients/clients without insurance",
      ],
    },
    { label: "Physical Health", key: "physical", options: physicalServices },
    { label: "Mental Health", key: "mental", options: mentalServices },
    {
      label: "Social Determinants of Health",
      key: "social_determinants_of_health",
      options: socialServices,
    },
    {
      label: "Offers Transportation",
      key: "offers_transportation",
      options: ["Yes", "No"],
    },
    {
      label: "Emergency Room Visits",
      key: "emergency_room",
      options: ["Yes", "No"],
    },
  ];

  // 2. Initialize State Variables
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [karamat, setKaramat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 7;

  const [formData, setFormData] = useState({
    gender: [],
    age_range: [],
    citizenship_status: [],
    insurance: [],
    zip_code: [],
    physical: [],
    mental: [],
    social_determinants_of_health: [],
    offers_transportation: [],
    emergency_room: [],
  });

  // 3. Initialize Dropdowns State after 'fields' is defined
  const [dropdowns, setDropdowns] = useState(
    fields.map(() => ({ isOpen: false, search: "", selectedOptions: [] }))
  );

  const dropdownRefs = useRef([]);

  const isFiltering = filteredPartners.length > 0;

  const totalPages = Math.ceil(
    (isFiltering ? filteredPartners.length : karamat.length) / entriesPerPage
  );

  const currentEntries = isFiltering
    ? filteredPartners.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
      )
    : karamat.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
      );

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // 4. Fetch All Partners
  const fetchAllPartners = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/partners/list"
      );
      setKaramat(response.data);
    } catch (err) {
      console.error("Error fetching partners:", err);
      setError("Error fetching partners data.");
    }
  };

  // 5. Fetch Filtered Partners
  const fetchFilteredData = async () => {
    const hasFilters = fields.some(
      (field) => formData[field.key] && formData[field.key].length > 0
    );

    if (!hasFilters) {
      setFilteredPartners([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/partners/filter",
        formData
      );
      setFilteredPartners(response.data);
      setCurrentPage(1); // Reset to first page on new filter

      if (response.data.length === 0) {
        setError("No matched partners found.");
      }
    } catch (err) {
      console.error("Error fetching filtered data:", err);

      if (err.response && err.response.status === 404) {
        // No data found
        setFilteredPartners([]);
        setError("No matched partners found.");
      } else {
        // Generic error
        setError("Error fetching filtered partners.");
        setFilteredPartners([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPartners();
  }, []);

  useEffect(() => {
    fetchFilteredData();
  }, [formData]);

  // 6. Handle Option Toggle in Dropdowns
  const handleOptionToggle = (index, option) => {
    const isSelected = dropdowns[index].selectedOptions.includes(option);
    const updatedOptions = isSelected
      ? dropdowns[index].selectedOptions.filter((item) => item !== option)
      : [...dropdowns[index].selectedOptions, option];

    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index
          ? { ...dropdown, selectedOptions: updatedOptions }
          : dropdown
      )
    );

    setFormData((prev) => ({
      ...prev,
      [fields[index].key]: updatedOptions,
    }));
  };

  // 7. Handle Search in Dropdowns
  const handleSearchChange = (index, value) => {
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index ? { ...dropdown, search: value } : dropdown
      )
    );
  };

  // 8. Toggle Dropdown Visibility
  const toggleDropdown = (index) => {
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index ? { ...dropdown, isOpen: !dropdown.isOpen } : dropdown
      )
    );
  };

  // 9. Close Dropdowns When Clicking Outside
  const handleClickOutside = (event) => {
    dropdownRefs.current.forEach((dropdown, index) => {
      if (dropdown && !dropdown.contains(event.target)) {
        setDropdowns((prev) =>
          prev.map((dropdownState, i) =>
            i === index ? { ...dropdownState, isOpen: false } : dropdownState
          )
        );
      }
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 10. Fetch Partner Details for Modal
  const fetchPartnerDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/partners/${id}`
      );
      setSelectedPartner(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching partner details:", error);
      setError("Error fetching partner details.");
    }
  };

  // 11. Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  // 12. Handle Form Submission (No action needed as filtering is automatic)
  const handleSubmit = async (e) => {
    e.preventDefault(); 
  };

  // 13. Handle Reset Filters
  const handleReset = () => {
    const clearedFormData = { ...formData };

    fields.forEach((field, index) => {
      clearedFormData[field.key] = []; 
      dropdowns[index] = { isOpen: false, search: "", selectedOptions: [] }; 
    });

    setFormData(clearedFormData);
    setDropdowns([...dropdowns]); 
    setFilteredPartners([]); 
    setError(null); 
    setCurrentPage(1); 
  };

  // 14. Rendering Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <svg
          className="animate-spin h-10 w-10 text-yellow-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col md:flex-row justify-start lg:justify-normal gap-4 lg:gap-2 p-4">
        {/* Form Section */}
        <div className="w-full lg:w-1/4">
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-5 bg-gray-300 p-6 rounded-lg shadow-md"
          >
            {fields.map((field, index) => {
              const dropdown = dropdowns[index];
              const filteredOptions = field.options.filter((option) =>
                option.toLowerCase().includes(dropdown.search.toLowerCase())
              );

              return (
                <div
                  key={field.key}
                  className="relative w-full"
                  ref={(el) => (dropdownRefs.current[index] = el)}
                >
                  {/* Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => toggleDropdown(index)}
                    className="w-full bg-white border border-gray-300 py-3 px-4 rounded-lg flex justify-between items-center shadow-sm hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                  >
                    <span className="text-gray-700">
                      {dropdown.selectedOptions.length > 0
                        ? dropdown.selectedOptions.join(", ")
                        : `Select ${field.label}`}
                    </span>
                    <span
                      className={`ml-2 transform transition-transform duration-200 ${
                        dropdown.isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      ▼
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
                      dropdown.isOpen
                        ? "max-h-60 opacity-100 overflow-y-auto"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                  >
                    {/* Search Input */}
                    <input
                      type="text"
                      placeholder="Search..."
                      value={dropdown.search}
                      onChange={(e) =>
                        handleSearchChange(index, e.target.value)
                      }
                      className="w-full px-4 py-2 border-b border-gray-200 focus:outline-none focus:ring-0"
                    />

                    {/* Options List */}
                    <ul className="max-h-40 overflow-y-auto">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                          <li
                            key={option}
                            onClick={() =>
                              handleOptionToggle(index, option)
                            }
                            className="px-4 py-2 flex items-center hover:bg-yellow-100 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={dropdown.selectedOptions.includes(
                                option
                              )}
                              className="mr-3 accent-yellow-500"
                              readOnly
                            />
                            <span className="text-gray-700">{option}</span>
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-500">
                          No options found
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
          </form>

          {/* Reset Button */}
          <div className="w-full flex mt-4">
            <button
              className="w-1/2 mx-auto bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
              onClick={handleReset}
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full lg:w-3/4 mx-4 mt-3">
          <h1 className="text-4xl font-bold text-center mt-2 mb-4">
            Partner Details
          </h1>
          <div className="overflow-x-auto shadow-md shadow-slate-500 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="sticky top-0 bg-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left text-md font-semibold text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-md font-semibold text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-md font-semibold text-white uppercase tracking-wider">
                    Contact Number
                  </th>
                  <th className="px-6 py-3 text-left text-md font-semibold text-white uppercase tracking-wider">
                    Detail
                  </th>
                </tr>
              </thead>
              <TransitionGroup component="tbody" className="bg-white divide-y divide-gray-200">
                {currentEntries.length > 0 ? (
                  currentEntries.map((partner) => (
                    <CSSTransition key={partner._id} timeout={300} classNames="fade">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-md font-semibold whitespace-nowrap">
                          {partner.name}
                        </td>
                        <td className="px-6 py-4 text-md font-semibold whitespace-nowrap">
                          {partner.email}
                        </td>
                        <td className="px-6 py-4 text-md font-semibold whitespace-nowrap">
                          {partner.telephone}
                        </td>
                        <td className="px-6 py-4 text-md font-semibold whitespace-nowrap">
                          <button
                            className="px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500 text-white hover:bg-yellow-400 transition duration-200"
                            onClick={() => fetchPartnerDetails(partner._id)}
                          >
                            View Detail
                          </button>
                        </td>
                      </tr>
                    </CSSTransition>
                  ))
                ) : isFiltering ? (
                  // If no filtered partners, show a table row with message
                  <CSSTransition key="no-data" timeout={300} classNames="fade">
                    <tr>
                      <td className="px-6 py-4 text-center text-gray-500" colSpan="4">
                        {error ? error : "No matched data found."}
                      </td>
                    </tr>
                  </CSSTransition>
                ) : (
                  // If not filtering and no partners, show a different message
                  <CSSTransition key="no-partners" timeout={300} classNames="fade">
                    <tr>
                      <td className="px-6 py-4 text-center text-gray-500" colSpan="4">
                        No partners available.
                      </td>
                    </tr>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center py-4">
              <button
                className={`px-4 py-2 bg-yellow-500 text-white font-bold rounded-l-md transition-colors duration-200 hover:bg-yellow-400 disabled:bg-gray-300`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="px-4 py-2 text-lg flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={`px-4 py-2 bg-yellow-500 text-white font-bold rounded-r-md transition-colors duration-200 hover:bg-yellow-400 disabled:bg-gray-300`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Partner Details */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Partner Details"
        className="modal-content"
        overlayClassName="modal-overlay"
        style={{ content: { maxWidth: "800px", margin: "auto", padding: "20px", borderRadius: "10px" } }}
      >
        {selectedPartner ? (
          <div className="space-y-4">
            {/* Modal Header */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Partner Details
            </h2>

            {/* Grid Layout for Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Personal Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {selectedPartner.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {selectedPartner.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Address:</strong> {selectedPartner.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Contact Number:</strong> {selectedPartner.telephone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Zip Code:</strong> {selectedPartner.zip_code}
                  </p>
                </div>
              </div>

              {/* Service Provided */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Service Provided
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Physical:</strong>{" "}
                    {formatArray(selectedPartner.physical)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Mental:</strong>{" "}
                    {formatArray(selectedPartner.mental)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Social Determinants of Health:</strong>{" "}
                    {formatArray(selectedPartner.social_determinants_of_health)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Offer Transportation:</strong>{" "}
                    {selectedPartner.offers_transportation}
                  </p>
                </div>
              </div>

              {/* Served Information */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Served Information
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Age Range(s) Served:</strong>{" "}
                    {formatArray(selectedPartner.age_range)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Citizenship Status(es) Served:</strong>{" "}
                    {formatArray(selectedPartner.citizenship_status)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Accepted Insurance status(es):</strong>{" "}
                    {formatArray(selectedPartner.insurance)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Gender:</strong>{" "}
                    {formatArray(selectedPartner.gender)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Emergency Room:</strong> {selectedPartner.emergency_room}
                  </p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="w-full mt-6 flex justify-center">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">Loading partner details...</p>
        )}
      </Modal>
    </>
  );
};

// Helper function to format array data
const formatArray = (data) => {
  if (Array.isArray(data)) {
    return data.length > 0
      ? data.map((item) => `(${item})`).join(", ")
      : "No data available";
  }
  return data ? `(${data})` : "No data available";
};

export default Dashboard;