import React, { useEffect, useState ,useRef } from "react";
import {
  zipCodeOptions,
  physicalServices,
  mentalServices,
  socialServices
} from "../../utils/data";
import axios from "axios";
import "../../../src/App.css";
import Modal from "react-modal";
Modal.setAppElement("#root");
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [message, setMessage] = useState(""); // Add this state
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
 const [karamat,setKaramat]= useState([])
  const entriesPerPage = 6;  // You can adjust this number

  // Pagination logic for filtered partners
 

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
    {
      label: "Gender",
      key: "gender",
      options: ["Male", "Female", "Non-binary"]
    },
    {
      label: "Age Range",
      key: "age_range",
      options: ["Minors (under 18)", "Adults (18-64)", "Seniors (65 and over)"]
    },
    {
      label: "Citizenship Status",
      key: "citizenship_status",
      options: [
        "Citizen",
        "Resident",
        "Non-immigrant (temporary visa)",
        "Undocumented"
      ]
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
      ]
    },
    {
      label: "Zip Code",
      key: "zip_code",
      options: zipCodeOptions // Correctly assign zipCodeOptions here
    },
    { label: "Physical Health", key: "physical", options: physicalServices },
    { label: "Mental Health", key: "mental", options: mentalServices },
    {
      label: "Social Determinants of Health",
      key: "social_determinants_of_health",
      options: socialServices
    },
    {
      label: "Offers Transportation",
      key: "offers_transportation",
      options: ["Yes", "No"]
    },
    {
      label: "Emergency Room Visits",
      key: "emergency_room",
      options: ["Yes", "No"]
    }
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


  const [currentPageKaramat, setCurrentPageKaramat] = useState(1);
  const totalPagesKaramat = Math.ceil(karamat.length / entriesPerPage);
  const currentEntriesKaramat = karamat.slice(
    (currentPageKaramat - 1) * entriesPerPage,
    currentPageKaramat * entriesPerPage
  );
  const handlePageChangeKaramat = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPagesKaramat) {
      setCurrentPageKaramat(pageNumber);
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

      setFilteredPartners(response.data);
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

  

  const handleOptionToggle = (index, option) => {
    const updatedOptions = dropdowns[index].selectedOptions.includes(option)
      ? dropdowns[index].selectedOptions.filter((item) => item !== option)
      : [...dropdowns[index].selectedOptions, option];
  
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index ? { ...dropdown, selectedOptions: updatedOptions } : dropdown
      )
    );
  
    setFormData((prev) => ({
      ...prev,
      [fields[index].key]: updatedOptions,
    }));
  };
  const fetchAllPartners = () => {
    axios
      .get("http://localhost:5000/api/partners/list")
      .then((response) => {
        setKaramat(response.data);
      })
      .catch((error) => console.error("Error fetching partners:", error));
  };

  useEffect(() => {
    fetchAllPartners();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (Object.values(formData).every(value => value.length === 0)) {
        setMessage("No entries selected by user");
        setFilteredPartners([]);
        return;
      }
  
      try {
        const response = await axios.post(
          "http://localhost:5000/api/partners/filter",
          formData
        );
        console.log("API Response:", response.data);
        setFilteredPartners(response.data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };
  
    fetchFilteredData();
  }, [formData]);
  

  const handleSearchChange = (index, value) => {
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index ? { ...dropdown, search: value } : dropdown
      )
    );
  };
  

  const fetchPartnerDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/partners/${id}`
      );
      setSelectedPartner(response.data);
      setIsModalOpen(true);
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

  const dropdownRefs = useRef([]); 

  const toggleDropdown = (index) => {
    setDropdowns((prev) =>
      prev.map((dropdown, i) =>
        i === index ? { ...dropdown, isOpen: !dropdown.isOpen } : dropdown
      )
    );
  };

 
  const handleClickOutside = (event) => {
    dropdownRefs.current.forEach((dropdown, index) => {
      if (dropdown && !dropdown.contains(event.target)) {
       
        setDropdowns((prev) =>
          prev.map((dropdown, i) =>
            i === index ? { ...dropdown, isOpen: false } : dropdown
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



  return (
    <>
      <div className="w-full flex justify-normal gap-2 mr-7">
        <div className="w-3/12">
          <form
            onSubmit={handleSubmit}
            className="w-full h-screen mt-1 space-y-6  bg-gray-300  ml-2"
          >
            {fields.map((field, index) => {
              const dropdown = dropdowns[index];
              const filteredOptions = field.options.filter((option) =>
                option.toLowerCase().includes(dropdown.search.toLowerCase())
              );

              return (
                <div key={field.key} className="relative w-full max-w-sm" ref={(el) => (dropdownRefs.current[index] = el)}>
                  <button
                    type="button"
                    onClick={() => toggleDropdown(index)}
                    className="w-full bg-gray-200 py-1.5 px-4 rounded flex justify-between items-center"
                  >
                    {dropdown.selectedOptions.length > 0
                      ? dropdown.selectedOptions.join(", ")
                      : `Select ${field.label}`}
                    <span
                      className={`ml-2 transform ${
                        dropdown.isOpen ? "rotate-180" : "rotate-0"
                      }`}
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
                        onChange={(e) =>
                          handleSearchChange(index, e.target.value)
                        }
                        className="w-full px-4 py-2 border-b"
                      />
                      <ul className="max-h-40 overflow-y-auto">
                        {filteredOptions.map((option) => (
                          <li
                            key={option}
                            onClick={() => handleOptionToggle(index, option)}
                            className="px-4  flex items-center hover:bg-gray-100 cursor-pointer "
                          >
                            <input
                              type="checkbox"
                              checked={dropdown.selectedOptions.includes(
                                option
                              )}
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

        
          </form>
        </div>
        <div className="w-9/12 mx-4">
  {currentEntries.length ? (
    <table className="w-full divide-y divide-gray-200 bg-gray- p-5">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">
            Contact Number
          </th>
          <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">
            Detail
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {currentEntries.map((partner) => (
          <tr key={partner._id}>
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
                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                onClick={() => fetchPartnerDetails(partner._id)}
              >
                View Detail
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <table className="w-full divide-y divide-gray-200 bg-gray- p-5">
      <thead>
        <tr>
          <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">
            Contact Number
          </th>
          <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">
            Detail
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {currentEntriesKaramat.map((partner) => (
          <tr key={partner._id}>
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
                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                onClick={() => fetchPartnerDetails(partner._id)}
              >
                View Detail
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
  )}

  {
    currentEntriesKaramat ? <div className="flex justify-center py-4">
    <button
      className="px-4 py-2 bg-gray-500 text-white rounded-l-md"
      onClick={() => handlePageChangeKaramat(currentPageKaramat - 1)}
      disabled={currentPageKaramat === 1}
    >
      Previous
    </button>
    <span className="px-4 py-2 text-lg">
      {currentPageKaramat}/{totalPagesKaramat}
    </span>
    <button
      className="px-4 py-2 bg-gray-500 text-white rounded-r-md"
      onClick={() => handlePageChangeKaramat(currentPageKaramat + 1)}
      disabled={currentPageKaramat === totalPagesKaramat}
    >
      Next
    </button>
  </div> :<div className="flex justify-center py-4">
      <button
        className="px-4 py-2 bg-gray-500 text-white rounded-l-md"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="px-4 py-2 text-lg">
        {currentPage}/{totalPages}
      </span>
      <button
        className="px-4 py-2 bg-gray-500 text-white rounded-r-md"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  }

</div>

      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Partner Details"
        className="modal-content"
        overlayClassName="modal-overlay "
        style={{ content: { width: "900px" } }}
      >
        {selectedPartner ? (
          <div>
            <h2 className="text-xl font-bold mb-2 text-center">
              Partner Details
            </h2>
            <div className="w-full grid grid-cols-3 gap-4">
              <h1 className="text-xl font-bold">Personal information</h1>
              <h1 className="text-xl font-bold">Service Provided</h1>
              <h1 className="text-xl font-bold">Served Information</h1>
            </div>
            <div className="w-full grid grid-cols-3 gap-4 mt-5">
              <p className="font-semibold mt-2">
                <strong>Name</strong>
                <h1 className="ml-5"> {selectedPartner.name}</h1>
              </p>
              <p className="font-semibold mt-2">
                <strong>Physical</strong>
                <h1 className="ml-5">
                  {selectedPartner.physical
                    ? Array.isArray(selectedPartner.physical)
                      ? selectedPartner.age_range
                          .map((status, index) => `(${status})`)
                          .join("   ")
                      : `(${selectedPartner.physical})`
                    : "No data available"}
                </h1>
              </p>

              <p className="font-semibold mt-2">
                <strong>Age Range(s) Served </strong>{" "}
                <h1 className="ml-5">
                  {selectedPartner.age_range
                    ? Array.isArray(selectedPartner.age_range)
                      ? selectedPartner.age_range
                          .map((status, index) => `(${status})`)
                          .join("   ")
                      : `(${selectedPartner.age_range})`
                    : "No data available"}
                </h1>
              </p>
            </div>

            <div className="w-full grid grid-cols-3 gap-4 mt-3">
              <p className="font-semibold mt-2">
                <strong>Email Address</strong>{" "}
                <h1 className="ml-5">{selectedPartner.email}</h1>
              </p>

              <p className="font-semibold mt-2">
                <strong>Mental</strong>{" "}
                <h1 className="ml-5">
                  {" "}
                  {selectedPartner.mental
                    ? Array.isArray(selectedPartner.mental)
                      ? selectedPartner.mental
                          .map((status, index) => `(${status})`)
                          .join("   ")
                      : `(${selectedPartner.mental})`
                    : "No data available"}
                </h1>
              </p>

              <p className="font-semibold mt-2">
                <strong>Citizenship Status(es) Served </strong>{" "}
                <h1 className="ml-5">
                  {selectedPartner.citizenship_status
                    ? Array.isArray(selectedPartner.citizenship_status)
                      ? selectedPartner.citizenship_status
                          .map((status, index) => `(${status})`)
                          .join("   ")
                      : `(${selectedPartner.citizenship_status})`
                    : "No data available"}
                </h1>
              </p>
            </div>

            <div className="w-full grid grid-cols-3 gap-4 mt-3">
              <p className="font-semibold mt-2">
                <strong>Address </strong>{" "}
                <h1 className="ml-5">{selectedPartner.address}</h1>
              </p>

              <p className="font-semibold mt-2">
                <strong>Socal Determinants of Health</strong>
                <h1 className="ml-5">
                  {selectedPartner.social_determinants_of_health
                    ? Array.isArray(
                        selectedPartner.social_determinants_of_health
                      )
                      ? selectedPartner.social_determinants_of_health
                          .map((status, index) => `(${status})`)
                          .join("   ")
                      : `(${selectedPartner.social_determinants_of_health})`
                    : "No data available"}
                </h1>
              </p>

              <p className="font-semibold mt-2">
                <strong>Accepted Insurance status(es)</strong>
                <h1 className="ml-5">
                  {" "}
                  {selectedPartner.insurance
                    ? Array.isArray(selectedPartner.insurance)
                      ? selectedPartner.insurance
                          .map((status, index) => `(${status})`)
                          .join("   ")
                      : `(${selectedPartner.insurance})`
                    : "No data available"}
                </h1>{" "}
              </p>
            </div>

            <div className="w-full grid grid-cols-3 gap-4 mt-3">
              <p className="font-semibold mt-2">
                <strong>Contact Number</strong>
                <h1 className="ml-5"> {selectedPartner.telephone}</h1>
              </p>

              <p className="font-semibold mt-2">
                <strong>Offer Transportation</strong>
                <h1 className="ml-5">
                  {" "}
                  {selectedPartner.offers_transportation}
                </h1>
              </p>

              <p className="font-semibold mt-2">
                <strong>Gender </strong>{" "}
                <h1 className="ml-5">
                  {selectedPartner.gender
                    ? Array.isArray(selectedPartner.gender)
                      ? selectedPartner.gender
                          .map((status, index) => `(${status})`)
                          .join("   ")
                      : `(${selectedPartner.gender})`
                    : "No data available"}
                </h1>
              </p>
            </div>
            <div className="w-full grid grid-cols-3 gap-4">
              <p className="font-semibold mt-2">
                <strong>Zip Code</strong>{" "}
                <h1 className="ml-5">{selectedPartner.zip_code}</h1>
              </p>

              <p className="font-semibold mt-2">
                <strong>Emergency Room</strong>
                <h1 className="ml-5"> {selectedPartner.emergency_room}</h1>
              </p>
            </div>

            <div className="w-full mt-4">
            <button
              onClick={closeModal}
              className="flex mx-auto mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 "
            >
              Close
            </button>
            </div>
          </div>
        ) : (
          <p>Loading partner details...</p>
        )}
      </Modal>
    </>
  );
};

export default Dashboard;
