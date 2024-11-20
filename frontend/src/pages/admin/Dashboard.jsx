import React, { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    zip_code: "",
    contact_info: "",
    email: "",
  });

  const [filteredPartners, setFilteredPartners] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
   
    handleFilter(updatedData);
  };

  const handleFilter = (filterData) => {
    axios
      .post("http://localhost:5000/api/partners/filtersingle", filterData)
      .then((response) => {
        setFilteredPartners(response.data);
      })
      .catch((error) => console.error("Error filtering partners:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFilter(formData); 
  };

  return (
    <div className="min-h-screen p-6 text-black">
     
      <div className="max-w-xl mx-auto p-4 bg-yellow-100 shadow-lg rounded-lg">
        <h2 className="text-center text-xl font-bold mb-4 text-yellow-700">
          Filter Partners
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-bold mb-2 text-sm">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-yellow-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="specialty" className="block font-bold mb-2 text-sm">
              Specialty
            </label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleInputChange}
              className="w-full p-2 border border-yellow-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="zip_code"
              className="block font-bold mb-2 text-sm"
            >
              Zip Code
            </label>
            <input
              type="text"
              id="zip_code"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              className="w-full p-2 border border-yellow-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="contact_info"
              className="block font-bold mb-2 text-sm"
            >
              Contact Info
            </label>
            <input
              type="text"
              id="contact_info"
              name="contact_info"
              value={formData.contact_info}
              onChange={handleInputChange}
              className="w-full p-2 border border-yellow-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold mb-2 text-sm">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-yellow-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-600"
          >
            Submit
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="mt-8">
        <h3 className="text-center text-lg font-bold mb-4 text-yellow-700">
          Filtered Partners
        </h3>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg mx-auto max-w-6xl">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-yellow-300 text-black">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Specialty</th>
                <th className="px-6 py-3">Zip Code</th>
                <th className="px-6 py-3">Contact Info</th>
                <th className="px-6 py-3">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.length > 0 ? (
                filteredPartners.map((partner, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b hover:bg-yellow-50"
                  >
                    <td className="px-6 py-4">{partner.name}</td>
                    <td className="px-6 py-4">{partner.specialty}</td>
                    <td className="px-6 py-4">{partner.zip_code}</td>
                    <td className="px-6 py-4">{partner.contact_info}</td>
                    <td className="px-6 py-4">{partner.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-yellow-700 font-bold"
                  >
                    No matching partners found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
