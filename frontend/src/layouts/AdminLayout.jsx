import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
  return (
    <div className='w-full h-screen'>
      <Navbar/>
      <main>

        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;
