import React, { useState } from "react";
import axios from 'axios'
import '../../../src/App.css'
import Modal from 'react-modal';
Modal.setAppElement("#root");
const Dashboard = () => {
  const [partners, setPartners] = useState([]); // State to hold filtered partners
  const [loading, setLoading] = useState(false); // Loading state for API call
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  
  const [formData, setFormData] = useState({
  
    "gender": "",
    "age_range": "",
    "citizenship_status": "",
    "insurance": "",
    "zip_code": "",
    "physical": "",
    "mental": "",
    "social_determinants_of_health": "",
    "offers_transportation": "",
    "emergency_room":""
  });
  const [zipCodeInput, setZipCodeInput] = useState("");
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
    "Physical Care",
    "Health Screenings", 
    "MAP Enrollment", 
    "Public Funded Health Insurance",
  ];

  const mentalServices = [
    "Counseling", 
    "Nutrition Education", 
    "Psychiatric Assessments & Treatment", 
    "Trauma & Post-Traumatic Stress", 
    "Grief Assessments & Processing", 
    "Therapeutic Services for Severe Mental Illnesses", 
    "Counseling & Life Coaching Services", 
    "Medication Management", 
    "Substance Use Disorders", 
    "Coping Skills Improvement",
  ];

  const socialServices = [
   "Food", 
        "Diversion", 
        "Transportation", 
        "Workforce (Career Skills)", 
        "Training", 
        "PSH Supportive Services", 
        "Respite Medical Care Support", 
        "Reentry Support Services"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleZipCodeInputChange = (e) => {
    const { value } = e.target;
    setZipCodeInput(value); // Update the zip code input value
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  // Filter zip codes based on the input value
  const filteredZipCodes = zipCodeOptions.filter((zip) =>
    zip.toLowerCase().includes(zipCodeInput.toLowerCase())
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      console.log(formData); // Check form data
      const response = await axios.post("http://localhost:5000/api/partners/filtersingle", formData,);
      console.log(response);
      setPartners(response.data); // Set filtered partners to state
    } catch (err) {
      console.error("Error fetching filtered partners:", err.response ? err.response.data : err.message);
      setError("Error fetching filtered partners");
    } finally {
      setLoading(false);
    }
  };
  
  
 
  const fetchPartnerDetails = async (id) => {
    console.log("karamt",id)
    try {
      const response = await axios.get(`http://localhost:5000/api/partners/${id}`);
      console.log(response)
      setSelectedPartner(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching partner details:', error);
    }
  };

  
  return (<>  
    <div className="p-6 max-w-xl mx-auto bg-yellow-100 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-black">Filter Partners</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
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
            <option value="undocumented">Undocumented</option>
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
              <option key={index} value={zip}>
                {zip}
              </option>
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
              <option key={index} value={service}>
                {service}
              </option>
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
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label className="block font-medium text-black mb-1">
            Social Determinants of Health
          </label>
          <select
            name="social_determinants_of_health"
            value={formData.social_determinants_of_health}
            onChange={handleChange}
            className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
          >
            <option value="">Select Social Service</option>
            {socialServices.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
  
        <div>
          <label className="block font-medium text-black mb-1">
            Offers Transportation
          </label>
          <select
            name="offers_transportation"
            value={formData.offers_transportation}
            onChange={handleChange}
            className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
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
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
  
        <button
          type="submit"
          className="w-full bg-yellow-600 text-black font-bold py-3 px-6 rounded hover:bg-yellow-700 transition"
        >
         {loading ? "Loading..." : "Apply Filter"}
        </button>
      </form>
      {/* Display Error if Any */}
      {error && <p className="text-red-500 mt-4">{error}</p>}


    </div>
    
      {/* Display Filtered Results */}
      {partners.length > 0 && (
  <div className="mt-6">
    <h3 className="text-xl font-semibold text-black">Filtered Partners</h3>
    <table className="min-w-full w-1/2 bg-white border border-gray-300 mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 px-4 border-b text-left text-black">Name</th>
          <th className="py-2 px-4 border-b text-left text-black">Gender</th>
          <th className="py-2 px-4 border-b text-left text-black">Age Range</th>
          <th className="py-2 px-4 border-b text-left text-black">Phone No</th>
          <th className="py-2 px-4 border-b text-left text-black">Insurance</th>
          <th className="px-6 py-3 text-black font-bold text-sm">Action</th>
        </tr>
      </thead>
      <tbody>
        {partners.map((partner, index) => (
          <tr
            key={partner.id}
            className={index % 2 === 0 ? "bg-yellow-50" : "bg-white"} // Alternating row colors
          >
            <td className="py-2 px-4 border-b">{partner.name}</td>
            <td className="py-2 px-4 border-b">{partner.gender}</td>
            <td className="py-2 px-4 border-b">{partner.age_range}</td>
            <td className="py-2 px-4 border-b">{partner.telephone}</td>
            <td className="py-2 px-4 border-b">{partner.insurance}</td>
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
  </div>
)}
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
          <p>Loading...</p>
        )}
      </Modal>
      </>
  );
  
};

export default Dashboard;
