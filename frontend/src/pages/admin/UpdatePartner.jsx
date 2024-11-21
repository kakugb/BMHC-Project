import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function UpdatePartner() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initial partner state
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

  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    telephone: '',
    contact: '',
    address: '',
    gender: '',
    age_range: '',
    citizenship_status: '',
    insurance: '',
    zip_code: '',
    physical: '',
    mental: '',
    social_determinants_of_health: '',
    offers_transportation: '',
    emergency_room: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const zipCodeOptions = [
    "Downtown Austin - 78701",
    "South Central Austin - 78704",
    "Central Austin - 78703",
    "Central Austin - 78705",
    "Downtown Austin - 78701",
"South Central Austin - 78704",
"Central Austin - 78703",
"Central Austin - 78705",
"Central Austin - 78712",
"Central Austin - 78751",
"Central Austin - 78756",
"Central Austin - 78757",
"East Austin - 78702",
"East Austin - 78722",
"Southeast Austin - 78719",
"Southeast Austin - 78741",
"Southeast Austin - 78742",
"Southeast Austin - 78744",
"Southeast Austin - 78747",
"South Austin - 78745",
"South Austin - 78748",
"Southwest Austin - 78735",
"Southwest Austin - 78736",
"Southwest Austin - 78737",
"Southwest Austin - 78738",
"Southwest Austin - 78739",
"Southwest Austin - 78749",
"Westlake Hills - 78733",
"Westlake Hills - 78746",
"Northwest Austin - 78726",
"Northwest Austin - 78727",
"Northwest Austin - 78728",
"Northwest Austin - 78729",
"Northwest Austin - 78730",
"Northwest Austin - 78731",
"Northwest Austin - 78750",
"Northwest Austin - 78758",
"Northwest Austin - 78759",
"Lake Travis - 78732",
"Lake Travis - 78734",
"Northeast Austin - 78710",
"Northeast Austin - 78721",
"Northeast Austin - 78723",
"Northeast Austin - 78724",
"Northeast Austin - 78725",
"Northeast Austin - 78752",
"Northeast Austin - 78753",
"Northeast Austin - 78754",
"Buda - 78610",
"Cedar Creek - 78612",
"Cedar Park - 78613",
"Coupland - 78615",
"Del Valle - 78617",
"Dripping Springs - 78620",
"Elgin - 78621",
"Hutto - 78634",
"Leander - 78641",
"Leander - 78645",
"Liberty Hill - 78642",
"Manchaca - 78652",
"Manor - 78653",
"Marble Falls - 78654",
"Round Mountain - 78663",
"Round Rock - 78664",
"Spicewood - 78669"
  ];

  const physicalServices = [
    'Physical Care', 'Health Screenings', 'MAP Enrollment', 'Public Funded Health Insurance'
  ];

  const mentalServices = [
    'Counseling', 'Nutrition Education', 'Psychiatric Assessments & Treatment', 'Trauma & Post-Traumatic Stress'
  ];

  const socialServices = [
    'Food', 'Diversion', 'Transportation', 'Workforce (Career Skills)', 'Training', 'PSH Supportive Services'
  ];

  // Fetch partner details
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/api/partners/${id}`)
        .then(response => {
          setPartner(response.data);
          setFormData({ ...response.data }); // Populate form data with partner info
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching partner details:', error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'zip_code') {
      setPartner({ ...partner, zip_code: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure token is available for authorization
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authorization token is missing.');
      setError('Authorization token is missing.');
      return;
    }
    
    // Send formData to the backend instead of partner if formData contains the required fields
    axios.put(`http://localhost:5000/api/partners/update/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Ensure token is added in the header
        'Content-Type': 'application/json'   // Ensure the content type is correct
      }
    })
    .then(response => {
      console.log('Partner updated successfully:', response.data);
      toast.success("Partner Updated successfully!");
     setTimeout(() => {
      navigate('/admin/partner'); 
     }, 2000);
    })
    .catch(error => {
      console.error('Error updating partner:', error.response ? error.response.data : error.message);
      setError('Error updating partner');  // Optionally show a user-friendly error message
    });
  };
  

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen p-6 text-black">
      <div className="max-w-xl mx-auto p-6 bg-yellow-100 shadow-lg rounded-lg">
        <h2 className="text-center text-xl font-bold mb-4 text-yellow-700">
          Update Partner Information
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium text-black mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            />
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Telephone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            />
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            />
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            />
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Age Range</label>
            <select
              name="age_range"
              value={formData.age_range}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            >
              <option value="">Select Age Range</option>
              <option value="Minors (under 18)">Minors under 18</option>
              <option value="Adults (18-64)">Adults 18-64</option>
              <option value="Seniors (65 and over)">Seniors 65 and over</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Citizenship Status</label>
            <select
              name="citizenship_status"
              value={formData.citizenship_status}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            >
              <option value="">Select Citizenship Status</option>
              <option value="Citizen">Citizen</option>
              <option value="Resident">Resident</option>
              <option value="Non-immigrant (temporary visa)">Non-immigrant temporary visa</option>
              <option value="Undocumented">Undocumented</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Insurance</label>
            <select
              name="insurance"
              value={formData.insurance}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            >
              <option value="">Select Insurance</option>
              <option value="Accepts private insurance">Accepts Private Insurance</option>
              <option value="Accepts Medicare">Accepts Medicare</option>
              <option value="Accepts Medicaid">Accepts Medicaid</option>
              <option value="Accepts MAP">Accepts MAP</option>
              <option value="Accepts Ryan White Program">Accepts Ryan White Program</option>
              <option value="Accepts patients/clients without insurance">Accepts Patients/Clients Without Insurance</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Zip Code</label>
            <select
              name="zip_code"
              value={formData.zip_code}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            >
              <option value="">Select Zip Code</option>
              {zipCodeOptions.map((zip, index) => (
                <option key={index} value={zip}>{zip}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Physical Services</label>
            <select
              name="physical"
              value={formData.physical}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            >
              <option value="">Select Physical Service</option>
              {physicalServices.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Mental Services</label>
            <select
              name="mental"
              value={formData.mental}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            >
              <option value="">Select Mental Service</option>
              {mentalServices.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Social Determinants of Health</label>
            <select
              name="social_determinants_of_health"
              value={formData.social_determinants_of_health}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            >
              <option value="">Select Social Determinant of Health</option>
              {socialServices.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-black mb-1">Emergency Room</label>
            <select
              name="emergency_room"
              value={formData.emergency_room}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            >
              <option value="">Select Emergency Room</option>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div className="mt-6">
            <button type="submit" className="w-full py-3 bg-yellow-500 text-white font-semibold rounded">
              Update Partner
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UpdatePartner;
