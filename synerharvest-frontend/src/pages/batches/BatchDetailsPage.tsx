// src/pages/batches/BatchDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import batchService, { Batch } from '../../services/batchService';

const BatchDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        setIsLoading(true);
        const batchId = parseInt(id as string);
        if (isNaN(batchId)) {
          throw new Error('Invalid batch ID');
        }
        
        const data = await batchService.getBatch(batchId);
        setBatch(data);
      } catch (err) {
        console.error('Error fetching batch details:', err);
        setError('Failed to load batch details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatch();
  }, [id]);

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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading batch details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
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
        <div className="mt-4">
          <button className="btn btn-primary" onClick={() => navigate('/batches')}>
            Back to Batches
          </button>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="not-found-container">
        <h2>Batch not found</h2>
        <p>The batch you are looking for does not exist or has been removed.</p>
        <div className="mt-4">
          <button className="btn btn-primary" onClick={() => navigate('/batches')}>
            Back to Batches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="batch-details-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Batch Details</h1>
            <p className="page-subtitle">
              Details for batch #{batch.batchCode}
            </p>
          </div>
          <div className="page-actions">
            <Link to={`/batches/${id}/events`} className="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              View Events
            </Link>
            <Link to={`/batches/${id}/update-status`} className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              Update Status
            </Link>
          </div>
        </div>
      </div>

      <div className="batch-details-container">
        <div className="batch-details-card">
          <div className="batch-details-header">
            <div className="batch-details-title">Batch Information</div>
            <span className={`badge ${getStatusBadgeClass(batch.status || '')}`}>
              {batch.status?.replace('_', ' ')}
            </span>
          </div>

          <div className="batch-details-content">
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">Batch Code</div>
                <div className="detail-value">{batch.batchCode}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Product</div>
                <div className="detail-value">{batch.productName}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Quantity</div>
                <div className="detail-value">{batch.quantity}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Production Date</div>
                <div className="detail-value">
                  {batch.productionDate ? new Date(batch.productionDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Expiration Date</div>
                <div className="detail-value">
                  {batch.expirationDate ? new Date(batch.expirationDate).toLocaleDateString() : 'N/A'}
                </div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Created By</div>
                <div className="detail-value">{batch.createdByUsername}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Created At</div>
                <div className="detail-value">
                  {batch.createdAt ? new Date(batch.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            {batch.notes && (
              <div className="batch-notes">
                <div className="detail-label">Notes</div>
                <div className="detail-value">{batch.notes}</div>
              </div>
            )}
          </div>
        </div>

        {batch.qrCodeUrl && (
          <div className="batch-qr-card">
            <div className="batch-details-header">
              <div className="batch-details-title">QR Code</div>
            </div>
            <div className="batch-qr-content">
              <img 
                src={batch.qrCodeUrl} 
                alt={`QR Code for batch ${batch.batchCode}`}
                className="batch-qr-image"
              />
              <div className="batch-qr-info">
                <p>Scan this QR code to track the batch through the supply chain.</p>
                <button className="btn btn-outlined mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="batch-actions-card">
          <Link to="/batches" className="btn btn-outlined">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Batches
          </Link>
          
          <Link to={`/batches/${id}/events`} className="btn btn-outlined">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            View Events
          </Link>
          
          <Link to={`/batches/${id}/qr-code`} className="btn btn-outlined">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            View QR Code
          </Link>
          
          <Link to={`/batches/${id}/update-status`} className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            Update Status
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsPage;