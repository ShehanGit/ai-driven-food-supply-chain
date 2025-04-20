// src/pages/analytics/AnalyticsPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import analyticsService, {
  AnalyticsSummary,
  BatchStatusDistribution,
  ProductTypeDistribution,
  MonthlyProduction,
  BatchEventSummary,
  QualityMetric,
  EnvironmentalData
} from '../../services/analyticsService';
import productService, { Product } from '../../services/productService';

// Recharts components for visualizations
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for different analytics data
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [batchStatusData, setBatchStatusData] = useState<BatchStatusDistribution[]>([]);
  const [productTypeData, setProductTypeData] = useState<ProductTypeDistribution[]>([]);
  const [monthlyProductionData, setMonthlyProductionData] = useState<MonthlyProduction[]>([]);
  const [batchEventData, setBatchEventData] = useState<BatchEventSummary[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([]);
  const [demandForecast, setDemandForecast] = useState<any[]>([]);
  const [carbonFootprint, setCarbonFootprint] = useState<any[]>([]);
  
  // State for product-specific data
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData[]>([]);
  
  // Charts settings
  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
  
  useEffect(() => {
    // Fetch all analytics data
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products first to populate dropdown
        const productsData = await productService.getProductsByCurrentUser();
        setProducts(productsData);
        
        // Set first product as selected by default
        if (productsData.length > 0 && productsData[0].id) {
          setSelectedProductId(productsData[0].id);
        }
        
        // Fetch all analytics data in parallel
        const [
          summaryData,
          batchStatusDistribution,
          productTypeDistribution,
          monthlyProduction,
          batchEventSummary,
          qualityData,
          forecastData,
          footprintData
        ] = await Promise.all([
          analyticsService.getAnalyticsSummary(),
          analyticsService.getBatchStatusDistribution(),
          analyticsService.getProductTypeDistribution(),
          analyticsService.getMonthlyProduction(),
          analyticsService.getBatchEventSummary(),
          analyticsService.getQualityMetrics(),
          analyticsService.getDemandForecast(),
          analyticsService.getCarbonFootprintData()
        ]);
        
        // Update state with fetched data
        setSummary(summaryData);
        setBatchStatusData(batchStatusDistribution);
        setProductTypeData(productTypeDistribution);
        setMonthlyProductionData(monthlyProduction);
        setBatchEventData(batchEventSummary);
        setQualityMetrics(qualityData);
        setDemandForecast(forecastData);
        setCarbonFootprint(footprintData);
      } catch (err: any) {
        console.error('Error fetching analytics data:', err);
        setError(err.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);
  
  // Fetch environmental data when selected product changes
  useEffect(() => {
    const fetchEnvironmentalData = async () => {
      if (selectedProductId) {
        try {
          const data = await analyticsService.getEnvironmentalData(selectedProductId);
          setEnvironmentalData(data);
        } catch (err: any) {
          console.error(`Error fetching environmental data for product ${selectedProductId}:`, err);
        }
      }
    };
    
    fetchEnvironmentalData();
  }, [selectedProductId]);
  
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(Number(e.target.value));
  };
  
  // Get selected product name for display
  const getSelectedProductName = () => {
    if (!selectedProductId) return 'N/A';
    const product = products.find(p => p.id === selectedProductId);
    return product ? product.name : 'N/A';
  };
  
  // Format date strings for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Format month strings for display (e.g., "2023-04" to "Apr 2023")
  const formatMonth = (monthStr: string) => {
    if (!monthStr || !monthStr.includes('-')) return monthStr;
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading analytics data...</p>
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
      </div>
    );
  }
  
  return (
    <div className="analytics-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Farm Analytics</h1>
            <p className="page-subtitle">
              Insights and metrics for {user?.role === 'FARMER' ? 'your farm' : 'your operations'}
            </p>
          </div>
          <div className="page-actions">
            <button className="btn btn-outlined" onClick={() => window.print()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print Report
            </button>
            <button className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-body">
              <div className="stat-card-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--primary-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <div className="stat-card-title">Total Products</div>
              <div className="stat-card-value">{summary.totalProducts}</div>
            </div>
            <div className="stat-card-footer">
              View all products
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-body">
              <div className="stat-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div className="stat-card-title">Total Batches</div>
              <div className="stat-card-value">{summary.totalBatches}</div>
            </div>
            <div className="stat-card-footer">
              View all batches
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-body">
              <div className="stat-card-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div className="stat-card-title">Active Shipments</div>
              <div className="stat-card-value">{summary.activeShipments}</div>
            </div>
            <div className="stat-card-footer">
              Track shipments
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-body">
              <div className="stat-card-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="stat-card-title">Expiring Soon</div>
              <div className="stat-card-value">{summary.expiringBatches}</div>
            </div>
            <div className="stat-card-footer">
              View expiring batches
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Main Analytics Grid */}
      <div className="analytics-grid">
        {/* Batch Status Distribution */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Batch Status Distribution</h3>
          </div>
          <div className="analytics-card-body chart-container">
            {batchStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={batchStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="status"
                  >
                    {batchStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} batches`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart-message">No batch status data available</div>
            )}
          </div>
        </div>
        
        {/* Monthly Production */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Monthly Production</h3>
          </div>
          <div className="analytics-card-body chart-container">
            {monthlyProductionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={monthlyProductionData.map(item => ({
                    ...item,
                    month: formatMonth(item.month)
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Batches Produced" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart-message">No monthly production data available</div>
            )}
          </div>
        </div>
        
        {/* Product Type Distribution */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Product Type Distribution</h3>
          </div>
          <div className="analytics-card-body chart-container">
            {productTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={productTypeData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="productType" />
                  <Tooltip />
                  <Bar dataKey="count" name="Count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart-message">No product type data available</div>
            )}
          </div>
        </div>
        
        {/* Event Types */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Event Types</h3>
          </div>
          <div className="analytics-card-body chart-container">
            {batchEventData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={batchEventData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="eventType" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Event Count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart-message">No event data available</div>
            )}
          </div>
        </div>
        
        {/* Environmental Conditions Monitoring */}
        <div className="analytics-card spanning">
          <div className="analytics-card-header">
            <h3>Environmental Conditions Monitoring</h3>
            <div className="product-selector">
              <select
                value={selectedProductId || ''}
                onChange={handleProductChange}
                className="form-control"
              >
                <option value="">Select a Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="analytics-card-body chart-container">
            {environmentalData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={environmentalData.map(data => ({
                    ...data,
                    timestamp: formatDate(data.timestamp)
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="temperature"
                    name="Temperature (°C)"
                    stroke="#ef4444"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity (%)"
                    stroke="#3b82f6"
                    activeDot={{ r: 8 }}
                  />
                  {environmentalData[0]?.soilMoisture !== undefined && (
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="soilMoisture"
                      name="Soil Moisture (%)"
                      stroke="#22c55e"
                      activeDot={{ r: 8 }}
                    />
                  )}
                  {environmentalData[0]?.soilPh !== undefined && (
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="soilPh"
                      name="Soil pH"
                      stroke="#8b5cf6"
                      activeDot={{ r: 8 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart-message">
                {selectedProductId
                  ? `No environmental data available for ${getSelectedProductName()}`
                  : 'Select a product to view environmental data'}
              </div>
            )}
          </div>
        </div>
        
        {/* Quality Metrics */}
        <div className="analytics-card spanning">
          <div className="analytics-card-header">
            <h3>Quality Metrics</h3>
          </div>
          <div className="analytics-card-body">
            {qualityMetrics.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Batch Code</th>
                      <th>Product</th>
                      <th>Quality Score</th>
                      <th>Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qualityMetrics.map((metric) => (
                      <tr key={metric.batchCode}>
                        <td>{metric.batchCode}</td>
                        <td>{metric.productName}</td>
                        <td>
                          <div className="quality-score">
                            <div
                              className={`quality-bar ${
                                metric.score >= 90
                                  ? 'excellent'
                                  : metric.score >= 75
                                  ? 'good'
                                  : 'needs-improvement'
                              }`}
                              style={{ width: `${metric.score}%` }}
                            ></div>
                            <span className="quality-value">{metric.score}</span>
                          </div>
                        </td>
                        <td>
                          {metric.issues.length > 0 ? (
                            <ul className="issues-list">
                              {metric.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                              ))}
                            </ul>
                          ) : (
                            <span className="no-issues">No issues detected</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-chart-message">No quality metrics available</div>
            )}
          </div>
        </div>
        
        {/* Demand Forecast */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Demand Forecast</h3>
            <div className="time-range-selector">
              <select className="form-control">
                <option value="6months">Next 6 Months</option>
                <option value="3months">Next 3 Months</option>
                <option value="12months">Next 12 Months</option>
              </select>
            </div>
          </div>
          <div className="analytics-card-body chart-container">
            {demandForecast.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    allowDuplicatedCategory={false} 
                    type="category"
                    data={demandForecast[0]?.forecast.map(f => f.month) || []}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {demandForecast.map((product, index) => (
                    <Line
                      key={product.productName}
                      data={product.forecast}
                      type="monotone"
                      dataKey="demand"
                      name={product.productName}
                      stroke={COLORS[index % COLORS.length]}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart-message">No forecast data available</div>
            )}
          </div>
        </div>
        
        {/* Carbon Footprint */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3>Carbon Footprint</h3>
          </div>
          <div className="analytics-card-body chart-container">
            {carbonFootprint.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={carbonFootprint}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="productType" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="breakdown.farming" name="Farming" stackId="a" fill="#22c55e" />
                  <Bar dataKey="breakdown.processing" name="Processing" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="breakdown.transport" name="Transport" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="breakdown.packaging" name="Packaging" stackId="a" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart-message">No carbon footprint data available</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recommendations Section */}
      <div className="analytics-recommendations">
        <h3 className="recommendations-title">AI-Powered Recommendations</h3>
        <div className="recommendations-grid">
          <div className="recommendation-card">
            <div className="recommendation-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="recommendation-content">
              <h4>Optimize Harvest Timing</h4>
              <p>Based on current market demand and environmental conditions, consider harvesting your tomato crops 3-5 days earlier than planned for optimal quality and yield.</p>
            </div>
          </div>
          
          <div className="recommendation-card">
            <div className="recommendation-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
              </svg>
            </div>
            <div className="recommendation-content">
              <h4>Weather Alert</h4>
              <p>Forecasts predict abnormally high temperatures next week. Consider increasing irrigation for your apple orchards and strawberry fields to prevent drought stress.</p>
            </div>
          </div>
          
          <div className="recommendation-card">
            <div className="recommendation-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary-color)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <div className="recommendation-content">
              <h4>Market Opportunity</h4>
              <p>Demand for organic strawberries is projected to increase by 25% next month. Consider adjusting your production schedule to meet this demand and maximize profits.</p>
            </div>
          </div>
          
          <div className="recommendation-card">
            <div className="recommendation-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="recommendation-content">
              <h4>Quality Alert</h4>
              <p>Recent quality metrics show slight decline in batch BAN-20250410-002. Consider reviewing storage conditions and implementing mitigation measures.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;