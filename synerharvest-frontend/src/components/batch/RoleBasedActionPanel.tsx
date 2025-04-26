// src/components/batch/RoleBasedActionPanel.tsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import batchService from '../../services/batchService';

interface BatchEventData {
  eventType: string;
  location: string;
  temperature?: number;
  humidity?: number;
  notes: string;
}

interface RoleBasedActionPanelProps {
  batchId?: number;
  batchCode: string;
  currentStatus: string;
  productName: string;
  onActionComplete?: () => void;
}

const RoleBasedActionPanel: React.FC<RoleBasedActionPanelProps> = ({
  batchId,
  batchCode,
  currentStatus,
  productName,
  onActionComplete
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [formData, setFormData] = useState<BatchEventData>({
    eventType: '',
    location: '',
    temperature: undefined,
    humidity: undefined,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If user is not authenticated, show login prompt
  if (!user) {
    return (
      <div className="role-actions-panel card">
        <div className="role-actions-header">
          <h3>Take Action</h3>
        </div>
        <div className="role-actions-content">
          <p>Please log in to perform actions on this batch.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/login', { state: { returnUrl: `/tracking/${batchCode}` } })}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  // Define role-specific actions
  const getRoleActions = () => {
    const role = user?.role || 'CONSUMER';
    
    switch (role) {
      case 'FARMER':
        return [
          { id: 'quality-check', label: 'Record Quality Check', icon: 'check-circle', color: 'var(--primary-color)' },
          { id: 'update-status', label: 'Update Batch Status', icon: 'refresh-cw', color: 'var(--secondary-color)' },
          { id: 'record-conditions', label: 'Record Storage Conditions', icon: 'thermometer', color: 'var(--info-color)' },
          { id: 'prepare-shipment', label: 'Prepare for Shipment', icon: 'package', color: 'var(--warning-color)' }
        ];
      case 'DISTRIBUTOR':
        return [
          { id: 'record-pickup', label: 'Record Pickup', icon: 'truck', color: 'var(--secondary-color)' },
          { id: 'log-transport', label: 'Log Transport Conditions', icon: 'activity', color: 'var(--primary-color)' },
          { id: 'record-delivery', label: 'Record Delivery', icon: 'map-pin', color: 'var(--success-color)' },
          { id: 'report-issue', label: 'Report Issue', icon: 'alert-triangle', color: 'var(--danger-color)' }
        ];
      case 'RETAILER':
        return [
          { id: 'receive-batch', label: 'Receive Batch', icon: 'clipboard', color: 'var(--primary-color)' },
          { id: 'check-quality', label: 'Quality Inspection', icon: 'check-square', color: 'var(--info-color)' },
          { id: 'record-sale', label: 'Record Sale', icon: 'shopping-cart', color: 'var(--success-color)' },
          { id: 'report-waste', label: 'Report Waste/Loss', icon: 'trash', color: 'var(--danger-color)' }
        ];
      case 'ADMIN':
        return [
          { id: 'update-status', label: 'Update Status', icon: 'edit', color: 'var(--primary-color)' },
          { id: 'quality-check', label: 'Quality Check', icon: 'check-circle', color: 'var(--success-color)' },
          { id: 'create-event', label: 'Create Custom Event', icon: 'plus-circle', color: 'var(--secondary-color)' },
          { id: 'view-all-data', label: 'View Complete Data', icon: 'database', color: 'var(--info-color)' },
          { id: 'manage-batch', label: 'Batch Management', icon: 'settings', color: 'var(--warning-color)' }
        ];
      case 'CONSUMER':
      default:
        return [
          { id: 'verify-authenticity', label: 'Verify Authenticity', icon: 'shield', color: 'var(--primary-color)' },
          { id: 'provide-feedback', label: 'Provide Feedback', icon: 'message-square', color: 'var(--secondary-color)' }
        ];
    }
  };

  const getEventTypeOptions = () => {
    const role = user?.role || 'CONSUMER';
    
    // Base event types available to most roles
    const baseOptions = [
      { value: 'QUALITY_CHECK', label: 'Quality Check' }
    ];
    
    // Role-specific event types
    switch (role) {
      case 'FARMER':
        return [
          ...baseOptions,
          { value: 'HARVESTED', label: 'Harvested' },
          { value: 'STORED', label: 'Stored' },
          { value: 'PACKAGED', label: 'Packaged' },
          { value: 'SHIPPED', label: 'Shipped' }
        ];
      case 'DISTRIBUTOR':
        return [
          ...baseOptions,
          { value: 'RECEIVED', label: 'Received' },
          { value: 'IN_TRANSIT', label: 'In Transit' },
          { value: 'DELIVERED', label: 'Delivered' }
        ];
      case 'RETAILER':
        return [
          ...baseOptions,
          { value: 'RECEIVED', label: 'Received' },
          { value: 'STOCKED', label: 'Stocked' },
          { value: 'SOLD', label: 'Sold' }
        ];
      case 'ADMIN':
        return [
          ...baseOptions,
          { value: 'HARVESTED', label: 'Harvested' },
          { value: 'STORED', label: 'Stored' },
          { value: 'PACKAGED', label: 'Packaged' },
          { value: 'SHIPPED', label: 'Shipped' },
          { value: 'RECEIVED', label: 'Received' },
          { value: 'IN_TRANSIT', label: 'In Transit' },
          { value: 'DELIVERED', label: 'Delivered' },
          { value: 'STOCKED', label: 'Stocked' },
          { value: 'SOLD', label: 'Sold' },
          { value: 'RECALLED', label: 'Recalled' },
          { value: 'DISPOSED', label: 'Disposed' },
          { value: 'CUSTOM_EVENT', label: 'Custom Event' }
        ];
      default:
        return baseOptions;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    if (!batchId) {
      setError("Batch ID is missing, please reload the page.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Create event data from form
      const eventData = {
        ...formData,
        temperature: formData.temperature ? parseFloat(formData.temperature.toString()) : undefined,
        humidity: formData.humidity ? parseFloat(formData.humidity.toString()) : undefined
      };

      // Submit based on action type
      if (activeAction === 'update-status') {
        await batchService.updateBatchStatus(batchId, mapEventTypeToStatus(formData.eventType), eventData);
      } else {
        await batchService.addBatchEvent(batchId, eventData);
      }

      setSuccess("Action completed successfully!");
      setTimeout(() => {
        setActiveAction(null);
        if (onActionComplete) onActionComplete();
      }, 2000);
    } catch (err: any) {
      console.error('Error performing batch action:', err);
      setError(err.response?.data?.message || 'Failed to complete action. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map event types to corresponding status values
  const mapEventTypeToStatus = (eventType: string): string => {
    const statusMap: {[key: string]: string} = {
      'HARVESTED': 'HARVESTED',
      'STORED': 'IN_STORAGE',
      'SHIPPED': 'IN_TRANSIT',
      'RECEIVED': 'DELIVERED',
      'DELIVERED': 'AT_RETAILER',
      'SOLD': 'SOLD',
      'RECALLED': 'RECALLED'
    };
    
    return statusMap[eventType] || currentStatus;
  };

  const renderActionForm = () => {
    switch (activeAction) {
      case 'quality-check':
      case 'update-status':
      case 'record-conditions':
      case 'record-pickup':
      case 'log-transport':
      case 'record-delivery':
      case 'receive-batch':
      case 'check-quality':
      case 'create-event':
        return (
          <form onSubmit={handleSubmit} className="action-form">
            <div className="form-group">
              <label htmlFor="eventType" className="form-label">Event Type</label>
              <select
                id="eventType"
                name="eventType"
                className="form-control"
                value={formData.eventType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Event Type</option>
                {getEventTypeOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Warehouse A, Distribution Center"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="temperature" className="form-label">Temperature (°C)</label>
                <input
                  type="number"
                  id="temperature"
                  name="temperature"
                  step="0.1"
                  className="form-control"
                  value={formData.temperature || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 4.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="humidity" className="form-label">Humidity (%)</label>
                <input
                  type="number"
                  id="humidity"
                  name="humidity"
                  step="0.1"
                  className="form-control"
                  value={formData.humidity || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 65.5"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">Notes</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Additional information..."
              ></textarea>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-outlined" 
                onClick={() => setActiveAction(null)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-sm"></span>
                    Submitting...
                  </>
                ) : 'Submit'}
              </button>
            </div>
          </form>
        );
        
      case 'report-issue':
      case 'report-waste':
        return (
          <form onSubmit={handleSubmit} className="action-form">
            <div className="form-group">
              <label htmlFor="eventType" className="form-label">Issue Type</label>
              <select
                id="eventType"
                name="eventType"
                className="form-control"
                value={formData.eventType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Issue Type</option>
                <option value="QUALITY_ISSUE">Quality Issue</option>
                <option value="DAMAGE">Damage</option>
                <option value="SPOILAGE">Spoilage</option>
                <option value="PACKAGING_ISSUE">Packaging Issue</option>
                <option value="OTHER_ISSUE">Other Issue</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Where the issue was discovered"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">Description</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Detailed description of the issue..."
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-outlined" 
                onClick={() => setActiveAction(null)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-danger" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-sm"></span>
                    Reporting...
                  </>
                ) : 'Report Issue'}
              </button>
            </div>
          </form>
        );
        
      case 'record-sale':
        return (
          <form onSubmit={handleSubmit} className="action-form">
            <div className="form-group">
              <label htmlFor="eventType" className="form-label">Sale Type</label>
              <select
                id="eventType"
                name="eventType"
                className="form-control"
                value={formData.eventType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Sale Type</option>
                <option value="SOLD">Complete Sale</option>
                <option value="PARTIAL_SALE">Partial Sale</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">Sale Location</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Store #123, Farmers Market"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">Sale Details</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Quantity sold, price, customer information if applicable..."
              ></textarea>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-outlined" 
                onClick={() => setActiveAction(null)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-success" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-sm"></span>
                    Recording Sale...
                  </>
                ) : 'Record Sale'}
              </button>
            </div>
          </form>
        );
        
      case 'verify-authenticity':
        return (
          <div className="action-result">
            <div className="verification-success">
              <div className="verification-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>Product Verified!</h3>
              <p>This {productName} (Batch: {batchCode}) is authentic and properly registered in our system.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => setActiveAction(null)}
              >
                Close
              </button>
            </div>
          </div>
        );
        
      case 'provide-feedback':
        return (
          <form onSubmit={handleSubmit} className="action-form">
            <div className="form-group">
              <label htmlFor="eventType" className="form-label">Feedback Type</label>
              <select
                id="eventType"
                name="eventType"
                className="form-control"
                value={formData.eventType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Feedback Type</option>
                <option value="CONSUMER_REVIEW">Product Review</option>
                <option value="QUALITY_FEEDBACK">Quality Feedback</option>
                <option value="SUGGESTION">Suggestion</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">Your Feedback</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about your experience with this product..."
                required
              ></textarea>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-outlined" 
                onClick={() => setActiveAction(null)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-sm"></span>
                    Submitting...
                  </>
                ) : 'Submit Feedback'}
              </button>
            </div>
          </form>
        );
        
      case 'view-all-data':
        return (
          <div className="action-result">
            <p>
              View complete data in the admin dashboard:
            </p>
            <div className="button-group">
              <Link to={`/admin/batches/${batchId}`} className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                View Details
              </Link>
              <Link to={`/admin/batches/${batchId}/events`} className="btn btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                View Events
              </Link>
              <button 
                className="btn btn-outlined" 
                onClick={() => setActiveAction(null)}
              >
                Close
              </button>
            </div>
          </div>
        );
        
      case 'manage-batch':
        return (
          <div className="action-result">
            <p>
              Manage this batch in the admin dashboard:
            </p>
            <div className="button-group">
              <Link to={`/admin/batches/${batchId}/edit`} className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit Batch
              </Link>
              <Link to={`/admin/batches/${batchId}/qr-code`} className="btn btn-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                Manage QR Code
              </Link>
              <button 
                className="btn btn-outlined" 
                onClick={() => setActiveAction(null)}
              >
                Close
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="role-actions-panel card">
      <div className="role-actions-header">
        <h3>
          Actions
          {user.role && <span className="role-badge">{user.role}</span>}
        </h3>
        {activeAction && (
          <button 
            className="btn-icon back-button"
            onClick={() => setActiveAction(null)}
            title="Back to actions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        )}
      </div>
      
      <div className="role-actions-content">
        {error && (
          <div className="alert alert-danger">
            <div className="alert-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="alert-content">{error}</div>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            <div className="alert-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="alert-content">{success}</div>
          </div>
        )}
        
        {activeAction ? (
          renderActionForm()
        ) : (
          <div className="action-buttons">
            {getRoleActions().map(action => (
              <button
                key={action.id}
                className="action-button"
                onClick={() => {
                  setFormData({
                    eventType: '',
                    location: '',
                    temperature: undefined,
                    humidity: undefined,
                    notes: ''
                  });
                  setActiveAction(action.id);
                }}
              >
                <div className="action-icon" style={{ color: action.color }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {getIconPath(action.icon)}
                  </svg>
                </div>
                <span className="action-label">{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get SVG path based on icon name
const getIconPath = (iconName: string) => {
  switch (iconName) {
    case 'check-circle':
      return <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>;
    case 'refresh-cw':
      return <g><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></g>;
    case 'thermometer':
      return <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"></path>;
    case 'package':
      return <g><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></g>;
    case 'truck':
      return <g><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></g>;
    case 'activity':
      return <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>;
    case 'map-pin':
      return <g><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></g>;
    case 'alert-triangle':
      return <g><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></g>;
    case 'clipboard':
      return <g><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></g>;
    case 'check-square':
      return <g><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></g>;
    case 'shopping-cart':
      return <g><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></g>;
    case 'trash':
      return <g><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></g>;
    case 'edit':
      return <g><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></g>;
    case 'plus-circle':
      return <g><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></g>;
    case 'database':
      return <g><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></g>;
    case 'settings':
      return <g><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></g>;
    case 'shield':
      return <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>;
    case 'message-square':
      return <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>;
    default:
      return <circle cx="12" cy="12" r="10"></circle>;
  }
};

export default RoleBasedActionPanel;