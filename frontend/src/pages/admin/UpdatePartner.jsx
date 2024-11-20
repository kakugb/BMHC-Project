import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdatePartner() {
  const { id } = useParams(); 
  const [partner, setPartner] = useState({
    name: '',
    specialty: '',
    zip_code: '',
    contact_info: '',
    email: '',
    address: '',
    partner_type: '',
    availability: '',
    status: 'Active', 
  });
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/partners/${id}`)
        .then(response => {
          setPartner(response.data); 
          setLoading(false); 
        })
        .catch(error => {
          console.error('Error fetching partner details:', error);
          setLoading(false); 
        });
    }
  }, [id]); 

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPartner({ ...partner, [name]: value });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
  
    
    axios.put(`http://localhost:5000/api/partners/update/${id}`, partner, {
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    })
    .then(response => {
      console.log('Partner updated successfully:', response.data);
      navigate('/admin/dashboard'); 
    })
    .catch(error => {
      console.error('Error updating partner:', error);
    });
  };

  
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="mt-10">
      <h1 className="text-center mb-10 text-2xl font-bold">Update Partner</h1>
      <form className="bg-yellow-200 border rounded-md p-8 max-w-md mx-auto" onSubmit={handleSubmit}>
        
       
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="name"
            id="name"
            className="block py-2.5 px-0 w-full text-md text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={partner.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Name
          </label>
        </div>

      
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="specialty"
            id="specialty"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={partner.specialty}
            onChange={handleChange}
            required
          />
          <label htmlFor="specialty" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Specialty
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="zip_code"
            id="zip_code"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={partner.zip_code}
            onChange={handleChange}
            required
          />
          <label htmlFor="zip_code" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            ZIP Code
          </label>
        </div>

    
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="contact_info"
            id="contact_info"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={partner.contact_info}
            onChange={handleChange}
            required
          />
          <label htmlFor="contact_info" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Contact Info
          </label>
        </div>

      
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={partner.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Email
          </label>
        </div>

     
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="address"
            id="address"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={partner.address}
            onChange={handleChange}
            required
          />
          <label htmlFor="address" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Address
          </label>
        </div>

      
        <div className="relative z-0 w-full mb-5 group">
          <select
            name="partner_type"
            id="partner_type"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            value={partner.partner_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Partner Type</option>
            <option value="Vendor">Vendor</option>
            <option value="Client">Client</option>
            <option value="Service Provider">Service Provider</option>
            <option value="Other">Other</option>
          </select>
          <label htmlFor="partner_type" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Partner Type
          </label>
        </div>

       
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="availability"
            id="availability"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={partner.availability}
            onChange={handleChange}
            required
          />
          <label htmlFor="availability" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Availability
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="status"
            id="status"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={partner.status}
            onChange={handleChange}
            required
          />
          <label htmlFor="status" className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
            Status
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Update Partner
        </button>
      </form>
    </div>
  );
}

export default UpdatePartner;
