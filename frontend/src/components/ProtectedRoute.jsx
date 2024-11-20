import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = (isLogged, roles, children ) => {
  console.log(roles)

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }


  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/not-authorized" />; 
  }

 
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
