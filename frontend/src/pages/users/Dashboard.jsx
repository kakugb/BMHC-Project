import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import '../../../src/App.css'

Modal.setAppElement("#root");

function Dashboard() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const entriesPerPage = 7;

  // Fetch all partners from the API
  const fetchAllPartners = () => {
    axios
      .get('http://localhost:5000/api/partners/list')
      .then(response => {
        setPartners(response.data);
        setFilteredPartners(response.data); // Initialize filtered partners
      })
      .catch(error => console.error('Error fetching partners:', error));
  };

  useEffect(() => {
    fetchAllPartners();
  }, []);

  // Fetch partner details based on ID
  const fetchPartnerDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/partners/${id}`);
      setSelectedPartner(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching partner details:', error);
    }
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  // Filter partners based on search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const searchTerm = e.target.value.toLowerCase();

    const filtered = partners.filter(partner => 
      partner.name.toLowerCase().includes(searchTerm) ||
      partner.contact.toLowerCase().includes(searchTerm) ||
      partner.telephone.toLowerCase().includes(searchTerm)
    );

    setFilteredPartners(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Pagination logic
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
              <th className="px-6 py-4 text-black font-bold text-sm">Name</th>
              <th className="px-6 py-4 text-black font-bold text-sm">Email</th>
              <th className="px-6 py-4 text-black font-bold text-sm">Contact Info</th>
              <th className="px-6 py-4 text-black font-bold text-sm">Zip Code</th>
              <th className="px-6 py-4 text-black font-bold text-sm">Specialty</th>
              <th className="px-6 py-4 text-black font-bold text-sm">Address</th>
              <th className="px-6 py-4 text-black font-bold text-sm">More Info</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((partner, ind) => (
              <tr
                key={ind}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 text-black font-semibold">{partner.name}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.contact}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.telephone}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.address}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.zip_code}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.gender}</td>
                <td className="px-6 py-4 text-black font-semibold">{partner.status}</td>
                <td className="px-6 py-4">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => fetchPartnerDetails(partner._id)}
                  >
                    More Info
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPartners.length > 7 && (
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
           <p><strong>Email:</strong> {selectedPartner.telephone}</p>
           <p><strong>Contact Info:</strong> {selectedPartner.contact}</p>
           <p><strong>Zip Code:</strong> {selectedPartner.address}</p>
           <p><strong>Specialty:</strong> {selectedPartner.gender}</p>
           <p><strong>Address:</strong> {selectedPartner.age_range}</p>
           <p><strong>Status:</strong> {selectedPartner.citizenship_status}</p>
           <p><strong>Status:</strong> {selectedPartner.insurance}</p>
           <p><strong>Status:</strong> {selectedPartner.zip_code}</p>
           <p><strong>Status:</strong> {selectedPartner.physical}</p>
           <p><strong>Status:</strong> {selectedPartner.mental}</p>
           <p><strong>Status:</strong> {selectedPartner.social_determinants_of_health}</p>
           <p><strong>Status:</strong> {selectedPartner.offers_transportation}</p>
           <p><strong>Status:</strong> {selectedPartner.emergency_room}</p>
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
    </>
  );
}

export default Dashboard;
