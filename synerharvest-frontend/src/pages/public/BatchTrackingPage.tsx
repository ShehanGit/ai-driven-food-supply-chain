// src/pages/public/BatchTrackingPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import QRCodeScanner from '../../components/qr/QRCodeScanner';
import RoleBasedActionPanel from '../../components/batch/RoleBasedActionPanel';
import trackingService from '../../services/trackingService';
import { useAuth } from '../../contexts/AuthContext';
import logoImage from '../../assets/images/herosection/logo2.png';


interface JourneyData {
  batch: {
    id: number;
    batchCode: string;
    productName: string;
    quantity: number;
    productionDate: string;
    expirationDate: string;
    status: string;
  };
  product: {
    id: number;
    name: string;
    description: string;
    organic: boolean;
    productType: string;
    certification: string;
    cultivationMethod: string;
  };
  events: Array<{
    id: number;
    eventType: string;
    timestamp: string;
    location: string;
    temperature?: number;
    humidity?: number;
    notes?: string;
  }>;
  metrics?: {
    daysSinceHarvest?: number;
    hoursInTransit?: number;
    qualityChecks?: number;
    estimatedCarbonFootprint?: number;
  };
}

const BatchTrackingPage: React.FC = () => {
  const { batchCode } = useParams<{ batchCode?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [journeyData, setJourneyData] = useState<JourneyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(!batchCode);

  const scanCode = searchParams.get('scan') === 'true' || !batchCode;

  useEffect(() => {
    if (batchCode) {
      fetchBatchJourney(batchCode);
    }
  }, [batchCode]);

  const fetchBatchJourney = async (code: string) => {
    try {
      setIsLoading(true);
      setError('');
      const data = await trackingService.getProductJourney(code);
      setJourneyData(data);
      setShowScanner(false);
    } catch (err) {
      console.error('Error fetching batch journey:', err);
      setError('Could not find information for this batch. Please check the code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanSuccess = (decodedText: string) => {
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
    
    navigate(`/tracking/${detectedBatchCode}`);
  };

  // Function to format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Function to determine status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
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

  // Function to refresh journey data after an action is completed
  const handleActionComplete = () => {
    if (batchCode) {
      fetchBatchJourney(batchCode);
    }
  };

  return (
    <div className="public-tracking-page">
      <div className="tracking-header">
        <div className="tracking-logo">
        <img 
          src={logoImage} 
          alt="SynerHarvest Logo" 
          style={{ width: '90px', height: 'auto', marginRight: '10px' }}
        />
          <h1>SynerHarvest</h1>
        </div>
        <h2 className="tracking-title">Product Journey Tracker</h2>
        <p className="tracking-subtitle">
          Trace your food from farm to fork with complete transparency
        </p>
      </div>

      {error && (
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
      )}

      {scanCode && (
        <div className="scanner-section">
          <div className="card">
            <h3>Scan a QR Code</h3>
            <p>Point your camera at a product's QR code to view its journey.</p>
            <QRCodeScanner 
              onScanSuccess={handleScanSuccess}
              width={300}
              height={300}
              className="mt-4"
            />
            <div className="manual-entry mt-4">
              <p>Or enter a batch code manually:</p>
              <div className="manual-code-form">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter batch code"
                  onChange={(e) => {
                    if (e.target.value) {
                      navigate(`/tracking/${e.target.value}`);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading product journey...</p>
        </div>
      ) : journeyData ? (
        <div className="journey-container">
          <div className="tracking-grid">
            <div className="tracking-main">
              <div className="product-overview card">
                <div className="product-header">
                  <h3>{journeyData.product.name}</h3>
                  <span className={`badge ${getStatusBadgeClass(journeyData.batch.status)}`}>
                    {journeyData.batch.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="product-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Batch Code</span>
                      <span className="detail-value">{journeyData.batch.batchCode}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Production Date</span>
                      <span className="detail-value">{formatDate(journeyData.batch.productionDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Expiration Date</span>
                      <span className="detail-value">{formatDate(journeyData.batch.expirationDate)}</span>
                    </div>
                  </div>
                  
                  <div className="product-description">
                    <span className="detail-label">Product Description</span>
                    <p>{journeyData.product.description}</p>
                  </div>
                  
                  <div className="product-certifications">
                    {journeyData.product.organic && (
                      <div className="certification organic">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        <span>Organic</span>
                      </div>
                    )}
                    {journeyData.product.certification && (
                      <div className="certification">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="8" r="7"></circle>
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                        </svg>
                        <span>{journeyData.product.certification}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {journeyData.metrics && (
                <div className="journey-metrics card">
                  <h3>Journey Metrics</h3>
                  <div className="metrics-grid">
                    {journeyData.metrics.daysSinceHarvest !== undefined && (
                      <div className="metric-item">
                        <div className="metric-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <div className="metric-value">{journeyData.metrics.daysSinceHarvest}</div>
                        <div className="metric-label">Days Since Harvest</div>
                      </div>
                    )}
                    
                    {journeyData.metrics.hoursInTransit !== undefined && (
                      <div className="metric-item">
                        <div className="metric-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        </div>
                        <div className="metric-value">{journeyData.metrics.hoursInTransit}</div>
                        <div className="metric-label">Hours in Transit</div>
                      </div>
                    )}
                    
                    {journeyData.metrics.qualityChecks !== undefined && (
                      <div className="metric-item">
                        <div className="metric-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <div className="metric-value">{journeyData.metrics.qualityChecks}</div>
                        <div className="metric-label">Quality Checks</div>
                      </div>
                    )}
                    
                    {journeyData.metrics.estimatedCarbonFootprint !== undefined && (
                      <div className="metric-item">
                        <div className="metric-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 22h20"></path>
                            <path d="M6.87 17a5 5 0 0 1-1.66-3c0-1.5.7-3.13 2.23-4.64a13.15 13.15 0 0 1 3.98-2.9 9.35 9.35 0 0 0 2.83-1.85A4.35 4.35 0 0 0 15.5 2"></path>
                            <path d="M17.13 17a5 5 0 0 0 1.66-3c0-1.5-.7-3.13-2.23-4.64a13.15 13.15 0 0 0-3.98-2.9 9.35 9.35 0 0 1-2.83-1.85A4.35 4.35 0 0 1 8.5 2"></path>
                          </svg>
                        </div>
                        <div className="metric-value">{journeyData.metrics.estimatedCarbonFootprint.toFixed(2)}</div>
                        <div className="metric-label">CO₂ Footprint (kg)</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="journey-timeline card">
                <h3>Product Journey</h3>
                {journeyData.events.length > 0 ? (
                  <div className="events-timeline">
                    {journeyData.events.map((event, index) => (
                      <div key={event.id} className={`timeline-item event-${event.eventType.toLowerCase()}`}>
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <h4 className="timeline-title">{event.eventType.replace('_', ' ')}</h4>
                            <span className="timeline-date">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="timeline-body">
                            <div className="event-details">
                              {event.location && (
                                <div className="event-detail">
                                  <span className="event-label">Location:</span>
                                  <span className="event-value">{event.location}</span>
                                </div>
                              )}
                              
                              {(event.temperature !== undefined && event.temperature !== null) && (
                                <div className="event-detail">
                                  <span className="event-label">Temperature:</span>
                                  <span className="event-value">{event.temperature}°C</span>
                                </div>
                              )}
                              
                              {(event.humidity !== undefined && event.humidity !== null) && (
                                <div className="event-detail">
                                  <span className="event-label">Humidity:</span>
                                  <span className="event-value">{event.humidity}%</span>
                                </div>
                              )}
                              
                              {event.notes && (
                                <div className="event-notes">
                                  <span className="event-label">Notes:</span>
                                  <p>{event.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-events">
                    <p>No journey events have been recorded for this product yet.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="tracking-sidebar">
              {/* Role-Based Action Panel */}
              <RoleBasedActionPanel 
                batchId={journeyData.batch.id}
                batchCode={journeyData.batch.batchCode}
                currentStatus={journeyData.batch.status}
                productName={journeyData.product.name}
                onActionComplete={handleActionComplete}
              />
              
              <div className="tracking-help card">
                <h3>Need Help?</h3>
                <p>If you have questions about this product or its journey, contact us at:</p>
                <a href="mailto:support@synerharvest.com" className="help-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  support@synerharvest.com
                </a>
                <a href="tel:+18005551212" className="help-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  1-800-555-1212
                </a>
              </div>
            </div>
          </div>
          
          <div className="scan-another text-center">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/tracking?scan=true')}
            >
              Scan Another Product
            </button>
          </div>
        </div>
      ) : null}
      
      <div className="public-footer">
        <p>&copy; {new Date().getFullYear()} SynerHarvest. All rights reserved.</p>
        <p>Bringing transparency to the food supply chain</p>
      </div>
    </div>
  );
};

export default BatchTrackingPage;