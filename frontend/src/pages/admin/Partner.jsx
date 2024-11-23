import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "../../../src/App.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
Modal.setAppElement("#root");

function Partner() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const entriesPerPage = 7;

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

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPartners = partners.filter((partner) => {
    return (
      (partner.name ? partner.name.toLowerCase() : '').includes(searchQuery.toLowerCase()) ||
      (partner.telephone ? partner.telephone.toLowerCase() : '').includes(searchQuery.toLowerCase()) ||
      (partner.contact ? partner.contact.toLowerCase() : '').includes(searchQuery.toLowerCase()) ||
      (partner.address ? partner.address.toLowerCase() : '').includes(searchQuery.toLowerCase())
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

  const DeleteRecord = (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    axios
      .delete(`http://localhost:5000/api/partners/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        fetchAllPartners();
        toast.success("Partner deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting partner:", error);
        toast.error("Error deleting partner!");
      });
  };

  const updateUser = (id) => {
    navigate(`/admin/UpdatePartner/${id}`);
  };

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

      <div className="w-10/12 mx-auto mt-6 ">
        <table className="w-full divide-y divide-gray-200 bg-gray- p-5">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">Contact Number</th>
              <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">Detail</th>
              <th className="px-6 py-3 text-left text-md font-semibold text-white bg-gray-500 uppercase tracking-wider">Action</th>
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
                <td className="px-6 py-4 texxt-md font-semibold whitespace-nowrap">
                  <button className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out" onClick={() => updateUser(partner._id)}>Edit</button>
                  <button className="ml-2 px-4 texxt-md font-semibold py-2 text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out" onClick={() => DeleteRecord(partner._id)}>Delete</button>
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Partner Details"
        className="modal-content w-[1900px]"
        overlayClassName="modal-overlay"
      >
        {selectedPartner ? (
          <div>
            <h2 className="text-xl font-bold mb-2">Partner Details</h2>

            <p className="font-semibold mt-2">
              <strong>Name:</strong>
              <span className="ml-5"> {selectedPartner.name}</span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Email:</strong>{" "}
              <span className="ml-5">{selectedPartner.email}</span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Contact Info:</strong>
              <span className="ml-5"> {selectedPartner.telephone}</span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Address :</strong>{" "}
              <span className="ml-5">{selectedPartner.address}</span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Gender :</strong>{" "}
              <span className="ml-5">
                {selectedPartner.gender
                  ? Array.isArray(selectedPartner.gender)
                    ? selectedPartner.gender
                        .map((status, index) => `(${status})`)
                        .join("   ")
                    : `(${selectedPartner.gender})`
                  : "No data available"}
              </span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Age Range :</strong>{" "}
              <span className="ml-5">
                {selectedPartner.age_range
                  ? Array.isArray(selectedPartner.age_range)
                    ? selectedPartner.age_range
                        .map((status, index) => `(${status})`)
                        .join("   ")
                    : `(${selectedPartner.age_range})`
                  : "No data available"}
              </span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Citizenship Status:</strong>{" "}
              <span className="ml-5">
                {selectedPartner.citizenship_status
                  ? Array.isArray(selectedPartner.citizenship_status)
                    ? selectedPartner.citizenship_status
                        .map((status, index) => `(${status})`)
                        .join("   ")
                    : `(${selectedPartner.citizenship_status})`
                  : "No data available"}
              </span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Insurance:</strong>
              <span className="ml-5">
                {" "}
                {selectedPartner.insurance
                  ? Array.isArray(selectedPartner.insurance)
                    ? selectedPartner.insurance
                        .map((status, index) => `(${status})`)
                        .join("   ")
                    : `(${selectedPartner.insurance})`
                  : "No data available"}
              </span>{" "}
            </p>
            <p className="font-semibold mt-2">
              <strong>Zip Code:</strong>{" "}
              <span className="ml-5">{selectedPartner.zip_code}</span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Physical:</strong>
              <span className="ml-5">
                {selectedPartner.physical
                  ? Array.isArray(selectedPartner.physical)
                    ? selectedPartner.age_range
                        .map((status, index) => `(${status})`)
                        .join("   ")
                    : `(${selectedPartner.physical})`
                  : "No data available"}
              </span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Mental:</strong>{" "}
              <span className="ml-5">
                {" "}
                {selectedPartner.mental
                  ? Array.isArray(selectedPartner.mental)
                    ? selectedPartner.mental
                        .map((status, index) => `(${status})`)
                        .join("   ")
                    : `(${selectedPartner.mental})`
                  : "No data available"}
              </span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Socal Determinants:</strong>
              <span className="ml-5">
                {selectedPartner.social_determinants_of_health
                  ? Array.isArray(selectedPartner.social_determinants_of_health)
                    ? selectedPartner.social_determinants_of_health
                        .map((status, index) => `(${status})`)
                        .join("   ")
                    : `(${selectedPartner.social_determinants_of_health})`
                  : "No data available"}
              </span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Offer Transportation:</strong>
              <span className="ml-5">
                {" "}
                {selectedPartner.offers_transportation}
              </span>
            </p>
            <p className="font-semibold mt-2">
              <strong>Emergency Room:</strong>
              <span className="ml-5"> {selectedPartner.emergency_room}</span>
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


      <ToastContainer />
    </>
  );
}

export default Partner;
