import React from 'react'
import { Navigate } from 'react-router-dom'
import { isLoggedIn, getUser } from '../utils/auth'

const ProtectedRoute = ({ children, roles }) => {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  const user = getUser();
  if (roles && roles.length > 0) {
    if (!user || !roles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  return children;
}

export default ProtectedRoute
