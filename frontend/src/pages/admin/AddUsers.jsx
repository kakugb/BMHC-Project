import React, { useEffect, useState } from "react";
import axios from "axios";

function AddUsers() {
  const [users, setUsers] = useState([]);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7;

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/users/getAllUser"
      );
      setUsers(response.data.users);
    } catch (error) {
      showNotification("error", "Error fetching users");
    }
  };

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 3000);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Show Edit Modal
  const showEditModal = async (user) => {
    setCurrentUser(user);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/getUser/${user._id}`
      );
      const userDetails = response.data.user;
      setFormData({
        username: userDetails.username,
        email: userDetails.email,
        password: "",
      });
      setIsEditModalVisible(true);
    } catch (error) {
      showNotification("error", "Error fetching user details");
    }
  };

  // Show Add Modal
  const showAddModal = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
    });
    setIsAddModalVisible(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsEditModalVisible(false);
    setIsAddModalVisible(false);
    setCurrentUser(null);
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  // Handle Update User
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      await axios.put(
        `http://localhost:5000/api/users/updateUser/${currentUser._id}`,
        payload
      );
      showNotification("success", "User updated successfully");
      fetchUsers();
      closeModal();
    } catch (error) {
      showNotification("error", "Error updating user");
    }
  };

  // Handle Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", formData);
      showNotification("success", "User added successfully");
      fetchUsers();
      closeModal();
    } catch (error) {
      showNotification("error", "Error adding user");
    }
  };

  // Handle Delete User
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/deleteUser/${id}`);
        showNotification("success", "User deleted successfully");
        fetchUsers();
      } catch (error) {
        showNotification("error", "Error deleting user");
      }
    }
  };

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev === 1 ? prev : prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages ? prev : prev + 1));
  };

  return (
    <div className="p-6 min-h-screen bg-white relative">
      {/* Notification */}
      {notification.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <h1 className="text-center font-extrabold text-5xl text-gray-800 ">Add Users</h1>

      <div className="bg-white p-2 ">
        {/* Add User Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={showAddModal}
            className="bg-blue-500 text-white px-8 font-bold py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto rounded-lg shadow-md shadow-slate-500">
          <table className="w-full mx-auto bg-white">
            <thead className="bg-gray-500 text-white font-semibold">
              <tr>
                <th className="py-4 px-4 border-b text-left">Username</th>
                <th className="py-4 px-4 border-b text-left">Email</th>
                <th className="py-4 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 font-semibold">
                    <td className="py-2 px-4 border-b font-semibold">
                      {user.username}
                    </td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => showEditModal(user)}
                        className="px-6 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="ml-2 px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:shadow-outline-red active:bg-red-600 transition duration-150 ease-in-out"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2 px-4 border-b text-center" colSpan="3">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 mr-2 rounded bg-yellow-500 text-white ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-yellow-400"
            } transition duration-200`}
          >
            Prev
          </button>
          <span className="mx-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-4 py-2 ml-2 rounded bg-yellow-500 text-white ${
              currentPage === totalPages || totalPages === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-yellow-400"
            } transition duration-200`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Add User</h2>
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Update User</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring"
                  placeholder="Leave blank to keep unchanged"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-400"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddUsers;
