
import logo from '../assests/BMHC-R-1.png'


import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaCog } from "react-icons/fa"; // Import additional icons as needed

const Navbar = ({ role, user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const roles = localStorage.getItem("role");
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    sessionStorage.removeItem("user");
    window.location.reload();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        event.target.getAttribute('data-collapse-toggle') !== 'mob-menu-button'
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gray-300 shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/admin/dashboard">
              <img src={logo} className="h-16 w-36" alt="BMHC" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center">
            <ul className="flex space-x-4">
              {roles === "admin" && (
                <>
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin/partner"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                    >
                      Manage Partner
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/addPartner"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                    >
                      Add Partner
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/add-users"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                    >
                      Manage User
                    </Link>
                  </li>
                </>
              )}

              {roles === "user" && (
                <>
                
                <li>
                    <Link
                      to="/user/dashboard"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                    >
                       Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/user/managepatner"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                    >
                      Manage Partner
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/user/addUserPartner"
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                    >
                      Add Partner
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* User Profile Dropdown */}
          <div className="ml-3 top-4 relative hidden md:block" ref={dropdownRef}>
            <div>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                type="button"
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-300"
                id="user-menu-button"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <img
                  src={
                    user?.profilePicture ||
                    "https://tse4.mm.bing.net/th?id=OIP.awAiMS1BCAQ2xS2lcdXGlwHaHH&pid=Api&P=0&h=220"
                  }
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2 text-gray-800 font-medium">
                  {roles.charAt(0).toUpperCase() + roles.slice(1)}
                </span>
                <svg
                  className={`ml-1 h-5 w-5 transition-transform transform ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Dropdown Panel */}
            {isDropdownOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 transition ease-out duration-200 transform opacity-100 scale-100"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <div className="py-1" role="none">
                  {/* Profile Link (Optional) */}
                  {/* <Link
                    to="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-yellow-500 transition-colors duration-300"
                    role="menuitem"
                  >
                    <FaUserCircle className="mr-3 h-5 w-5 text-gray-400" />
                    Profile
                  </Link> */}
                  {/* Settings Link (Optional) */}
                  {/* <Link
                    to="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-yellow-500 transition-colors duration-300"
                    role="menuitem"
                  >
                    <FaCog className="mr-3 h-5 w-5 text-gray-400" />
                    Settings
                  </Link> */}
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-left text-sm text-gray-700 hover:text-yellow-500 transition-colors duration-300"
                    role="menuitem"
                  >
                    <FaSignOutAlt className="mr-3 h-5 w-5 text-gray-400" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              data-collapse-toggle="mob-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-300"
              aria-controls="mob-menu"
              aria-expanded={isMobileMenuOpen}
              id="mob-menu-button"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              {!isMobileMenuOpen && (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
              {/* Icon when menu is open */}
              {isMobileMenuOpen && (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mob-menu" ref={mobileMenuRef}>
          <ul className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {roles === "admin" && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/partner"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                  >
                    Manage Partner
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/addPartner"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                  >
                    Add Partner
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/add-users"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                  >
                    Manage User
                  </Link>
                </li>
              </>
            )}

            {roles === "user" && (
              <>
                <li>
                  <Link
                    to="/user/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                  >
                     Home
                  </Link>
                </li>
                
                <li>
                  <Link
                    to="/user/managepatner"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                  >
                    Manage Partner
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user/addUserPartner"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
                  >
                     Add Partner
                  </Link>
                </li>
                
              </>
            )}

            {/* User Profile Dropdown in Mobile Menu */}
            <li className="border-t border-gray-200 pt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-yellow-500 transition-colors duration-300"
              >
                <FaSignOutAlt className="mr-3 h-5 w-5 text-gray-400" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;