import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import AuthLayout from './layouts/AuthLayout';
import Dashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/users/Dashboard';
import UpdatePartner from './pages/admin/UpdatePartner';
import Login from './pages/auth/Login';

import NotFound from './pages/Notfound';
import AddPartner from './pages/admin/AddPartner'
import Partner from './pages/admin/Partner';
import AddUserPartner from './pages/users/AddUserPartner';
import CheckAuth from './components/CheckAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddUsers from './pages/admin/AddUsers';
import Home from './pages/users/Home';
import UpdatePartners from './pages/users/UpdatePartners';
const App = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsLogged(true);
    }
    if (role) {
      setRole(role);
    }
  }, []);

  const dummy = {
    isLoggedIn: isLogged,
    role: role,
  };

  return (
    <>
    <Routes>
      
      <Route path="/" element={
        <CheckAuth isAuthenticated={dummy.isLoggedIn} role={dummy.role}>
          <AuthLayout />
        </CheckAuth>
      }>
        <Route path="/login" element={<Login />} />
       
      </Route>

      
      <Route path="/admin" element={
        <CheckAuth isAuthenticated={dummy.isLoggedIn} role={dummy.role}>
          <AdminLayout />
        </CheckAuth>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="partner" element={<Partner />} />
        <Route path="addPartner" element={<AddPartner />} />
        <Route path="updatePartner/:id" element={<UpdatePartner />} />
        <Route path="add-users" element={<AddUsers />} />
      </Route>

      
      <Route path="/user" element={
        <CheckAuth isAuthenticated={dummy.isLoggedIn} role={dummy.role}>
          <UserLayout />
        </CheckAuth>
      }>
         <Route path="dashboard" element={<Home/>}/>
        <Route path="managepatner" element={<UserDashboard />} />
        <Route path="addUserPartner" element={<AddUserPartner />} />
       
        <Route path="updatePartners/:id" element={<UpdatePartners />} />
      </Route>

    
      <Route path="*" element={<NotFound />} />
    </Routes>
     <ToastContainer />
     </>
    
  );
};

export default App;
