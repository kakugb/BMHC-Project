import React, { useEffect, useState } from "react";
import { zipCodeOptions, physicalServices, mentalServices, socialServices } from '../../utils/data';
import axios from "axios";
import "../../../src/App.css";
import Modal from "react-modal";
Modal.setAppElement("#root");
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  
  const [partners, setPartners] = useState([]);
const [filteredPartners, setFilteredPartners] = useState([]);
const [loading, setLoading] = useState(false)
const [error,setError] =useState()
const [currentPage, setCurrentPage] = useState(1);
const [searchQuery, setSearchQuery] = useState("");
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
  emergency_room: []
});



  const fields = [
    { label: "Gender", key: "gender", options: ["Male", "Female", "Non-binary"] },
    {
      label: "Age Range",
      key: "age_range",
      options: ["Minors (under 18)", "Adults (18-64)", "Seniors (65 and over)"],
    },
    {
      label: "Citizenship Status",
      key: "citizenship_status",
      options: ["Citizen", "Resident", "Non-immigrant (temporary visa)", "Undocumented"],
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
        "Accepts patients/clients without insurance"
      ],
    },
    {
      label: "Zip Code",
      key: "zip_code",
      options: zipCodeOptions,  // Correctly assign zipCodeOptions here
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

   
  const totalPages = Math.ceil(filteredPartners.length / entriesPerPage);
  const currentEntries = filteredPartners.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post(
        "http://localhost:5000/api/partners/filter",
        formData
      );
      
      setFilteredPartners(response.data); // Update filtered partners
    } catch (err) {
      setError("Error fetching filtered partners");
      setFilteredPartners([]);
    } finally {
      setLoading(false);
    }
  };
  
  
  const [dropdowns, setDropdowns] = useState(
    fields.map(() => ({ isOpen: false, search: "", selectedOptions: [] }))
  );

  const toggleDropdown = (index) => {
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index ? { ...dropdown, isOpen: !dropdown.isOpen } : dropdown
      )
    );
  };



  const handleOptionToggle = (index, option) => {
  
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index
          ? {
              ...dropdown,
              selectedOptions: dropdown.selectedOptions.includes(option)
                ? dropdown.selectedOptions.filter((item) => item !== option)
                : [...dropdown.selectedOptions, option],
            }
          : dropdown
      )
   
    );
  
    // Update the formData state when a selection changes
    setFormData((prevData) => {
      const updatedSelectedOptions = dropdowns[index].selectedOptions.includes(option)
        ? dropdowns[index].selectedOptions.filter((item) => item !== option)
        : [...dropdowns[index].selectedOptions, option];
  
      return {
        ...prevData,
        [fields[index].key]: updatedSelectedOptions,
      };
    });
  };
  
 
  

  const handleSearchChange = (index, value) => {
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index ? { ...dropdown, search: value } : dropdown
      )
    );
   
  };



  const fetchPartnerDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/partners/${id}`);
      setSelectedPartner(response.data);
      setIsModalOpen(true); // Open modal with details
    } catch (error) {
      console.error("Error fetching partner details:", error);
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>{error}</div>;
  }
 
  
  return (
    <>
<div className=" grid grid-cols-2 mr-7">
    <form onSubmit={handleSubmit} className="w-6/12 space-y-6  bg-gray-300  ml-3">
      {fields.map((field, index) => {
        const dropdown = dropdowns[index];
        const filteredOptions = field.options.filter((option) =>
          option.toLowerCase().includes(dropdown.search.toLowerCase())
        );

        return (
          <div key={field.key} className="relative w-full max-w-sm">
            <button
              type="button"
              onClick={() => toggleDropdown(index)}
              className="w-full bg-gray-200 py-1.5 px-4 rounded flex justify-between items-center"
            >
              {dropdown.selectedOptions.length > 0
                ? dropdown.selectedOptions.join(", ")
                : `Select ${field.label}`}
              <span
                className={`ml-2 transform ${dropdown.isOpen ? "rotate-180" : "rotate-0"}`}
              >
                ▼
              </span>
            </button>
            {dropdown.isOpen && (
              <div className="absolute z-10 w-full bg-white border rounded shadow-md mt-1">
                <input
                  type="text"
                  placeholder="Search..."
                  value={dropdown.search}
                  onChange={(e) => handleSearchChange(index, e.target.value)}
                  className="w-full px-4 py-2 border-b"
                />
                <ul className="max-h-40 overflow-y-auto">
                  {filteredOptions.map((option) => (
                    <li
                      key={option}
                      onClick={() => handleOptionToggle(index, option)}
                      className="px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={dropdown.selectedOptions.includes(option)}
                        className="mr-2"
                        readOnly
                      />
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}

      <div className="flex justify-start">
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded"
        >
          Submit
        </button>
      </div>
    </form>

    <div>
    
    <div className="w-10/12 mx-auto mt-6 ">
        <table className="w-full divide-y divide-gray-200 bg-gray- p-5">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">Contact Number</th>
              <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">Detail</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentEntries.map((partner, ind) => (
              <tr key={ind}>
                <td className="px-6 py-4 texxt-md font-semibold whitespace-nowrap">{partner.name}</td>
                <td className="px-6 py-4 texxt-md font-semibold whitespace-nowrap">{partner.email}</td>
                <td className="px-6 py-4 texxt-md font-semibold whitespace-nowrap">{partner.telephone}</td>
                <td className="px-6 py-4 texxt-md font-semibold whitespace-nowrap">
                  <button className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" onClick={() => fetchPartnerDetails(partner._id)}>
                    View Detail
                  </button>
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPartners.length > entriesPerPage && (
          <div className="flex justify-center py-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-l-md"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-lg">{currentPage}</span>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-r-md"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

    </div>
    </div>

    {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-4 rounded-lg">
      <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2">Close</button>
      <h2>{selectedPartner.name}</h2>
      <p>{selectedPartner.gender}</p>
      <p>{selectedPartner.age_range}</p>
      <p>{selectedPartner.telephone}</p>
      <p>{selectedPartner.insurance}</p>
      {/* Render other details */}
    </div>
  </div>
)}
<Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Partner Details"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedPartner ? (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Partner Details"
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <h2 className="text-2xl font-bold">Partner Details</h2>
            {selectedPartner ? (
              <div>
                <h2 className="text-xl font-bold mb-2">Partner Details</h2>
                <p>
                  <strong>Name:</strong> {selectedPartner.name}
                </p>
                <p>
                  <strong>Contact Info:</strong> {selectedPartner.telephone}
                </p>
                <p>
                  <strong>Email:</strong> {selectedPartner.contact}
                </p>
                <p>
                  <strong>Address:</strong> {selectedPartner.address}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedPartner.gender}
                </p>
                <p>
                  <strong>Age Range:</strong> {selectedPartner.age_range}
                </p>
                <p>
                  <strong>CitizenShip:</strong>{" "}
                  {selectedPartner.citizenship_status}
                </p>
                <p>
                  <strong>Insurance:</strong> {selectedPartner.insurance}
                </p>
                <p>
                  <strong>Zip code:</strong> {selectedPartner.zip_code}
                </p>
                <p>
                  <strong>Physical:</strong> {selectedPartner.physical}
                </p>
                <p>
                  <strong>Mental:</strong> {selectedPartner.mental}
                </p>
                <p>
                  <strong>Social Determinants:</strong>{" "}
                  {selectedPartner.social_determinants_of_health}
                </p>
                <p>
                  <strong>Offer Transportation:</strong>{" "}
                  {selectedPartner.offers_transportation}
                </p>
                <p>
                  <strong>Emergency Room:</strong>{" "}
                  {selectedPartner.emergency_room}
                </p>
                <button
                  onClick={closeModal}
                  className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            ) : (
              <p>Loading partner details...</p>
            )}
          </Modal>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </>
  );
};

export default Dashboard;
