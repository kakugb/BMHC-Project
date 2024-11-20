import React, { useState } from 'react';
import axios from 'axios';

function AddUser() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
   
    const token = localStorage.getItem('token'); 

    axios
      .post(
        'http://localhost:5000/api/users/register',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      )
      .then((response) => {
        setSuccessMessage('User added successfully!');
        setErrorMessage('');
        setFormData({ username: '', email: '', password: '', role: '' });
        
      })
      .catch((error) => {
        setErrorMessage('Error adding user. Please try again.');
        setSuccessMessage('');
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-yellow-200 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">
          Add User
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-black font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-black font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter email"
              required
            />
          </div>

          <div>
            <label className="block text-black font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Enter password"
              required
            />
          </div>

          <div>
            <label className="block text-black font-medium mb-1" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
            >
              <option value="" disabled>
                Select role
              </option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 focus:outline-none"
          >
            Add User
          </button>
        </form>

        {successMessage && (
          <div className="mt-4 text-green-600 text-center">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="mt-4 text-red-600 text-center">{errorMessage}</div>
        )}
      </div>
    </div>
  );
}

export default AddUser;
