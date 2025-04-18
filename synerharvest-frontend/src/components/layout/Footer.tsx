// src/components/layout/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-text">
          &copy; {new Date().getFullYear()} SynerHarvest. All rights reserved.
        </div>
        <div className="footer-links">
          <a href="/privacy" className="footer-link">
            Privacy Policy
          </a>
          <a href="/terms" className="footer-link">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;