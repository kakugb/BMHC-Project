import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, role, children }) {
  const location = useLocation();


  if (!isAuthenticated && !location.pathname.includes("login") && !location.pathname.includes("register")) {
    return <Navigate to="/login" />;
  }


  if (isAuthenticated && role === "admin" && !location.pathname.startsWith("/admin")) {
    return <Navigate to="/admin/dashboard" />;
  }

  if (isAuthenticated && role === "user" && !location.pathname.startsWith("/user")) {
    return <Navigate to="/user/dashboard" />;
  }

  return <>{children}</>;
}

export default CheckAuth;


