import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "../../../src/App.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
Modal.setAppElement("#root");

function Dashbaord() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const entriesPerPage = 7;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchAllPartners = () => {
    axios
      .get("http://localhost:5000/api/partners/list")
      .then((response) => {
        setPartners(response.data);
      })
      .catch((error) => console.error("Error fetching partners:", error));
  };

  useEffect(() => {
    fetchAllPartners();
  }, []);

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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  const filteredPartners = partners.filter((partner) => {
    return (
      (partner.name ? partner.name.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      ) ||
      (partner.telephone ? partner.telephone.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      ) ||
      (partner.contact ? partner.contact.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      ) ||
      (partner.address ? partner.address.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      )
    );
  });

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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchPartnersByName = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/partners/filterByName",
        { name: query }
      );
      setPartners(response.data);
    } catch (err) {
      setError("Error fetching partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchAllPartners();
    } else {
      fetchPartnersByName(searchQuery);
    }
    setCurrentPage(1); // Reset to the first page whenever search query changes
  }, [searchQuery]);

  return (
    <>
      <div className="w-full flex justify-end">
        <div className="w-full max-w-sm min-w-[200px] mt-4 mr-10">
          <div className="relative">
            <input
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-400 rounded-md pl-3 pr-28 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Search partners..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              className="absolute top-1 right-1 flex items-center rounded bg-blue-600 py-2 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-hidden  w-10/12 mx-auto mt-6 rounded-xl  ">
      <table className="w-full divide-y divide-gray-200  p-5 shadow-md shadow-slate-400" >
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
            {currentEntries.map((partner, ind) => (
              <tr key={ind} className="hover:bg-gray-50">
                <td className="px-6 py-4 texxt-md font-semibold whitespace-nowrap">
                  {partner.name}
                </td>
                <td className="px-6 py-4 texxt-md font-semibold whitespace-nowrap">
                  {partner.email}
                </td>
                <td className="px-6 py-4 texxt-md font-semibold whitespace-nowrap">
                  {partner.telephone}
                </td>
                <td className="px-6 py-4 texxt-md font-semibold whitespace-nowrap">
                  <button
                    className="px-4 py-2 bg-green-200 text-green-800 hover:bg-green-300 hover:text-white inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                    onClick={() => fetchPartnerDetails(partner._id)}
                  >
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
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-l-md"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span className="px-4 py-2 text-lg">
              {currentPage}/{totalPages}
            </span>
            <button
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-r-md"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

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
                      ? Array.isArray(
                          selectedPartner.social_determinants_of_health
                        )
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

      <ToastContainer />
    </>
  );
}

export default Dashbaord;
