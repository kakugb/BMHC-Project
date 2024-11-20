import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../../../src/App.css'

Modal.setAppElement("#root");

function Partner() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const entriesPerPage = 7;

  const fetchAllPartners = () => {
    axios
      .get('http://localhost:5000/api/partners/list')
      .then(response => {
        setPartners(response.data);
      })
      .catch(error => console.error('Error fetching partners:', error));
  };

  useEffect(() => {
    fetchAllPartners();
  }, []);

  const fetchPartnerDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/partners/${id}`);
      console.log(response)
      setSelectedPartner(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching partner details:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  const totalPages = Math.ceil(partners.length / entriesPerPage);
  const currentEntries = partners.slice(
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
          Authorization: `Bearer ${token}`, 
        },
      })
      .then(() => {
        fetchAllPartners(); 
      })
      .catch((error) => {
        console.error("Error deleting partner:", error);
      });
  };

  const updateUser =(id)=>{
    navigate(`/admin/UpdatePartner/${id}`);
  }

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-4 mt-6">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-yellow-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 text-black font-bold text-sm">Name</th>
              <th className="px-6 py-3 text-black font-bold text-sm">Email</th>
              <th className="px-6 py-3 text-black font-bold text-sm">Contact_info</th>
              <th className="px-6 py-3 text-black font-bold text-sm">Zip Code</th>
              <th className="px-6 py-3 text-black font-bold text-sm">Specialty</th>
              <th className="px-6 py-3 text-black font-bold text-sm">Address</th>
              <th className="px-6 py-3 text-black font-bold text-sm">Status</th>
              <th className="px-6 py-3 text-black font-bold text-sm">More Info</th>
              <th className="px-6 py-3 text-black font-bold text-sm">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((partner, ind) => (
              <tr
                key={ind}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 text-black font-semibold">{partner.name}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.email}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.contact_info}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.zip_code}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.specialty}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.address}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.status}</td>
                <td className="px-6 py-4">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => fetchPartnerDetails(partner._id)}
                  >
                    More Info
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 mr-3 mb-2" onClick={(e)=>updateUser(partner._id)}>Update</button>
                  <button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-1 mt-1" onClick={(e)=>DeleteRecord(partner._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

       
        {partners.length > 7 && (
          <div className="flex justify-center py-4">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-l-md"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`px-4 py-2 ${
                  currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
                } rounded-md mx-1`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
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
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedPartner ? (
          <div>
            <h2 className="text-xl font-bold mb-2">Partner Details</h2>
            <p><strong>Name:</strong> {selectedPartner.name}</p>
            <p><strong>Email:</strong> {selectedPartner.email}</p>
            <p><strong>Contact Info:</strong> {selectedPartner.contact_info}</p>
            <p><strong>Zip Code:</strong> {selectedPartner.zip_code}</p>
            <p><strong>Specialty:</strong> {selectedPartner.specialty}</p>
            <p><strong>Address:</strong> {selectedPartner.address}</p>
            <p><strong>Status:</strong> {selectedPartner.status}</p>
            <p><strong>Status:</strong> {selectedPartner.partner_type}</p>
            <p><strong>Status:</strong> {selectedPartner.availability}</p>
            <button
              onClick={closeModal}
              className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </>
  );
}

export default Partner;
