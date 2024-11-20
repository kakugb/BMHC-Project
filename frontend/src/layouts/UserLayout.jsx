import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <div>
      <Navbar role="user" />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
