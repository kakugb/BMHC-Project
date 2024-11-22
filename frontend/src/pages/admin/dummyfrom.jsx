import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../src/App.css";
import {
  zipCodeOptions,
  physicalServices,
  mentalServices,
  socialServices
} from "../../utils/data.js";
import Modal from "react-modal";
Modal.setAppElement("#root");
const Dashboard = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [formData, setFormData] = useState({
    gender: "",
    age_range: "",
    citizenship_status: "",
    insurance: "",
    zip_code: "",
    physical: "",
    mental: "",
    social_determinants_of_health: "",
    offers_transportation: "",
    emergency_room: ""
  });

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/partners");
        setPartners(response.data); // Store all partners
        setFilteredPartners(response.data); // Initially, show all partners
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPartner(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:5000/api/partners/filter",
        formData
      );
      console.log(response);
      setPartners(response.data);
    } catch (err) {
      console.error(
        "Error fetching filtered partners:",
        err.response ? err.response.data : err.message
      );
      setPartners("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFilteredPartners = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(formData);
        const response = await axios.post(
          "http://localhost:5000/api/partners/filter",
          formData
        );
        console.log(response);
        setPartners(response.data);
      } catch (err) {
        console.error(
          "Error fetching filtered partners:",
          err.response ? err.response.data : err.message
        );
        setPartners([]);
        setError("Failed to fetch partners");
      } finally {
        setLoading(false);
      }
    };

    if (Object.keys(formData).length > 0) {
      fetchFilteredPartners();
    }
  }, [formData]);

  const fetchPartnerDetails = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/partners/${id}`
      );
      console.log(response);
      setSelectedPartner(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching partner details:", error);
    }
  };

  console.log("dfdf", partners);

  return (
    <>
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
            <label className="block font-medium text-black mb-1">
              Age Range
            </label>
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
            <label className="block font-medium text-black mb-1">
              Citizenship Status
            </label>
            <select
              name="citizenship_status"
              value={formData.citizenship_status}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            >
              <option value="">Select Citizenship Status</option>
              <option value="Citizen">Citizen</option>
              <option value="Resident">Resident</option>
              <option value="Non-immigrant (temporary visa)">
                Non-immigrant temporary visa
              </option>
              <option value="undocumented">Undocumented</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-black mb-1">
              Insurance
            </label>
            <select
              name="insurance"
              value={formData.insurance}
              onChange={handleChange}
              className="w-full border border-black p-3 rounded bg-yellow-50 text-black"
            >
              <option value="">Select Insurance</option>
              <option value="Accepts private insurance">
                Accepts Private Insurance
              </option>
              <option value="Accepts Medicare">Accepts Medicare</option>
              <option value="Accepts Medicaid">Accepts Medicaid</option>
              <option value="Accepts MAP">Accepts MAP</option>
              <option value="Accepts Ryan White Program">
                Accepts Ryan White Program
              </option>
              <option value="Accepts patients/clients without insurance">
                Accepts Patients/Clients Without Insurance
              </option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-black mb-1">
              Zip Code
            </label>
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
            <label className="block font-medium text-black mb-1">
              Physical Services
            </label>
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
            <label className="block font-medium text-black mb-1">
              Mental Services
            </label>
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
            <label className="block font-medium text-black mb-1">
              Emergency Room
            </label>
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
            Submit
          </button>
        </form>
      </div>

      {partners.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-black">
            Filtered Partners
          </h3>
          <table className="min-w-full w-1/2 bg-white border border-gray-300 mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left text-black">
                  Name
                </th>
                <th className="py-2 px-4 border-b text-left text-black">
                  Gender
                </th>
                <th className="py-2 px-4 border-b text-left text-black">
                  Age Range
                </th>
                <th className="py-2 px-4 border-b text-left text-black">
                  Phone No
                </th>
                <th className="py-2 px-4 border-b text-left text-black">
                  Insurance
                </th>
                <th className="px-6 py-3 text-black font-bold text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner, index) => (
                <tr
                  key={partner.id}
                  className={index % 2 === 0 ? "bg-yellow-50" : "bg-white"}
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
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Partner Details"
            className="modal-content"
            overlayClassName="modal-overlay"
          >
            <h2 className="text-2xl font-bold">Partner Details</h2>
            {selectedPartner ? (
              <div>
                <h2 className="text-xl font-bold mb-2">Partner Details</h2>
                <p>
                  <strong>Name:</strong> {selectedPartner.name}
                </p>
                <p>
                  <strong>Contact Info:</strong> {selectedPartner.telephone}
                </p>
                <p>
                  <strong>Email:</strong> {selectedPartner.contact}
                </p>
                <p>
                  <strong>Address:</strong> {selectedPartner.address}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedPartner.gender}
                </p>
                <p>
                  <strong>Age Range:</strong> {selectedPartner.age_range}
                </p>
                <p>
                  <strong>CitizenShip:</strong>{" "}
                  {selectedPartner.citizenship_status}
                </p>
                <p>
                  <strong>Insurance:</strong> {selectedPartner.insurance}
                </p>
                <p>
                  <strong>Zip code:</strong> {selectedPartner.zip_code}
                </p>
                <p>
                  <strong>Physical:</strong> {selectedPartner.physical}
                </p>
                <p>
                  <strong>Mental:</strong> {selectedPartner.mental}
                </p>
                <p>
                  <strong>Social Determinants:</strong>{" "}
                  {selectedPartner.social_determinants_of_health}
                </p>
                <p>
                  <strong>Offer Transportation:</strong>{" "}
                  {selectedPartner.offers_transportation}
                </p>
                <p>
                  <strong>Emergency Room:</strong>{" "}
                  {selectedPartner.emergency_room}
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
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </>
  );
};

export default Dashboard;


