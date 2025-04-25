// src/components/batches/EnhancedBatchQRScanner.tsx
import React, { useState, useEffect } from 'react';
import QRCodeScanner from '../../components/qr/QRCodeScanner';
import { useAuth } from '../../contexts/AuthContext';
import batchService from '../../services/batchService';

// Define possible actions based on role
interface ActionOption {
  label: string;
  path: string;
  icon: React.ReactNode;
  primaryAction?: boolean;
  requiredRoles: string[];
  description?: string;
}

const EnhancedBatchQRScanner = () => {
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [scannedBatchCode, setScannedBatchCode] = useState(null);
  const [batchDetails, setBatchDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [manualBatchCode, setManualBatchCode] = useState('');
  const { user } = useAuth();
  
  // Navigation function (instead of useNavigate hook)
  const navigateTo = (path) => {
    window.location.href = path;
  };

  // Role-based action options
  const actionOptions = [
    {
      label: 'View Details',
      path: '/batches/:id',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      ),
      primaryAction: true,
      requiredRoles: ['FARMER', 'DISTRIBUTOR', 'RETAILER', 'ADMIN'],
      description: 'View detailed information about this batch'
    },
    {
      label: 'View Events',
      path: '/batches/:id/events',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      requiredRoles: ['FARMER', 'DISTRIBUTOR', 'RETAILER', 'ADMIN'],
      description: 'View event history for this batch'
    },
    {
      label: 'Update Status',
      path: '/batches/:id/update-status',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      ),
      requiredRoles: ['FARMER', 'DISTRIBUTOR', 'RETAILER', 'ADMIN'],
      description: 'Update the status of this batch'
    },
    {
      label: 'Add Event',
      path: '/batches/:id/add-event',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      ),
      requiredRoles: ['FARMER', 'DISTRIBUTOR', 'RETAILER', 'ADMIN'],
      description: 'Add a new event to this batch'
    },
    {
      label: 'Check In Shipment',
      path: '/batches/:id/update-status?status=DELIVERED',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
        </svg>
      ),
      requiredRoles: ['DISTRIBUTOR', 'RETAILER'],
      description: 'Check in this batch as received'
    },
    {
      label: 'QR Code',
      path: '/batches/:id/qr-code',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
      ),
      requiredRoles: ['FARMER', 'DISTRIBUTOR', 'RETAILER', 'ADMIN'],
      description: 'View or print QR code for this batch'
    },
    {
      label: 'View Journey',
      path: '/tracking/:batchCode',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      requiredRoles: ['FARMER', 'DISTRIBUTOR', 'RETAILER', 'CONSUMER', 'ADMIN'],
      description: 'View the complete journey of this batch'
    },
    {
      label: 'Mark as Sold',
      path: '/batches/:id/update-status?status=SOLD',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 12V8h-4"></path>
          <path d="M4 4v16"></path>
          <path d="M20 16v4h-4"></path>
          <path d="M20 12h-9l-3 3"></path>
        </svg>
      ),
      requiredRoles: ['RETAILER'],
      description: 'Mark this batch as sold to consumer'
    }
  ];

  useEffect(() => {
    if (scannedBatchCode) {
      fetchBatchDetails(scannedBatchCode);
    }
  }, [scannedBatchCode]);

  const fetchBatchDetails = async (batchCode) => {
    setIsLoading(true);
    setError(null);
    try {
      // First try to get the batch by code
      const data = await batchService.getBatchByCode(batchCode);
      setBatchDetails(data);
    } catch (err) {
      console.error('Error fetching batch details:', err);
      setError('Could not find batch with code: ' + batchCode);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanSuccess = (decodedText) => {
    // Expecting the QR code to be in format "https://synerharvest.com/tracking/{batchCode}"
    // or just the batch code itself
    let detectedBatchCode;
    
    if (decodedText.includes('/')) {
      // Extract batch code from URL
      const urlParts = decodedText.split('/');
      detectedBatchCode = urlParts[urlParts.length - 1];
    } else {
      // Use the decoded text directly as batch code
      detectedBatchCode = decodedText;
    }
    
    setScannedBatchCode(detectedBatchCode);
    setIsScannerActive(false);
  };

  const handleScanFailure = (error) => {
    console.warn('QR Scan failed:', error);
    // We don't show errors for failed scans as they happen frequently during scanning
  };

  const handleAction = (action) => {
    if (!batchDetails) return;
    
    let path = action.path;
    
    // Replace placeholders in the path
    if (path.includes(':id') && batchDetails.id) {
      path = path.replace(':id', batchDetails.id.toString());
    }
    
    if (path.includes(':batchCode') && batchDetails.batchCode) {
      path = path.replace(':batchCode', batchDetails.batchCode);
    }
    
    navigateTo(path);
  };

  const resetScanner = () => {
    setScannedBatchCode(null);
    setBatchDetails(null);
    setError(null);
    setIsScannerActive(false);
    setManualBatchCode('');
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualBatchCode.trim()) {
      setScannedBatchCode(manualBatchCode.trim());
    }
  };

  // Filter actions based on user role
  const getAvailableActions = () => {
    if (!user || !user.role) return [];
    
    return actionOptions.filter(action => 
      action.requiredRoles.includes(user.role)
    );
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'badge-secondary';
    
    switch (status.toUpperCase()) {
      case 'CREATED': return 'badge-primary';
      case 'HARVESTED': return 'badge-success';
      case 'IN_STORAGE': return 'badge-secondary';
      case 'IN_TRANSIT': return 'badge-warning';
      case 'DELIVERED': return 'badge-info';
      case 'AT_RETAILER': return 'badge-info';
      case 'SOLD': return 'badge-success';
      case 'EXPIRED': return 'badge-danger';
      case 'RECALLED': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const userRole = user?.role || '';
  const availableActions = getAvailableActions();

  return (
    <div className="qr-scanner-feature">
      <div className="scanner-card card">
        <div className="scanner-card-header">
          <h3>Scan Product QR Code</h3>
          <p>Scan a product QR code to view or manage batch information</p>
        </div>

        <div className="scanner-card-body">
          {!isScannerActive && !scannedBatchCode && (
            <div className="scanner-inactive">
              <div className="scanner-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <button 
                className="btn btn-primary mt-4"
                onClick={() => setIsScannerActive(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Start Scanner
              </button>
              <div className="scanner-divider">
                <span>or</span>
              </div>
              <form className="manual-entry" onSubmit={handleManualSubmit}>
                <div className="input-with-button">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Enter batch code manually"
                    value={manualBatchCode}
                    onChange={(e) => setManualBatchCode(e.target.value)}
                  />
                  <button type="submit" className="btn btn-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          )}

          {isScannerActive && (
            <div className="scanner-active">
              <QRCodeScanner 
                onScanSuccess={handleScanSuccess}
                onScanFailure={handleScanFailure}
                width={300}
                height={300}
              />
              <button 
                className="btn btn-outlined mt-4"
                onClick={() => setIsScannerActive(false)}
              >
                Cancel Scanning
              </button>
            </div>
          )}

          {isLoading && (
            <div className="scanner-loading">
              <div className="spinner"></div>
              <p>Fetching batch details...</p>
            </div>
          )}

          {error && (
            <div className="scanner-error">
              <div className="alert alert-danger">
                <div className="alert-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className="alert-content">{error}</div>
              </div>
              <button 
                className="btn btn-primary mt-4"
                onClick={resetScanner}
              >
                Try Again
              </button>
            </div>
          )}

          {batchDetails && !isLoading && !error && (
            <div className="scanner-results">
              <div className="result-header">
                <div className="result-badge">
                  <span className={`badge ${getStatusBadgeClass(batchDetails.status)}`}>
                    {batchDetails.status?.replace('_', ' ')}
                  </span>
                </div>
                <h4>Batch Found</h4>
                <button 
                  className="btn-reset"
                  onClick={resetScanner}
                  aria-label="Reset"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="result-content">
                <div className="result-item">
                  <div className="result-label">Batch Code</div>
                  <div className="result-value">{batchDetails.batchCode}</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Product</div>
                  <div className="result-value">{batchDetails.productName}</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Quantity</div>
                  <div className="result-value">{batchDetails.quantity}</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Status</div>
                  <div className="result-value">
                    <span className={`badge ${getStatusBadgeClass(batchDetails.status)}`}>
                      {batchDetails.status?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="result-role-tag">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-sm">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>{userRole}</span>
              </div>

              <div className="action-divider">
                <span>Available Actions</span>
              </div>

              <div className="result-actions">
                {availableActions.length > 0 ? (
                  availableActions.map((action, index) => (
                    <button
                      key={index}
                      className={`action-btn ${action.primaryAction ? 'action-btn-primary' : ''}`}
                      onClick={() => handleAction(action)}
                    >
                      <div className="action-icon">{action.icon}</div>
                      <div className="action-content">
                        <div className="action-title">{action.label}</div>
                        {action.description && (
                          <div className="action-description">{action.description}</div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="no-actions">
                    <p>No actions available for your role ({userRole})</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedBatchQRScanner;