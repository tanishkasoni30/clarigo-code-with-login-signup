import React from 'react';
import { getUser, isLoggedIn } from '../utils/auth';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';

const Dashboard = () => {
  if (!isLoggedIn()) return <Navigate to="/login" replace />;
  const user = getUser();
  if (!user) return <div className="container mt-4">Loading...</div>;
  return user.role === 'Admin' ? (
    <AdminDashboard />
  ) : (
    <div className="container mt-4">
      <UserDashboard />
    </div>
  );
};

export default Dashboard;
