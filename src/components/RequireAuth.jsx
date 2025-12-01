import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('authToken');
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/auth/LogIn" replace state={{ from: location.pathname, message: 'Bạn cần đăng nhập để xem trang này' }} />;
  }

  return children;
};

export default RequireAuth;
