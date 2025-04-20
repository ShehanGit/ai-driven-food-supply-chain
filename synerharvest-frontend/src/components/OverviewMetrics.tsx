// src/pages/analytics/components/OverviewMetrics.tsx
import React from 'react';
import { 
  ProductAnalytics, 
  BatchAnalytics, 
  EventAnalytics, 
  EnvironmentalAnalytics 
} from '../../../services/analyticsService';

interface OverviewMetricsProps {
  productAnalytics: ProductAnalytics | null;
  batchAnalytics: BatchAnalytics | null;
  eventAnalytics: EventAnalytics | null;
  environmentalAnalytics: EnvironmentalAnalytics | null;
  isLoading: boolean;
}

const OverviewMetrics: React.FC<OverviewMetricsProps> = ({
  productAnalytics,
  batchAnalytics,
  eventAnalytics,
  environmentalAnalytics,
  isLoading
}) => {
  
  // Format temperature for display
  const formatTemperature = (temp: number | null | undefined) => {
    if (temp === null || temp === undefined) return 'N/A';
    return `${temp.toFixed(1)} °C`;
  };
  
  // Format percentage for display
  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value}%`;
  };
  
  // Find the top product type
  const getTopProductType = () => {
    if (!productAnalytics || !productAnalytics.productsByType) return 'N/A';
    
    const entries = Object.entries(productAnalytics.productsByType);
    if (entries.length === 0) return 'N/A';
    
    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
    return sortedEntries[0][0];
  };
  
  // Get most common event type
  const getMostCommonEvent = () => {
    if (!eventAnalytics || !eventAnalytics.eventsByType) return 'N/A';
    
    const entries = Object.entries(eventAnalytics.eventsByType);
    if (entries.length === 0) return 'N/A';
    
    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
    return sortedEntries[0][0].replace('_', ' ');
  };

  return (
    <div className="overview-metrics">
      <h2 className="section-title">Dashboard Overview</h2>
      <p className="section-subtitle">Key metrics across your farming operations</p>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading analytics data...</p>
        </div>
      ) : (
        <div className="overview-grid">
          {/* Products Overview */}
          <div className="overview-card">
            <div className="overview-card-header">
              <h3>Products</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div className="overview-card-content">
              <div className="overview-stat">
                <div className="overview-stat-label">Total Products</div>
                <div className="overview-stat-value">{productAnalytics?.totalProducts || 0}</div>
              </div>
              <div className="overview-stat">
                <div className="overview-stat-label">Organic Products</div>
                <div className="overview-stat-value">{formatPercentage(productAnalytics?.organicPercentage)}</div>
              </div>
              <div className="overview-stat">
                <div className="overview-stat-label">Top Product Type</div>
                <div className="overview-stat-value">{getTopProductType()}</div>
              </div>
            </div>
          </div>
          
          {/* Batches Overview */}
          <div className="overview-card">
            <div className="overview-card-header">
              <h3>Batches</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className="overview-card-content">
              <div className="overview-stat">
                <div className="overview-stat-label">Total Batches</div>
                <div className="overview-stat-value">{batchAnalytics?.totalBatches || 0}</div>
              </div>
              <div className="overview-stat">
                <div className="overview-stat-label">Average Quantity</div>
                <div className="overview-stat-value">{batchAnalytics?.averageQuantity || 0}</div>
              </div>
              <div className="overview-stat">
                <div className="overview-stat-label">Time to Harvest</div>
                <div className="overview-stat-value">
                  {batchAnalytics?.averageTimeToHarvest !== null 
                    ? `${batchAnalytics?.averageTimeToHarvest} days` 
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Events Overview */}
          <div className="overview-card">
            <div className="overview-card-header">
              <h3>Events</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </div>
            <div className="overview-card-content">
              <div className="overview-stat">
                <div className="overview-stat-label">Total Events</div>
                <div className="overview-stat-value">{eventAnalytics?.totalEvents || 0}</div>
              </div>
              <div className="overview-stat">
                <div className="overview-stat-label">Most Common Event</div>
                <div className="overview-stat-value">{getMostCommonEvent()}</div>
              </div>
              <div className="overview-stat">
                <div className="overview-stat-label">Avg. Temperature</div>
                <div className="overview-stat-value">
                  {formatTemperature(eventAnalytics?.averageTemperature)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Environmental Overview */}
          <div className="overview-card">
            <div className="overview-card-header">
              <h3>Environmental</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
            </div>
            <div className="overview-card-content">
              <div className="overview-stat">
                <div className="overview-stat-label">Temp Range</div>
                <div className="overview-stat-value">
                  {environmentalAnalytics?.temperatureStats
                    ? `${environmentalAnalytics.temperatureStats.min} - ${environmentalAnalytics.temperatureStats.max} °C`
                    : 'N/A'}
                </div>
              </div>
              <div className="overview-stat">
                <div className="overview-stat-label">Avg Humidity</div>
                <div className="overview-stat-value">
                  {environmentalAnalytics?.humidityStats
                    ? `${environmentalAnalytics.humidityStats.avg}%`
                    : 'N/A'}
                </div>
              </div>
              <div className="overview-stat">
                <div className="overview-stat-label">Anomalies</div>
                <div className="overview-stat-value">
                  {environmentalAnalytics?.anomalies?.length || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Recent Activity */}
      <div className="recent-activity">
        <h3 className="subsection-title">Recent Activity</h3>
        
        {isLoading ? (
          <div className="loading-container sm">
            <div className="spinner"></div>
            <p>Loading recent activity...</p>
          </div>
        ) : (
          <div className="activity-list">
            {batchAnalytics?.recentBatches && batchAnalytics.recentBatches.length > 0 ? (
              batchAnalytics.recentBatches.map((batch, index) => (
                <div key={batch.id || index} className="activity-item">
                  <div className="activity-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--primary-color)' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">Batch {batch.batchCode}</div>
                    <div className="activity-meta">
                      <span>{batch.productName}</span>
                      <span>•</span>
                      <span>Quantity: {batch.quantity}</span>
                      <span>•</span>
                      <span className="badge badge-primary">{batch.status}</span>
                    </div>
                  </div>
                  <div className="activity-time">
                    {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No recent batches found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverviewMetrics;