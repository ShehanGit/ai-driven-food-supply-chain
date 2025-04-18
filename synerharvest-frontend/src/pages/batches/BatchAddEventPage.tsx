// src/pages/batches/BatchAddEventPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import batchService, { Batch, BatchEvent } from '../../services/batchService';

const BatchAddEventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<{
    eventType: string;
    location: string;
    temperature: string;
    humidity: string;
    notes: string;
  }>({
    eventType: 'QUALITY_CHECK',
    location: '',
    temperature: '',
    humidity: '',
    notes: ''
  });

  // Event types that can be recorded
  const eventTypeOptions = [
    { value: 'QUALITY_CHECK', label: 'Quality Check' },
    { value: 'STORED', label: 'Stored' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'RECEIVED', label: 'Received' },
    { value: 'PROCESSED', label: 'Processed' },
    { value: 'PACKAGED', label: 'Packaged' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'SOLD', label: 'Sold' }
  ];

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
        
        // Suggest an event type based on current status
        setFormData(prev => ({
          ...prev,
          eventType: suggestEventType(data.status || '')
        }));
      } catch (err) {
        console.error('Error fetching batch details:', err);
        setError('Failed to load batch details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatch();
  }, [id]);

  // Suggest event type based on current batch status
  const suggestEventType = (status: string): string => {
    switch (status) {
      case 'CREATED': return 'HARVESTED';
      case 'HARVESTED': return 'QUALITY_CHECK';
      case 'IN_STORAGE': return 'SHIPPED';
      case 'IN_TRANSIT': return 'RECEIVED';
      case 'DELIVERED': return 'QUALITY_CHECK';
      case 'AT_RETAILER': return 'SOLD';
      default: return 'QUALITY_CHECK';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      if (!batch?.id) {
        throw new Error('Batch information missing');
      }

      const eventData: BatchEvent = {
        eventType: formData.eventType,
        location: formData.location,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        humidity: formData.humidity ? parseFloat(formData.humidity) : undefined,
        notes: formData.notes
      };

      await batchService.addBatchEvent(batch.id, eventData);

      setSuccessMessage(`Event added successfully`);
      
      // Short timeout to show success message before redirecting
      setTimeout(() => {
        navigate(`/batches/${batch.id}/events`);
      }, 1500);
    } catch (err: any) {
      console.error('Error adding batch event:', err);
      setError(err.response?.data?.message || 'Failed to add event. Please try again.');
    } finally {
      setIsSubmitting(false);
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
    <div className="batch-add-event-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Add Batch Event</h1>
            <p className="page-subtitle">
              Record a new event for batch #{batch.batchCode}
            </p>
          </div>
        </div>
      </div>

      <div className="batch-info-summary">
        <div className="batch-summary-item">
          <div className="summary-label">Batch Code</div>
          <div className="summary-value">{batch.batchCode}</div>
        </div>
        <div className="batch-summary-item">
          <div className="summary-label">Product</div>
          <div className="summary-value">{batch.productName}</div>
        </div>
        <div className="batch-summary-item">
          <div className="summary-label">Current Status</div>
          <div className="summary-value">
            <span className={`badge ${batch.status === 'RECALLED' ? 'badge-danger' : 'badge-primary'}`}>
              {batch.status?.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="card add-event-form-card">
        {successMessage && (
          <div className="alert alert-success mb-4">
            <div className="alert-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="alert-content">{successMessage}</div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mb-4">
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

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
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
                {eventTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <small className="form-text text-muted">
                Note: To change batch status, use the "Update Status" option instead.
              </small>
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

            <div className="form-group">
              <label htmlFor="temperature" className="form-label">Temperature (°C)</label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                step="0.1"
                className="form-control"
                value={formData.temperature}
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
                value={formData.humidity}
                onChange={handleInputChange}
                placeholder="e.g., 65.5"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="notes" className="form-label">Notes</label>
              <textarea
                id="notes"
                name="notes"
                className="form-control"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                placeholder="Additional information about this event..."
              ></textarea>
            </div>
          </div>

          <div className="form-actions">
            <Link to={`/batches/${id}/events`} className="btn btn-outlined">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-sm"></span>
                  Adding Event...
                </>
              ) : (
                'Add Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchAddEventPage;