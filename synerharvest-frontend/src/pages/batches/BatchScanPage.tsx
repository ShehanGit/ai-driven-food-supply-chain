// src/pages/batches/BatchScanPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import EnhancedBatchQRScanner from '../../components/batches/EnhancedBatchQRScanner';
import { useAuth } from '../../contexts/AuthContext';

const BatchScanPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="batch-scan-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Scan Batch QR Code</h1>
            <p className="page-subtitle">
              Scan a QR code to view or manage batch information
            </p>
          </div>
          <div className="page-actions">
            <Link to="/batches" className="btn btn-outlined">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Batches
            </Link>
          </div>
        </div>
      </div>

      <div className="scan-page-content">
        <EnhancedBatchQRScanner />
        
        <div className="scan-instructions card">
          <h3>How to use the QR Scanner</h3>
          
          <div className="instruction-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Start the Scanner</h4>
              <p>Click the "Start Scanner" button and allow camera access when prompted.</p>
            </div>
          </div>
          
          <div className="instruction-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Position the QR Code</h4>
              <p>Hold the QR code steady in the scanner frame until it's detected.</p>
            </div>
          </div>
          
          <div className="instruction-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Select an Action</h4>
              <p>Once detected, you'll see batch details and available actions based on your role.</p>
            </div>
          </div>
          
          {user?.role === 'DISTRIBUTOR' && (
            <div className="role-specific-info distributor">
              <h4>Distributor Actions:</h4>
              <ul>
                <li><strong>View Details:</strong> See comprehensive batch information</li>
                <li><strong>Check In Shipment:</strong> Mark batch as received at your facility</li>
                <li><strong>Update Status:</strong> Change batch status to in transit or delivered</li>
                <li><strong>Add Event:</strong> Record temperature, humidity, or other conditions</li>
              </ul>
            </div>
          )}
          
          {user?.role === 'RETAILER' && (
            <div className="role-specific-info retailer">
              <h4>Retailer Actions:</h4>
              <ul>
                <li><strong>Check In Shipment:</strong> Record receipt of goods</li>
                <li><strong>Mark as Sold:</strong> Update batch status when sold to consumer</li>
                <li><strong>View Events:</strong> See complete history and conditions</li>
                <li><strong>Add Event:</strong> Record quality checks or other information</li>
              </ul>
            </div>
          )}
          
          {user?.role === 'FARMER' && (
            <div className="role-specific-info farmer">
              <h4>Farmer Actions:</h4>
              <ul>
                <li><strong>Update Status:</strong> Record harvesting or storage</li>
                <li><strong>Add Event:</strong> Record environmental conditions</li>
                <li><strong>QR Code:</strong> Print or share QR codes for your batches</li>
                <li><strong>View Journey:</strong> See your product's complete supply chain journey</li>
              </ul>
            </div>
          )}
          
          {user?.role === 'ADMIN' && (
            <div className="role-specific-info admin">
              <h4>Admin Actions:</h4>
              <ul>
                <li>All actions are available to admins across the system</li>
                <li>You can view and modify any batch information</li>
                <li>Track and update the status of any batch</li>
                <li>Add events and manage the entire supply chain flow</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchScanPage;