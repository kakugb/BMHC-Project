import React, { useState } from "react";
import {
  zipCodeOptions,
  physicalServices,
  mentalServices,
  socialServices
} from "../../utils/data.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios"
import { useNavigate } from "react-router-dom";
function AddPartner() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: [],
    telephone: [],
    email: [],
    address: [],
    gender: [],
    age_range: [],
    citizenship_status: [],
    insurance: [],
    zip_code: [],
    physical: [],
    mental: [],
    social_determinants_of_health: [],
    offers_transportation: [],
    emergency_room: []
  });

  const handleChange = (event) => {
    const { value, name } = event.target;

    setFormData((prevformData) => {
      const currentOptions = prevformData[name] || [];

      if (currentOptions.includes(value)) {
        return {
          ...prevformData,
          [name]: currentOptions.filter((option) => option !== value)
        };
      } else {
        return {
          ...prevformData,
          [name]: [...currentOptions, value]
        };
      }
    });
  };
  const handleChange2 = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
      console.log(formData)
    try {
    
      const response = await axios.post(
        "http://localhost:5000/api/partners/create",
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        } );
      toast.success("Partner Add successfully!");

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);
      
      toast.error("Error create partner!");
    } 
  };

  return (
    <div className="w-full mt-6 mx-auto ">
      <div className="w-11/12 mx-auto  pb-2 px-4 rounded  border-gray-500 shadow-xl shadow-gray-600 bg-gray-200 ">
        <h1 className="text-center font-bold text-3xl text-black font-mono">
          Add Partner
        </h1>
        <form onSubmit={handleSubmit}>
          {" "}
          <div class="mt-8 grid lg:grid-cols-3 gap-4">
            {" "}
            <div>
              {" "}
              <label
                for="name"
                class="text-md text-gray-700 block mb-1 font-medium"
              >
                Name
              </label>{" "}
              <input
                type="text"
                name="name"
                value={formData.name}
              onChange={handleChange2}

                class="bg-white border  rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="Enter your name"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label
                for="email"
                class="text-md text-gray-700 block mb-1 font-medium"
              >
                Email Adress
              </label>{" "}
              <input
                type="text"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange2}
  
                class="bg-white border  rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="yourmail@gmail.com"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label
                class="text-md text-gray-700 block mb-1 font-medium"
              >
                Contact Number
              </label>{" "}
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange2}  
                class="bg-white border  rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="Enter phone Numeber"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label
                for="job"
                class="text-md text-gray-700 block mb-1 font-medium"
              >
                address
              </label>{" "}
              <input
                type="text"
                name="address"
                value={formData.address}
              onChange={handleChange2}
                class="bg-white border  rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="Enter your Address"
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label
                for="job"
                class="text-md text-gray-700 block mb-1 font-medium"
              >
                Zip Code
              </label>{" "}
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
              onChange={handleChange2}
                class="bg-white border  rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                placeholder="(Enter Zip code in Number)"
              />{" "}
            </div>{" "}
            <div>
              <label
               
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
              </select>
              <p>Selected Gender: {formData.gender.join(", ")}</p>
            </div>
            <div>
              <label
                htmlFor="job"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Age Range
              </label>
              <select
                name="age_range"
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                onChange={handleChange}
              >
                <option value="">Select Age Range</option>
                <option value="Minors (under 18)">Minors (under 18)</option>
                <option value="Adults (18-64)">Adults (18-64)</option>
                <option value="Seniors (65 and over)">
                  Seniors (65 and over)
                </option>
              </select>
              <p>Selected Age_Range: {formData.age_range.join(", ")}</p>
            </div>
            <div>
              <label className="text-md text-gray-700 block mb-1 font-medium">
                Citizenship Status
              </label>
              <select
                name="citizenship_status"
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                onChange={handleChange}
              >
                <option value="">Select Your Citizenship</option>
                <option value="Citizen">Citizen</option>
                <option value="Resident">Resident</option>
                <option value="Non-immigrant (temporary visa)">
                  Non-immigrant (temporary visa)
                </option>
                <option value="Undocumented">Undocumented</option>
              </select>
              <p>
                Selected Citizenship :{" "}
                {formData.citizenship_status.join(", ")}
              </p>
            </div>
            <div>
              <label
                htmlFor="job"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                insurance
              </label>
              <select
                name="insurance"
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                onChange={handleChange}
              >
                <option value="">Select Insurance</option>
                <option value="Accepts private insurance">
                  Accepts private insurance
                </option>
                <option value="Accepts Medicare">Accepts Medicare</option>
                <option value="Accepts Medicaid">Accepts Medicaid</option>
                <option value="Accepts MAP">Accepts MAP</option>
                <option value="Accepts Ryan White Program">
                  Accepts Ryan White Program
                </option>
                <option value="Accepts patients/clients without insurance">
                  Accepts patients/clients without insurance
                </option>
              </select>
              <p>Selected Insurance: {formData.insurance.join(", ")}</p>
            </div>
           
            <div>
              <label
                htmlFor="job"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Physical
              </label>
              <select
                name="physical"
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                onChange={handleChange}
              >
                <option value="">Select physical</option>
                <option value="Physical Care">Physical Care</option>
                <option value="Health Screenings">Health Screenings</option>
                <option value="MAP Enrollment">MAP Enrollment</option>
                <option value="Public Funded Health Insurance">
                  Public Funded Health Insurance
                </option>
              </select>
              <p>Selected In: {formData.physical.join(", ")}</p>
            </div>
            <div>
              <label
                htmlFor="job"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Mental
              </label>
              <select
                name="mental"
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                onChange={handleChange}
              >
                <option value="">Select Mental</option>
                <option value="Counseling">Counseling</option>
                <option value="Nutrition Education">Nutrition Education</option>
                <option value="Psychiatric Assessments & Treatment">
                  Psychiatric Assessments & Treatment
                </option>
                <option value="Trauma & Post-Traumatic Stress">
                  Trauma & Post-Traumatic Stress
                </option>
                <option value="Grief Assessments & Processing">
                  Grief Assessments & Processing
                </option>
                <option value="Therapeutic Services for Severe Mental Illnesses">
                  Therapeutic Services for Severe Mental Illnesses
                </option>
                <option value="Counseling & Life Coaching Services">
                  Counseling & Life Coaching Services
                </option>
                <option value="Medication Management">
                  Medication Management
                </option>
                <option value="Substance Use Disorders">
                  Substance Use Disorders
                </option>
                <option value="Coping Skills Improvement">
                  Coping Skills Improvement
                </option>
              </select>
              <p>Selected Mental: {formData.mental.join(", ")}</p>
            </div>
            <div>
              <label className="text-md text-gray-700 block mb-1 font-medium">
                Social Determinants of Health
              </label>
              <select
                name="social_determinants_of_health"
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                onChange={handleChange}
              >
                <option value="">Select Social Determinants of Health</option>
                <option value="Food">Food</option>
                <option value="Diversion">Diversion</option>
                <option value="Transportation">Transportation</option>
                <option value="Workforce (Career Skills)">
                  Workforce (Career Skills)
                </option>
                <option value="Training">Training</option>
                <option value="PSH Supportive Services">
                  PSH Supportive Services
                </option>
                <option value="Respite Medical Care Support">
                  Respite Medical Care Support
                </option>
                <option value="Reentry Support Services">
                  Reentry Support Services
                </option>
              </select>
              <p>Selected In: {formData.social_determinants_of_health.join(", ")}</p>
            </div>
            <div>
              <label className="text-md text-gray-700 block mb-1 font-medium">
                Offer Transportation
              </label>
              <select
                name="offers_transportation"
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                onChange={handleChange2}
              >
                <option value="">Select offer transportation</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <p>
                Selected In: {formData.offers_transportation}
              </p>
            </div>
            <div>
              <label className="text-md text-gray-700 block mb-1 font-medium">
                Emergency Room
              </label>
              <select
                name="emergency_room"
                className="bg-white border rounded py-1 px-3 border-gray-400 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                onChange={handleChange2}
              >
                <option value="">Select Emergency Room</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <p>Selected In: {formData.emergency_room}</p>
            </div>
          </div>{" "}
          <div class="w-full flex justify-center space-x-4 mt-6 mx-auto py-2">
            {" "}
            <button
              type="submit"
              class="w-md py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
            >
              Add Partner
            </button>{" "}
          </div>{" "}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}







export default AddPartner;
