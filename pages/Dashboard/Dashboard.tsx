
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UserPanel from './UserPanel';
import AdminPanel from './AdminPanel';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-black">
      {user.role === 'admin' ? <AdminPanel /> : <UserPanel />}
    </div>
  );
};

export default Dashboard;
