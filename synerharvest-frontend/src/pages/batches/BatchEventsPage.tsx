// src/pages/batches/BatchEventsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import batchService, { Batch, BatchEvent } from '../../services/batchService';

const BatchEventsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [events, setEvents] = useState<BatchEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBatchAndEvents = async () => {
      try {
        setIsLoading(true);
        const batchId = parseInt(id as string);
        if (isNaN(batchId)) {
          throw new Error('Invalid batch ID');
        }
        
        // Fetch both batch details and events
        const batchData = await batchService.getBatch(batchId);
        const eventsData = await batchService.getBatchEvents(batchId);
        
        setBatch(batchData);
        setEvents(eventsData);
      } catch (err) {
        console.error('Error fetching batch events:', err);
        setError('Failed to load batch events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBatchAndEvents();
  }, [id]);

  const getEventTypeClass = (eventType: string) => {
    switch (eventType) {
      case 'CREATED': return 'event-created';
      case 'HARVESTED': return 'event-harvested';
      case 'STORED': return 'event-stored';
      case 'SHIPPED': return 'event-shipped';
      case 'RECEIVED': return 'event-received';
      case 'QUALITY_CHECK': return 'event-quality';
      case 'PROCESSED': return 'event-processed';
      case 'PACKAGED': return 'event-packaged';
      case 'DELIVERED': return 'event-delivered';
      case 'SOLD': return 'event-sold';
      case 'RECALLED': return 'event-recalled';
      default: return 'event-default';
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading batch events...</p>
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
    <div className="batch-events-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Batch Events</h1>
            <p className="page-subtitle">
              Event history for batch #{batch.batchCode}
            </p>
          </div>
          <div className="page-actions">
            <Link to={`/batches/${id}`} className="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              View Batch Details
            </Link>
            <Link to={`/batches/${id}/add-event`} className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Event
            </Link>
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
          <div className="summary-label">Status</div>
          <div className="summary-value">
            <span className={`badge ${batch.status === 'RECALLED' ? 'badge-danger' : 'badge-primary'}`}>
              {batch.status?.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="batch-summary-item">
          <div className="summary-label">Events</div>
          <div className="summary-value">{events.length}</div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="empty-events">
          <div className="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h3>No events found</h3>
          <p>This batch doesn't have any recorded events yet.</p>
          <Link to={`/batches/${id}/add-event`} className="btn btn-primary mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add First Event
          </Link>
        </div>
      ) : (
        <div className="events-timeline">
          {events.map((event, index) => (
            <div key={event.id} className={`timeline-item ${getEventTypeClass(event.eventType || '')}`}>
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h3 className="timeline-title">{event.eventType?.replace('_', ' ')}</h3>
                  <span className="timeline-date">
                    {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="timeline-body">
                  <div className="event-details">
                    <div className="event-detail">
                      <span className="event-label">Recorded By:</span>
                      <span className="event-value">{event.recordedByUsername}</span>
                    </div>
                    
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
                    
                    {event.blockchainTxHash && (
                      <div className="event-detail blockchain-hash">
                        <span className="event-label">Blockchain Hash:</span>
                        <span className="event-value truncate-hash" title={event.blockchainTxHash}>
                          {event.blockchainTxHash.substring(0, 8)}...{event.blockchainTxHash.substring(event.blockchainTxHash.length - 8)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="batch-actions">
        <Link to={`/batches/${id}`} className="btn btn-outlined">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          View Batch Details
        </Link>
        
        <Link to="/batches" className="btn btn-outlined">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Batches
        </Link>
        
        <Link to={`/batches/${id}/add-event`} className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Event
        </Link>
      </div>
    </div>
  );
};

export default BatchEventsPage;