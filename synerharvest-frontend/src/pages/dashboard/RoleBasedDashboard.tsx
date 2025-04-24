// src/components/dashboard/RoleBasedDashboard.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import FarmerDashboard from './FarmerDashboard';
import DistributorDashboard from './DistributorDashboard';
import RetailerDashboard from './RetailerDashboard';
import ConsumerDashboard from './ConsumerDashboard';
import AdminDashboard from './AdminDashboard';

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Default to farmer if no role is provided (for development purposes)
  const userRole = user?.role || 'FARMER';

  // Render the appropriate dashboard based on user role
  switch (userRole) {
    case 'FARMER':
      return <FarmerDashboard />;
    case 'DISTRIBUTOR':
      return <DistributorDashboard />;
    case 'RETAILER':
      return <RetailerDashboard />;
    case 'CONSUMER':
      return <ConsumerDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <div>Unknown role: {userRole}</div>;
  }
};

export default RoleBasedDashboard;