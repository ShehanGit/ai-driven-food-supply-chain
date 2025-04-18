// src/components/layout/AppLayout.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useAuth } from '../../contexts/AuthContext';

interface AppLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, requireAuth = true }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Determine if we should show the sidebar (not on home page)
  const isHomePage = location.pathname === '/';
  const showSidebar = !isHomePage;

  const toggleSidebar = () => {
    if (showSidebar) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  // Close sidebar when navigating to home page
  useEffect(() => {
    if (isHomePage) {
      setSidebarOpen(false);
    }
  }, [isHomePage]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <Header toggleSidebar={toggleSidebar} />
      <div className="layout">
        {showSidebar && <Sidebar isOpen={sidebarOpen} />}
        <div className={`main-content ${sidebarOpen && showSidebar ? 'with-sidebar' : ''}`}>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;