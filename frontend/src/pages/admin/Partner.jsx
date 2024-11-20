import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../../../src/App.css';

Modal.setAppElement("#root");

function Partner() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');  // State for search query
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

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter partners based on search query
  const filteredPartners = partners.filter(partner =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.telephone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const updateUser =(id) => {
    navigate(`/admin/UpdatePartner/${id}`);
  };

  return (
    <>
      <div className='w-full flex justify-end'>
        <div className="w-full max-w-sm min-w-[200px] mt-4 mr-10">
          <div className="relative">
            <input
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Search partners..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button
              className="absolute top-1 right-1 flex items-center rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
              </svg>
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-4 mt-6">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-yellow-300 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 text-black font-bold text-sm">Name</th>
              <th className="px-6 py-3 text-black font-bold text-sm">Phone No</th>
              <th className="px-6 py-3 text-black font-bold text-sm">Contact</th>
              <th className="px-6 py-3 text-black font-bold text-sm">Address</th>
              <th className="px-6 py-3 text-black font-bold text-sm">Gender</th>
              <th className="px-6 py-3 text-black font-bold text-sm text-end">Detail</th>
              <th className="px-6 py-3 text-black font-bold text-sm text-end">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((partner, ind) => (
              <tr
                key={ind}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 text-black font-semibold">{partner.name}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.telephone}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.contact}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.address}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.gender}</td>

                <td className=" py-4">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => fetchPartnerDetails(partner._id)}
                  >
                    More Info
                  </button>
                </td>
                <td className="flex justify-center py-4">
                  <button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-2 py-1 mr-3" onClick={() => updateUser(partner._id)}>Update</button>
                  <button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-4 py-1" onClick={() => DeleteRecord(partner._id)}>Delete</button>
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
                className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-md mx-1`}
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

      {selectedPartner && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Partner Details"
          className="modal"
        >
          <h2 className="text-2xl font-bold">Partner Details</h2>
          <p>Name: {selectedPartner.name}</p>
          <p>Phone: {selectedPartner.telephone}</p>
          <p>Contact: {selectedPartner.contact}</p>
          <p>Address: {selectedPartner.address}</p>
          <p>Gender: {selectedPartner.gender}</p>
          <p>More Info: {selectedPartner.info}</p>
          <button className="mt-4 bg-red-500 text-white py-2 px-4 rounded" onClick={closeModal}>Close</button>
        </Modal>
      )}
    </>
  );
}

export default Partner;
