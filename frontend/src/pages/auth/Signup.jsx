import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

  
    if (!formData.username || !formData.email || !formData.password || !formData.role) {
      setError("All fields are required.");
      toast.error("All fields are required.");
      return;
    } 

    try {
      // Make API request to register the user
      const response = await axios.post(
        "http://localhost:5000/api/users/register",
        formData,
      );

      
      toast.success('User registered successfully!');
    
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
    
      setError(
        error.response?.data?.message || "Something went wrong. Please try again later."
      );
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="bg-yellow-300 h-screen overflow-hidden flex items-center justify-center">
      <div className="bg-white lg:w-5/12 md:6/12 w-10/12 shadow-3xl">
        <form className="p-12 md:p-24" onSubmit={handleSubmit}>
          <div className="flex items-center text-lg mb-6 md:mb-8">
            <input
              type="text"
              id="username"
              name="username"
              className="bg-gray-200 pl-6 py-2 md:py-4 focus:outline-none w-full"
              placeholder="Enter your username "
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center text-lg mb-6 md:mb-8">
            <input
              type="text"
              id="email"
              name="email"
              className="bg-gray-200 pl-6 py-2 md:py-4 focus:outline-none w-full"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center text-lg mb-6 md:mb-8">
            <input
              type="password"
              id="password"
              name="password"
              className="bg-gray-200 pl-6 py-2 md:py-4 focus:outline-none w-full"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center text-lg mb-6 md:mb-8">
            <select
              id="role"
              name="role"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Role
              </option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-b from-gray-700 to-gray-900 font-medium p-2 md:p-4 text-white uppercase w-full"
          >
            Register
          </button>
        </form>
        <p className="text-md font-semibold text-end pb-4 pr-4">
          Already have an account?
          <Link
            to="/login"
            className="text-blue-600 hover:underline hover:underline-offset-4"
          >
            {" "}
            Login
          </Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
