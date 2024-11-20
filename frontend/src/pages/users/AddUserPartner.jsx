import React, { useState } from "react";
import axios from "axios";

function AddUserPartner() {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    zip_code: "",
    contact_info: "",
    email: "",
    address: "",
    partner_type: "",
    availability: "",
    status: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); 
  const [partners, setPartners] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token"); 
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/partners/filter", 
        { name: searchTerm }, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      setPartners(response.data); 
    } catch (err) {
      setError("Error fetching partners. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token"); 

    if (!token) {
      setError("No token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/partners/create", 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      alert("Partner added successfully!");
      
      setFormData({
        name: "",
        specialty: "",
        zip_code: "",
        contact_info: "",
        email: "",
        address: "",
        partner_type: "",
        availability: "",
        status: "",
      });
    } catch (err) {
      setError("Error adding partner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6  text-black">
      <div className="flex justify-end mb-6">
        <div className="w-full max-w-sm min-w-[200px]">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder="Search Partners by Name..."
            />
            <button
              onClick={handleSearch}
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

     
      <div className="max-w-xl mx-auto p-6 bg-yellow-100 shadow-lg rounded-lg">
        <h2 className="text-center text-xl font-bold mb-4 text-yellow-700">
          Add New Partner
        </h2>
        <form onSubmit={handleSubmit}>
        
          {[ 
            { label: "Name", name: "name", type: "text" },
            { label: "Specialty", name: "specialty", type: "text" },
            { label: "Zip Code", name: "zip_code", type: "text" },
            { label: "Contact Info", name: "contact_info", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Address", name: "address", type: "text" },
          ].map(({ label, name, type }) => (
            <div className="mb-4" key={name}>
              <label
                htmlFor={name}
                className="block font-bold mb-2 text-sm capitalize"
              >
                {label}
              </label>
              <input
                type={type}
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="w-full p-2 border border-yellow-300 rounded-md"
                required
              />
            </div>
          ))}

         
          <div className="mb-4">
            <label
              htmlFor="partner_type"
              className="block font-bold mb-2 text-sm capitalize"
            >
              Partner Type
            </label>
            <select
              id="partner_type"
              name="partner_type"
              value={formData.partner_type}
              onChange={handleInputChange}
              className="w-full p-2 border border-yellow-300 rounded-md"
              required
            >
              <option value="">Select Partner Type</option>
              <option value="Vendor">Vendor</option>
              <option value="Client">Client</option>
              <option value="Service Provider">Service Provider</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="availability"
              className="block font-bold mb-2 text-sm capitalize"
            >
              Availability
            </label>
            <select
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="w-full p-2 border border-yellow-300 rounded-md"
              required
            >
              <option value="">Select Availability</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="On Request">On Request</option>
            </select>
          </div>

       
          <div className="mb-4">
            <label
              htmlFor="status"
              className="block font-bold mb-2 text-sm capitalize"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border border-yellow-300 rounded-md"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          
          <div className="mb-4 text-center">
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-600 text-white font-bold rounded-md"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

    
      <div className="mt-6">
        <h3 className="text-xl font-bold text-yellow-700 mb-4">Partner List</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="table-auto w-full text-sm text-left text-yellow-700">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Specialty</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Partner Type</th>
                <th className="px-4 py-2 border-b">Availability</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner._id} className="border-b">
                  <td className="px-4 py-2">{partner.name}</td>
                  <td className="px-4 py-2">{partner.specialty}</td>
                  <td className="px-4 py-2">{partner.status}</td>
                  <td className="px-4 py-2">{partner.partner_type}</td>
                  <td className="px-4 py-2">{partner.availability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}




export default AddUserPartner
