import React, { useState } from "react";
import {
  zipCodeOptions,
  physicalServices,
  mentalServices,
  socialServices
} from "../../utils/data.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function AddPartner() {
  const navigate = useNavigate();
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
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/partners/create",
        formData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      toast.success("Partner Add successfully!");

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 2000);
    } catch (error) {
      console.error(error);

      toast.error("Error create partner!");
    }
  };

  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const [isAgeRangeOpen, setIsAgeRangeOpen] = useState(false);
  const [isCitizenshipOpen, setIsCitizenshipOpen] = useState(false);
  const [isInsuranceOpen, setIsInsuranceOpen] = useState(false);
  const [isPhysicalOpen, setIsPhysicalOpen] = useState(false);
  const [isMentalOpen, setIsMentalOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const toggleDropdown = (field) => {
    if (field === "gender") {
      setIsGenderOpen((prev) => !prev);
    } else if (field === "age_range") {
      setIsAgeRangeOpen((prev) => !prev);
    } else if (field === "citizenship_status") {
      setIsCitizenshipOpen((prev) => !prev);
    } else if (field === "insurance") {
      setIsInsuranceOpen((prev) => !prev);
    } else if (field === "physical") {
      setIsPhysicalOpen((prev) => !prev);
    } else if (field === "mental") {
      setIsMentalOpen((prev) => !prev);
    } else if (field === "social_determinants_of_health") {
      setIsSocialOpen((prev) => !prev);
    }
  };

  const handleCheckboxChange = (field, event) => {
    const { value, checked } = event.target;
    setFormData((prevState) => {
      const updatedField = prevState[field];
      if (checked) {
        return { ...prevState, [field]: [...updatedField, value] };
      } else {
        return {
          ...prevState,
          [field]: updatedField.filter((item) => item !== value)
        };
      }
    });
  };

  return (
    <div className="w-full mt-6 mx-auto ">
      <div className="w-11/12 mx-auto  pb-2 px-4 rounded  border-gray-500 shadow-xl shadow-gray-600 bg-gray-200 ">
        <h1 className="text-center font-bold text-3xl text-black">
          Add Partner
        </h1>
        <div class="mt-8 grid lg:grid-cols-3 gap-4">
          <div className="text-xl font-bold text-center">
            <h1>Personal Information</h1>
          </div>
          <div className="text-xl font-bold text-center">
            <h1>Service Provided</h1>
          </div>
          <div className="text-xl font-bold text-center">
            <h1>Patient Information</h1>
          </div>
        </div>
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
              <label
                htmlFor="physical"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Physical
              </label>
              <div className="relative">
                <div
                  className="bg-white border rounded py-1 px-4 w-full cursor-pointer"
                  onClick={() => toggleDropdown("physical")}
                >
                  {formData.physical.length > 0
                    ? formData.physical.join(", ")
                    : "Select Physical"}
                </div>
                {isPhysicalOpen && (
                  <div className="absolute bg-white border border-gray-400 rounded mt-1 w-full z-10">
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Physical Care"
                        onChange={(e) => handleCheckboxChange("physical", e)}
                        checked={formData.physical.includes("Physical Care")}
                        className="mr-2"
                      />
                      Physical Care
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Health Screenings"
                        onChange={(e) => handleCheckboxChange("physical", e)}
                        checked={formData.physical.includes(
                          "Health Screenings"
                        )}
                        className="mr-2"
                      />
                      Health Screenings
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="MAP Enrollment"
                        onChange={(e) => handleCheckboxChange("physical", e)}
                        checked={formData.physical.includes("MAP Enrollment")}
                        className="mr-2"
                      />
                      MAP Enrollment
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Public Funded Health Insurance"
                        onChange={(e) => handleCheckboxChange("physical", e)}
                        checked={formData.physical.includes(
                          "Public Funded Health Insurance"
                        )}
                        className="mr-2"
                      />
                      Public Funded Health Insurance
                    </label>
                  </div>
                )}
              </div>
              {/* <p className="mt-1">
                Selected Physical: {formData.physical.join(", ")}
              </p> */}
            </div>
            <div>
              <label
                htmlFor="age_range"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Age Range
              </label>
              <div className="relative">
                <div
                  className="bg-white border rounded py-1 px-4 w-full cursor-pointer"
                  onClick={() => toggleDropdown("age_range")}
                >
                  {formData.age_range.length > 0
                    ? formData.age_range.join(", ")
                    : "Select Age Range"}
                </div>
                {isAgeRangeOpen && (
                  <div className="absolute bg-white border border-gray-400 rounded mt-1 w-full z-10">
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Minors (under 18)"
                        onChange={(e) => handleCheckboxChange("age_range", e)}
                        checked={formData.age_range.includes(
                          "Minors (under 18)"
                        )}
                        className="mr-2"
                      />
                      Minors (under 18)
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Adults (18-64)"
                        onChange={(e) => handleCheckboxChange("age_range", e)}
                        checked={formData.age_range.includes("Adults (18-64)")}
                        className="mr-2"
                      />
                      Adults (18-64)
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Seniors (65 and over)"
                        onChange={(e) => handleCheckboxChange("age_range", e)}
                        checked={formData.age_range.includes(
                          "Seniors (65 and over)"
                        )}
                        className="mr-2"
                      />
                      Seniors (65 and over)
                    </label>
                  </div>
                )}
              </div>
              {/* <p className="mt-1">
                Selected Age Range(s): {formData.age_range.join(", ")}
              </p> */}
            </div>
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
              <label
                htmlFor="mental"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Mental
              </label>
              <div className="relative">
                <div
                  className="bg-white border rounded py-1 px-4 w-full cursor-pointer"
                  onClick={() => toggleDropdown("mental")}
                >
                  {formData.mental.length > 0
                    ? formData.mental.join(", ")
                    : "Select Mental"}
                </div>
                {isMentalOpen && (
                  <div className="absolute bg-white border border-gray-400 rounded mt-1 w-full z-10">
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Counseling"
                        onChange={(e) => handleCheckboxChange("mental", e)}
                        checked={formData.mental.includes("Counseling")}
                        className="mr-2"
                      />
                      Counseling
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Nutrition Education"
                        onChange={(e) => handleCheckboxChange("mental", e)}
                        checked={formData.mental.includes(
                          "Nutrition Education"
                        )}
                        className="mr-2"
                      />
                      Nutrition Education
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Psychiatric Assessments & Treatment"
                        onChange={(e) => handleCheckboxChange("mental", e)}
                        checked={formData.mental.includes(
                          "Psychiatric Assessments & Treatment"
                        )}
                        className="mr-2"
                      />
                      Psychiatric Assessments & Treatment
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Trauma & Post-Traumatic Stress"
                        onChange={(e) => handleCheckboxChange("mental", e)}
                        checked={formData.mental.includes(
                          "Trauma & Post-Traumatic Stress"
                        )}
                        className="mr-2"
                      />
                      Trauma & Post-Traumatic Stress
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Grief Assessments & Processing"
                        onChange={(e) => handleCheckboxChange("mental", e)}
                        checked={formData.mental.includes(
                          "Grief Assessments & Processing"
                        )}
                        className="mr-2"
                      />
                      Grief Assessments & Processing
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Therapeutic Services for Severe Mental Illnesses"
                        onChange={(e) => handleCheckboxChange("mental", e)}
                        checked={formData.mental.includes(
                          "Therapeutic Services for Severe Mental Illnesses"
                        )}
                        className="mr-2"
                      />
                      Therapeutic Services for Severe Mental Illnesses
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Counseling & Life Coaching Services"
                        onChange={(e) => handleCheckboxChange("mental", e)}
                        checked={formData.mental.includes(
                          "Counseling & Life Coaching Services"
                        )}
                        className="mr-2"
                      />
                      Counseling & Life Coaching Services
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Medication Management"
                        onChange={(e) => handleCheckboxChange("mental", e)}
                        checked={formData.mental.includes(
                          "Medication Management"
                        )}
                        className="mr-2"
                      />
                      Medication Management
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Substance Use Disorders"
                        onChange={(e) => handleCheckboxChange("mental", e)}
                        checked={formData.mental.includes(
                          "Substance Use Disorders"
                        )}
                        className="mr-2"
                      />
                      Substance Use Disorders
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Coping Skills Improvement"
                        onChange={(e) => handleCheckboxChange("mental", e)}
                        checked={formData.mental.includes(
                          "Coping Skills Improvement"
                        )}
                        className="mr-2"
                      />
                      Coping Skills Improvement
                    </label>
                  </div>
                )}
              </div>
              {/* <p className="mt-2">
                Selected Mental: {formData.mental.join(", ")}
              </p> */}
            </div>
            <div>
              <label
                htmlFor="citizenship_status"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Citizenship Status
              </label>
              <div className="relative">
                <div
                  className="bg-white border rounded py-1 px-4 w-full cursor-pointer"
                  onClick={() => toggleDropdown("citizenship_status")}
                >
                  {formData.citizenship_status.length > 0
                    ? formData.citizenship_status.join(", ")
                    : "Select Citizenship Status"}
                </div>
                {isCitizenshipOpen && (
                  <div className="absolute bg-white border border-gray-400 rounded mt-1 w-full z-10">
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Citizen"
                        onChange={(e) =>
                          handleCheckboxChange("citizenship_status", e)
                        }
                        checked={formData.citizenship_status.includes(
                          "Citizen"
                        )}
                        className="mr-2"
                      />
                      Citizen
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Resident"
                        onChange={(e) =>
                          handleCheckboxChange("citizenship_status", e)
                        }
                        checked={formData.citizenship_status.includes(
                          "Resident"
                        )}
                        className="mr-2"
                      />
                      Resident
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Non-immigrant (temporary visa)"
                        onChange={(e) =>
                          handleCheckboxChange("citizenship_status", e)
                        }
                        checked={formData.citizenship_status.includes(
                          "Non-immigrant (temporary visa)"
                        )}
                        className="mr-2"
                      />
                      Non-immigrant (temporary visa)
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Undocumented"
                        onChange={(e) =>
                          handleCheckboxChange("citizenship_status", e)
                        }
                        checked={formData.citizenship_status.includes(
                          "Undocumented"
                        )}
                        className="mr-2"
                      />
                      Undocumented
                    </label>
                  </div>
                )}
              </div>
              {/* <p className="mt-2">
                Selected Citizenship Status:{" "}
                {formData.citizenship_status.join(", ")}
              </p> */}
            </div>
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
              <label
                htmlFor="social_determinants_of_health"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Social Determinants of Health
              </label>
              <div className="relative">
                <div
                  className="bg-white border rounded py-1 px-4 w-full cursor-pointer"
                  onClick={() =>
                    toggleDropdown("social_determinants_of_health")
                  }
                >
                  {formData.social_determinants_of_health.length > 0
                    ? formData.social_determinants_of_health.join(", ")
                    : "Select Social Determinants of Health"}
                </div>
                {isSocialOpen && (
                  <div className="absolute bg-white border border-gray-400 rounded mt-1 w-full z-10">
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Food"
                        onChange={(e) =>
                          handleCheckboxChange(
                            "social_determinants_of_health",
                            e
                          )
                        }
                        checked={formData.social_determinants_of_health.includes(
                          "Food"
                        )}
                        className="mr-2"
                      />
                      Food
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Diversion"
                        onChange={(e) =>
                          handleCheckboxChange(
                            "social_determinants_of_health",
                            e
                          )
                        }
                        checked={formData.social_determinants_of_health.includes(
                          "Diversion"
                        )}
                        className="mr-2"
                      />
                      Diversion
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Transportation"
                        onChange={(e) =>
                          handleCheckboxChange(
                            "social_determinants_of_health",
                            e
                          )
                        }
                        checked={formData.social_determinants_of_health.includes(
                          "Transportation"
                        )}
                        className="mr-2"
                      />
                      Transportation
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Workforce (Career Skills)"
                        onChange={(e) =>
                          handleCheckboxChange(
                            "social_determinants_of_health",
                            e
                          )
                        }
                        checked={formData.social_determinants_of_health.includes(
                          "Workforce (Career Skills)"
                        )}
                        className="mr-2"
                      />
                      Workforce (Career Skills)
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Training"
                        onChange={(e) =>
                          handleCheckboxChange(
                            "social_determinants_of_health",
                            e
                          )
                        }
                        checked={formData.social_determinants_of_health.includes(
                          "Training"
                        )}
                        className="mr-2"
                      />
                      Training
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="PSH Supportive Services"
                        onChange={(e) =>
                          handleCheckboxChange(
                            "social_determinants_of_health",
                            e
                          )
                        }
                        checked={formData.social_determinants_of_health.includes(
                          "PSH Supportive Services"
                        )}
                        className="mr-2"
                      />
                      PSH Supportive Services
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Respite Medical Care Support"
                        onChange={(e) =>
                          handleCheckboxChange(
                            "social_determinants_of_health",
                            e
                          )
                        }
                        checked={formData.social_determinants_of_health.includes(
                          "Respite Medical Care Support"
                        )}
                        className="mr-2"
                      />
                      Respite Medical Care Support
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Reentry Support Services"
                        onChange={(e) =>
                          handleCheckboxChange(
                            "social_determinants_of_health",
                            e
                          )
                        }
                        checked={formData.social_determinants_of_health.includes(
                          "Reentry Support Services"
                        )}
                        className="mr-2"
                      />
                      Reentry Support Services
                    </label>
                  </div>
                )}
              </div>
              {/* <p className="mt-2">
                Selected Social Determinants of Health:{" "}
                {formData.social_determinants_of_health.join(", ")}
              </p> */}
            </div>
            <div>
              <label
                htmlFor="insurance"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Insurance
              </label>
              <div className="relative">
                <div
                  className="bg-white border rounded py-1 px-4 w-full cursor-pointer"
                  onClick={() => toggleDropdown("insurance")}
                >
                  {formData.insurance.length > 0
                    ? formData.insurance.join(", ")
                    : "Select Insurance"}
                </div>
                {isInsuranceOpen && (
                  <div className="absolute bg-white border border-gray-400 rounded mt-1 w-full z-10">
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Accepts private insurance"
                        onChange={(e) => handleCheckboxChange("insurance", e)}
                        checked={formData.insurance.includes(
                          "Accepts private insurance"
                        )}
                        className="mr-2"
                      />
                      Accepts private insurance
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Accepts Medicare"
                        onChange={(e) => handleCheckboxChange("insurance", e)}
                        checked={formData.insurance.includes(
                          "Accepts Medicare"
                        )}
                        className="mr-2"
                      />
                      Accepts Medicare
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Accepts Medicaid"
                        onChange={(e) => handleCheckboxChange("insurance", e)}
                        checked={formData.insurance.includes(
                          "Accepts Medicaid"
                        )}
                        className="mr-2"
                      />
                      Accepts Medicaid
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Accepts MAP"
                        onChange={(e) => handleCheckboxChange("insurance", e)}
                        checked={formData.insurance.includes("Accepts MAP")}
                        className="mr-2"
                      />
                      Accepts MAP
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Accepts Ryan White Program"
                        onChange={(e) => handleCheckboxChange("insurance", e)}
                        checked={formData.insurance.includes(
                          "Accepts Ryan White Program"
                        )}
                        className="mr-2"
                      />
                      Accepts Ryan White Program
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Accepts patients/clients without insurance"
                        onChange={(e) => handleCheckboxChange("insurance", e)}
                        checked={formData.insurance.includes(
                          "Accepts patients/clients without insurance"
                        )}
                        className="mr-2"
                      />
                      Accepts patients/clients without insurance
                    </label>
                  </div>
                )}
              </div>
              {/* <p className="mt-2">
                Selected Insurance: {formData.insurance.join(", ")}
              </p> */}
            </div>
            <div>
              {" "}
              <label class="text-md text-gray-700 block mb-1 font-medium">
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
              <p>Selected In: {formData.offers_transportation}</p>
            </div>
            <div>
              <label
                htmlFor="gender"
                className="text-md text-gray-700 block mb-1 font-medium"
              >
                Gender
              </label>
              <div className="relative">
                <div
                  className="bg-white border rounded py-2 px-4 w-full cursor-pointer"
                  onClick={() => toggleDropdown("gender")}
                >
                  {formData.gender.length > 0
                    ? formData.gender.join(", ")
                    : "Select Gender"}
                </div>
                {isGenderOpen && (
                  <div className="absolute bg-white border border-gray-400 rounded mt-1 w-full z-10">
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Male"
                        onChange={(e) => handleCheckboxChange("gender", e)}
                        checked={formData.gender.includes("Male")}
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Female"
                        onChange={(e) => handleCheckboxChange("gender", e)}
                        checked={formData.gender.includes("Female")}
                        className="mr-2"
                      />
                      Female
                    </label>
                    <label className="block px-4 py-2 cursor-pointer">
                      <input
                        type="checkbox"
                        value="Non-binary"
                        onChange={(e) => handleCheckboxChange("gender", e)}
                        checked={formData.gender.includes("Non-binary")}
                        className="mr-2"
                      />
                      Non-binary
                    </label>
                  </div>
                )}
              </div>
              {/* <p className="mt-2">
                Selected Gender(s): {formData.gender.join(", ")}
              </p> */}
            </div>
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
            {/* Emergency Room Dropdown */}
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
              {/* <p>Selected In: {formData.emergency_room}</p> */}
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
