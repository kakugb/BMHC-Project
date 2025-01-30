import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  zipCodeOptions,
  physicalServices,
  mentalServices,
  socialServices,
} from "../../utils/data";

import { TransitionGroup, CSSTransition } from "react-transition-group";
import debounce from "lodash.debounce";

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
    // { label: "Zip Code", key: "zip_code", options: zipCodeOptions },
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
  const [filtersApplied, setFiltersApplied] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSelected, setIsSelected] = useState(false);
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

  // 4. Determine if filtering is active
  const isFiltering = filteredPartners.length > 0;

  // 5. Calculate total pages based on active data set
  const totalPages = Math.ceil(
    (isFiltering ? filteredPartners.length : karamat.length) / entriesPerPage
  );

  // 6. Get current entries based on pagination and filtering
  const currentEntries = isFiltering
    ? filteredPartners.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
      )
    : karamat.slice(
        (currentPage - 1) * entriesPerPage,
        currentPage * entriesPerPage
      );

  // Determine if no partners are available at all
  const noPartnersAvailable = karamat.length === 0;

  // Determine if no matched data is found after filtering
  const noMatchedDataFound = isFiltering && filteredPartners.length === 0;

  // 7. Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // 8. Fetch all partners on component mount
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

  useEffect(() => {
    fetchAllPartners();
  }, []);

  // 9. Debounced Fetch Filtered Data
  const debouncedFetchFilteredData = useRef(
    debounce(async (currentFormData) => {
      // Check if any filters are applied
      const hasFilters = fields.some(
        (field) =>
          currentFormData[field.key] && currentFormData[field.key].length > 0
      );

      // If no filters are applied, clear filteredPartners
      if (!hasFilters) {
        setFilteredPartners([]); // Clear filtered data
        setError(null);
        return;
      }

      // If filters are applied, fetch filtered data
      setError(null);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/partners/filter",
          currentFormData
        );
        setFilteredPartners(response.data);
        setCurrentPage(1); // Reset to first page on new filter
        if (response.data.length === 0) {
          setError("No matched partners found.");
        }
      } catch (err) {
        console.error("Error fetching filtered data:", err);
        setError("Error fetching filtered partners.");
        setFilteredPartners([]);
      }
    }, 300) // Debounce delay of 300ms
  ).current;

  // 10. Fetch filtered partners whenever 'formData' changes
  useEffect(() => {
    debouncedFetchFilteredData(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // 11. Handle option toggle in dropdowns
  const handleOptionToggle = (index, option) => {
    const updatedOptions = dropdowns[index].selectedOptions.includes(option)
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

    // Check if any filters are applied
    const anyFieldSelected = fields.some((_, i) =>
      i === index
        ? updatedOptions.length > 0
        : dropdowns[i].selectedOptions.length > 0
    );
    setIsSelected(anyFieldSelected);
    setFiltersApplied(anyFieldSelected); // Update filtersApplied state
  };

  // 12. Handle search input change in dropdowns with debounce
  const handleSearchChange = (index, value) => {
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index ? { ...dropdown, search: value } : dropdown
      )
    );
  };

  // 13. Toggle dropdown open/close
  const toggleDropdown = (index) => {
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index ? { ...dropdown, isOpen: !dropdown.isOpen } : dropdown
      )
    );
  };

  // 14. Close dropdowns when clicking outside
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

  // 15. Fetch partner details for Modal
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

  // 16. Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  // 17. Handle form submission for filters
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    const clearedFormData = { ...formData };

    fields.forEach((field, index) => {
      clearedFormData[field.key] = []; // Clear the field's data
      dropdowns[index] = { isOpen: false, search: "", selectedOptions: [] }; // Reset dropdown state
    });

    setFormData(clearedFormData);
    setDropdowns([...dropdowns]); // Update dropdown states
    setFilteredPartners([]); // Clear filtered data
    setError(null); // Clear any existing errors
    setIsSelected(false); // Reset the `isSelected` state
    setFiltersApplied(false); // Reset filtersApplied state
    setCurrentPage(1); // Reset to first page
  };

  return (
    <>
      <div className="w-full flex flex-col md:flex-row justify-start lg:justify-normal gap-4 lg:gap-2 p-1">
        {/* Form Section */}
        <div className="w-full lg:w-3/12">
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
                    className="w-full bg-white border border-gray-300 py-[6px] px-4 rounded-lg flex justify-between items-center shadow-sm hover:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
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
                    className={` bg-white mt-2 border border-gray-300 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${
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
                      className="w-full px-4 py-1 border-b border-gray-200 focus:outline-none focus:ring-0"
                    />

                    {/* Options List */}
                    <ul className="max-h-40 overflow-y-auto">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                          <li
                            key={option}
                            onClick={() => handleOptionToggle(index, option)}
                            className="px-4 py-1 flex items-center hover:bg-blue-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={dropdown.selectedOptions.includes(
                                option
                              )}
                              className="mr-3 accent-blue-500"
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
              className="w-1/2 mx-auto bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
              onClick={handleReset}
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full lg:w-9/12 mx-4 mt-3 ">
          <h1 className="text-4xl  font-bold text-center mt-2 mb-3">
            Partner Details
          </h1>
          <div className="overflow-x-auto shadow-md shadow-slate-500 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200 ">
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
              <TransitionGroup
                component="tbody"
                className="bg-white divide-y divide-gray-200"
              >
                {filtersApplied && filteredPartners.length === 0 ? (
                  <CSSTransition
                    key="no-partners"
                    timeout={300}
                    classNames="fade"
                  >
                    <tr>
                      <td
                        className="px-6 py-4 text-center text-gray-500"
                        colSpan="4"
                      >
                        No partners available.
                      </td>
                    </tr>
                  </CSSTransition>
                ) : currentEntries.length > 0 ? (
                  currentEntries.map((partner) => (
                    <CSSTransition
                      key={partner._id}
                      timeout={300}
                      classNames="fade"
                    >
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
                            className="px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-500 text-white hover:bg-yellow-300 hover:text-black transition duration-200"
                            onClick={() => fetchPartnerDetails(partner._id)}
                          >
                            View Detail
                          </button>
                        </td>
                      </tr>
                    </CSSTransition>
                  ))
                ) : (
                  <CSSTransition key="no-data" timeout={300} classNames="fade">
                    <tr>
                      <td
                        className="px-6 py-4 text-center text-gray-500"
                        colSpan="4"
                      >
                        No matched data found.
                      </td>
                    </tr>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center py-4 mt-2">
              <button
                className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-l-md transition-colors duration-200 hover:bg-yellow-400 disabled:bg-gray-300"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="px-4 py-2 text-lg flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-yellow-500 text-white font-bold rounded-r-md transition-colors duration-200 hover:bg-yellow-400 disabled:bg-gray-300"
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
        style={{
          content: { width: "900px", padding: "20px", borderRadius: "10px" },
        }}
      >
        {selectedPartner ? (
          <div className="space-y-4">
            {/* Modal Header */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Partner Details
            </h2>

            {/* Grid Layout for Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg shadow-md shadow-slate-400 group hover:shadow-lg hover:-translate-y-2 transform transition-all duration-300">
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
              <div className="bg-gray-50 p-4 rounded-lg shadow-md shadow-slate-400 group hover:shadow-lg hover:-translate-y-2 transform transition-all duration-300">
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
              <div className="bg-gray-50 p-4 rounded-lg shadow-md shadow-slate-400 group hover:shadow-lg hover:-translate-y-2 transform transition-all duration-300">
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
                    <strong>Emergency Room:</strong>{" "}
                    {selectedPartner.emergency_room}
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
          <p className="text-center text-gray-600">
            Loading partner details...
          </p>
        )}
      </Modal>
    </>
  );
};

// Helper function to format array data
const formatArray = (data) => {
  if (Array.isArray(data)) {
    return data.length > 0 ? data.join(", ") : "No data available";
  }
  return data ? data : "No data available";
};

export default Dashboard;
