import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  zipCodeOptions,
  physicalServices,
  mentalServices,
  socialServices,
} from "../../utils/data";
import "../../../src/App.css";

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
  const [loading, setLoading] = useState(false);
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

  // 9. Fetch filtered partners whenever 'formData' changes
  const fetchFilteredData = async () => {
    // If no filters are applied, do not fetch filtered data
    const hasFilters = fields.some(
      (field) => formData[field.key] && formData[field.key].length > 0
    );

    if (!hasFilters) {
      setFilteredPartners([]);
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
      setError("Error fetching filtered partners.");
      setFilteredPartners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPartners();
  }, []);

  useEffect(() => {
    fetchFilteredData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  // 10. Handle option toggle in dropdowns
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

    const anyFieldSelected = fields.some(
      (_, i) =>
        i === index
          ? updatedOptions.length > 0 // Check updated field
          : dropdowns[i].selectedOptions.length > 0 // Check other fields
    );
    setIsSelected(anyFieldSelected);
  };

  // 11. Handle search input change in dropdowns
  const handleSearchChange = (index, value) => {
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index ? { ...dropdown, search: value } : dropdown
      )
    );
  };

  // 12. Toggle dropdown open/close
  const toggleDropdown = (index) => {
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index ? { ...dropdown, isOpen: !dropdown.isOpen } : dropdown
      )
    );
  };

  // 13. Close dropdowns when clicking outside
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

  // 14. Fetch partner details for Modal
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

  // 15. Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  // 16. Handle form submission for filters
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Filters are already handled via useEffect on formData
    // If you want to trigger fetchFilteredData here, ensure it's handled correctly
  };

  // 17. Handle reset filters
  const handleReset = () => {
    // Reset form data for specific fields
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
    setCurrentPage(1); // Reset to first page
  };

  // 18. Render Loading and Error States
  if (loading)
    return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">{error}</div>
    );

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
                    className="w-full bg-white border border-gray-300 py-[6px] px-4 rounded-lg flex justify-between items-center shadow-sm hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
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
                            onClick={() =>
                              handleOptionToggle(index, option)
                            }
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
        <div className="w-full lg:w-9/12 mx-4 mt-3">
          {currentEntries.length > 0 ? (
            <div className="overflow-x-auto">
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
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentEntries.map((partner) => (
                    <tr key={partner._id} className="hover:bg-gray-50">
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
                          className="px-6 py-1 inline-flex text-xs leading-5 font-bold rounded-md bg-green-200 text-green-800 transition-colors duration-200 hover:bg-green-200"
                          onClick={() => fetchPartnerDetails(partner._id)}
                        >
                          View Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : isFiltering ? (
            <div className="text-center text-gray-500 py-6">
              No matched data found.
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6">
              No partners available.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center py-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-l-md transition-colors duration-200 hover:bg-gray-600 disabled:bg-gray-300"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 text-lg flex items-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-r-md transition-colors duration-200 hover:bg-gray-600 disabled:bg-gray-300"
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
       style={{ content: { width: "900px", padding: "20px", borderRadius: "10px" } }}
     >
       {selectedPartner ? (
         <div className="space-y-4">
           {/* Modal Header */}
           <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
             Partner Details
           </h2>
     
           {/* Grid Layout for Sections */}
           <div className="grid grid-cols-3 gap-4">
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
                   {selectedPartner.physical
                     ? Array.isArray(selectedPartner.physical)
                       ? selectedPartner.physical
                           .map((status, index) => `(${status})`)
                           .join(", ")
                       : `(${selectedPartner.physical})`
                     : "No data available"}
                 </p>
                 <p className="text-sm text-gray-600">
                   <strong>Mental:</strong>{" "}
                   {selectedPartner.mental
                     ? Array.isArray(selectedPartner.mental)
                       ? selectedPartner.mental
                           .map((status, index) => `(${status})`)
                           .join(", ")
                       : `(${selectedPartner.mental})`
                     : "No data available"}
                 </p>
                 <p className="text-sm text-gray-600">
                   <strong>Social Determinants of Health:</strong>{" "}
                   {selectedPartner.social_determinants_of_health
                     ? Array.isArray(selectedPartner.social_determinants_of_health)
                       ? selectedPartner.social_determinants_of_health
                           .map((status, index) => `(${status})`)
                           .join(", ")
                       : `(${selectedPartner.social_determinants_of_health})`
                     : "No data available"}
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
                   {selectedPartner.age_range
                     ? Array.isArray(selectedPartner.age_range)
                       ? selectedPartner.age_range
                           .map((status, index) => `(${status})`)
                           .join(", ")
                       : `(${selectedPartner.age_range})`
                     : "No data available"}
                 </p>
                 <p className="text-sm text-gray-600">
                   <strong>Citizenship Status(es) Served:</strong>{" "}
                   {selectedPartner.citizenship_status
                     ? Array.isArray(selectedPartner.citizenship_status)
                       ? selectedPartner.citizenship_status
                           .map((status, index) => `(${status})`)
                           .join(", ")
                       : `(${selectedPartner.citizenship_status})`
                     : "No data available"}
                 </p>
                 <p className="text-sm text-gray-600">
                   <strong>Accepted Insurance status(es):</strong>{" "}
                   {selectedPartner.insurance
                     ? Array.isArray(selectedPartner.insurance)
                       ? selectedPartner.insurance
                           .map((status, index) => `(${status})`)
                           .join(", ")
                       : `(${selectedPartner.insurance})`
                     : "No data available"}
                 </p>
                 <p className="text-sm text-gray-600">
                   <strong>Gender:</strong>{" "}
                   {selectedPartner.gender
                     ? Array.isArray(selectedPartner.gender)
                       ? selectedPartner.gender
                           .map((status, index) => `(${status})`)
                           .join(", ")
                       : `(${selectedPartner.gender})`
                     : "No data available"}
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
    return data.length > 0 ? data.join(", ") : "No data available";
  }
  return data ? data : "No data available";
};

export default Dashboard;