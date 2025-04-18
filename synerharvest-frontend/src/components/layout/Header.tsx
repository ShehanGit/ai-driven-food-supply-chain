// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isNotificationOpen) setIsNotificationOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Add scroll effect to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container header-content">
        <div className="header-left">
          <button className="nav-toggle" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <Link to="/" className="logo">
            <img src="/logo.svg" alt="SynerHarvest Logo" />
            <span>SynerHarvest</span>
          </Link>
          
          <nav className="main-nav">
            <Link to="/" className="main-nav-item">Home</Link>
            <Link to="/dashboard" className="main-nav-item">Dashboard</Link>
            <Link to="/products" className="main-nav-item">Products</Link>
            <Link to="/batches" className="main-nav-item">Batches</Link>
            <Link to="/tracking" className="main-nav-item">Tracking</Link>
          </nav>
        </div>
        
        <div className="header-right">
          <div className="user-menu">
            <button className="user-menu-btn" onClick={toggleMenu}>
              <div className="user-avatar">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <span className="user-name">{user?.firstName || 'User'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {isMenuOpen && (
              <div className="user-menu-dropdown">
                <div className="user-menu-header">
                  <p className="user-name">{user?.firstName} {user?.lastName}</p>
                  <p className="user-email">{user?.email}</p>
                  <div className="user-role-badge">{user?.role}</div>
                </div>
                <Link to="/profile" className="user-menu-item" onClick={toggleMenu}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Your Profile
                </Link>
                <Link to="/settings" className="user-menu-item" onClick={toggleMenu}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Settings
                </Link>
                <button className="user-menu-item logout" onClick={() => { logout(); toggleMenu(); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
          
          <div className="notifications">
            <button 
              className="notification-btn" 
              onClick={toggleNotifications}
              aria-label="Notifications"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {isNotificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <button 
                    className="mark-all-read"
                    onClick={() => setUnreadCount(0)}
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="notification-list">
                  <div className="notification-item unread">
                    <div className="notification-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--primary-color)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                    </div>
                    <div className="notification-content">
                      <p className="notification-title">New batch created</p>
                      <p className="notification-text">Batch #APL-20250418-001 was created successfully.</p>
                      <p className="notification-time">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="notification-item unread">
                    <div className="notification-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary-color)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13"></rect>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                      </svg>
                    </div>
                    <div className="notification-content">
                      <p className="notification-title">Batch shipped</p>
                      <p className="notification-text">Batch #ORA-20250417-002 has been shipped.</p>
                      <p className="notification-time">2 hours ago</p>
                    </div>
                  </div>
                  <div className="notification-item unread">
                    <div className="notification-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div className="notification-content">
                      <p className="notification-title">Quality check passed</p>
                      <p className="notification-text">Batch #BAN-20250417-003 passed quality inspection.</p>
                      <p className="notification-time">1 day ago</p>
                    </div>
                  </div>
                </div>
                <div className="notification-footer">
                  <Link to="/notifications" className="view-all">View all notifications</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;