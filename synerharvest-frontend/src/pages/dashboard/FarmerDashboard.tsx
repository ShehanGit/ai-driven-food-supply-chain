// src/components/dashboard/FarmerDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import productService from '../../services/productService';
import batchService from '../../services/batchService';
import weatherService, { WeatherData as ApiWeatherData } from '../../services/weatherService';

interface DashboardStatsState {
  totalProducts: number;
  totalBatches: number;
  expiringBatches: number;
  activeBatches: number;
}

interface WeatherDisplayData {
  temperature: number;
  humidity: number;
  condition: string;
  icon: string;
  location: string;
  forecast: { day: string; date: string; temp: number; condition: string; icon: string }[];
}

interface CropRecommendation {
  cropName: string;
  confidence: number;
  expectedYield: string;
  plantingWindow: string;
}

const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStatsState>({
    totalProducts: 0,
    totalBatches: 0,
    expiringBatches: 0,
    activeBatches: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState('');

  // Weather data state
  const [weatherData, setWeatherData] = useState<WeatherDisplayData>({
    temperature: 0,
    humidity: 0,
    condition: '',
    icon: '',
    location: '',
    forecast: []
  });

  // Mock AI crop recommendations
  const [cropRecommendations, setCropRecommendations] = useState<CropRecommendation[]>([
    {
      cropName: 'Organic Tomatoes',
      confidence: 95,
      expectedYield: '8.2 tons/acre',
      plantingWindow: 'April 28 - May 15'
    },
    {
      cropName: 'Sweet Corn',
      confidence: 87,
      expectedYield: '12.5 tons/acre',
      plantingWindow: 'May 5 - May 20'
    },
    {
      cropName: 'Bell Peppers',
      confidence: 82,
      expectedYield: '6.8 tons/acre',
      plantingWindow: 'May 1 - May 18'
    }
  ]);

  // Mock soil data
  const [soilData, setSoilData] = useState({
    moisture: 78, // percentage
    ph: 6.8,
    nutrientLevels: {
      nitrogen: 'Optimal',
      phosphorus: 'Slightly Low',
      potassium: 'Optimal'
    },
    recommendations: 'Consider adding phosphorus-rich fertilizer in the next 7 days'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get products
        const products = await productService.getProductsByCurrentUser();
        
        // Get batches
        const batches = await batchService.getBatchesByCurrentUser();
        
        // Get expiring batches
        const expiringBatches = await batchService.getExpiringBatches(7); // Batches expiring in 7 days
        
        // Calculate active batches (not sold, expired, or recalled)
        const activeBatchesCount = batches.filter(batch => 
          !['SOLD', 'EXPIRED', 'RECALLED'].includes(batch.status || '')
        ).length;
        
        setStats({
          totalProducts: products.length,
          totalBatches: batches.length,
          expiringBatches: expiringBatches.length,
          activeBatches: activeBatchesCount
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchWeatherData = async () => {
      try {
        setWeatherLoading(true);
        setWeatherError('');
        
        let weatherData: ApiWeatherData;
        
        // Try to get weather data based on user's stored coordinates
        if (user?.locationCoordinates) {
          const coords = weatherService.parseCoordinates(user.locationCoordinates);
          
          if (coords) {
            weatherData = await weatherService.getWeatherByCoordinates(coords.lat, coords.lon);
          } else {
            // If coordinates are invalid, fall back to current location
            weatherData = await weatherService.getCurrentLocationWeather();
          }
        } else {
          // If no coordinates are stored, use current location
          weatherData = await weatherService.getCurrentLocationWeather();
        }
        
        // Update state with the fetched weather data
        setWeatherData({
          temperature: weatherData.current.temperature,
          humidity: weatherData.current.humidity,
          condition: weatherData.current.condition,
          icon: weatherData.current.icon,
          location: weatherData.current.location,
          forecast: weatherData.forecast
        });
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setWeatherError('Could not load weather data. Please check your location settings.');
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchData();
    fetchWeatherData();
    
    // In a real app, you would fetch AI recommendations from backend here
    // fetchCropRecommendations();
    
    // In a real app, you would fetch soil sensor data here
    // fetchSoilData();
    
  }, [user?.locationCoordinates]);

  // Use OpenWeather icons
  const getWeatherIcon = (iconCode: string) => {
    const iconUrl = weatherService.getIconUrl(iconCode);
    return <img src={iconUrl} alt="Weather icon" style={{ width: '50px', height: '50px' }} />;
  };
  
  // Fallback icon when we don't have an OpenWeather icon code
  const getFallbackWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        );
      case 'rain':
      case 'rainy':
      case 'drizzle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="16" y1="13" x2="16" y2="21"></line>
            <line x1="8" y1="13" x2="8" y2="21"></line>
            <line x1="12" y1="15" x2="12" y2="23"></line>
            <path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
          </svg>
        );
      case 'clouds':
      case 'cloudy':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v2"></path>
            <path d="M16 3v2"></path>
            <path d="M20.5 17.5L19 19"></path>
            <path d="M3.5 17.5L5 19"></path>
            <path d="M3.5 6.5L5 5"></path>
            <path d="M20.5 6.5L19 5"></path>
            <path d="M4 12H2"></path>
            <path d="M12 2v2"></path>
            <path d="M12 8a4 4 0 0 0-4 4"></path>
            <path d="M12 8a4 4 0 0 1 0 8h-1"></path>
            <path d="M17 17a5 5 0 0 0-10 0"></path>
            <path d="M16 12a4 4 0 0 1 0 8H7"></path>
          </svg>
        );
    }
  };

  return (
    <div className="farmer-dashboard">
      {error && (
        <div className="alert alert-danger">
          <div className="alert-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="alert-content">
            {error}
          </div>
        </div>
      )}

      {/* Main stats */}
      {isLoading ? (
        <div className="stats-grid">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="stat-card loading">
              <div className="stat-card-body">
                <div className="loading-rect loading-icon"></div>
                <div className="loading-rect loading-title"></div>
                <div className="loading-rect loading-value"></div>
              </div>
              <div className="stat-card-footer">
                <div className="loading-rect loading-footer"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
              <div className="stat-card-value">{stats.totalProducts}</div>
            </div>
            <Link to="/products" className="stat-card-footer">
              View all products
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
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
              <div className="stat-card-title">Active Batches</div>
              <div className="stat-card-value">{stats.activeBatches}</div>
            </div>
            <Link to="/batches?status=active" className="stat-card-footer">
              View active batches
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-body">
              <div className="stat-card-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="stat-card-title">Expiring Soon</div>
              <div className="stat-card-value">{stats.expiringBatches}</div>
            </div>
            <Link to="/batches?filter=expiring" className="stat-card-footer">
              View expiring batches
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          </div>
          
          <div className="stat-card">
            <div className="stat-card-body">
              <div className="stat-card-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <div className="stat-card-title">Analytics</div>
              <div className="stat-card-value">View Reports</div>
            </div>
            <Link to="/analytics" className="stat-card-footer">
              Go to analytics
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      )}

      {/* Weather and Crop Recommendations Section */}
      <div className="dashboard-grid">
        {/* Weather Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Weather Forecast</h2>
            <div className="card-subtitle">
              {weatherLoading 
                ? 'Loading weather data...' 
                : `${weatherData.location} ${user?.locationCoordinates ? '(Farm location)' : '(Current location)'}`}
            </div>
          </div>
          
          {weatherError && (
            <div className="weather-error">
              <p>{weatherError}</p>
              <button 
                className="btn btn-outlined btn-sm mt-2"
                onClick={() => {
                  weatherService.getCurrentLocationWeather()
                    .then(data => {
                      setWeatherData({
                        temperature: data.current.temperature,
                        humidity: data.current.humidity,
                        condition: data.current.condition,
                        icon: data.current.icon,
                        location: data.current.location,
                        forecast: data.forecast
                      });
                      setWeatherError('');
                    })
                    .catch(err => {
                      console.error('Error retrying weather fetch:', err);
                      setWeatherError('Could not fetch weather data. Please try again later.');
                    });
                }}
              >
                Retry
              </button>
            </div>
          )}
          
          {!weatherError && (
            <div className="weather-content">
              {weatherLoading ? (
                <div className="weather-loading">
                  <div className="spinner"></div>
                  <p>Loading weather data...</p>
                </div>
              ) : (
                <>
                  <div className="current-weather">
                    <div className="weather-icon" style={{ color: '#3b82f6' }}>
                      {weatherData.icon ? getWeatherIcon(weatherData.icon) : getFallbackWeatherIcon(weatherData.condition)}
                    </div>
                    <div className="weather-details">
                      <div className="weather-temp">{weatherData.temperature}°C</div>
                      <div className="weather-condition">{weatherData.condition}</div>
                      <div className="weather-humidity">Humidity: {weatherData.humidity}%</div>
                    </div>
                  </div>
                  
                  <div className="weather-forecast">
                    {weatherData.forecast.map((day, index) => (
                      <div key={index} className="forecast-day">
                        <div className="forecast-day-name">{day.day}</div>
                        <div className="forecast-date">{day.date}</div>
                        <div className="forecast-icon">
                          {day.icon ? getWeatherIcon(day.icon) : getFallbackWeatherIcon(day.condition)}
                        </div>
                        <div className="forecast-temp">{day.temp}°C</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* AI Crop Recommendations */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">AI Crop Recommendations</h2>
            <div className="card-subtitle">Based on your soil, climate, and market trends</div>
          </div>
          
          <div className="recommendations-content">
            {cropRecommendations.map((crop, index) => (
              <div key={index} className="recommendation-item">
                <div className="recommendation-header">
                  <h3 className="recommendation-title">{crop.cropName}</h3>
                  <div className="recommendation-confidence">
                    <div className="confidence-badge" style={{
                      backgroundColor: crop.confidence > 90 ? '#dcfce7' : crop.confidence > 80 ? '#fef9c3' : '#fee2e2',
                      color: crop.confidence > 90 ? '#166534' : crop.confidence > 80 ? '#854d0e' : '#991b1b'
                    }}>
                      {crop.confidence}% match
                    </div>
                  </div>
                </div>
                
                <div className="recommendation-details">
                  <div className="detail-item">
                    <span className="detail-label">Expected Yield:</span>
                    <span className="detail-value">{crop.expectedYield}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Planting Window:</span>
                    <span className="detail-value">{crop.plantingWindow}</span>
                  </div>
                </div>
                
                <button className="btn btn-outlined btn-sm">View Detailed Analysis</button>
              </div>
            ))}
            
            <div className="recommendation-actions">
              <Link to="/crop-planning" className="btn btn-primary">
                Plan Next Season
              </Link>
            </div>
          </div>
        </div>

        
        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
            <div className="card-subtitle">Latest events from your farm</div>
          </div>
          
          <div className="activities-list">
            <div className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--primary-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-title">New batch created</div>
                <div className="activity-meta">
                  <span>Batch #APL-20250418-001</span>
                  <span>•</span>
                  <span>Apple Farm</span>
                </div>
              </div>
              <div className="activity-time">5m ago</div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-title">Batch shipped</div>
                <div className="activity-meta">
                  <span>Batch #ORA-20250417-002</span>
                  <span>•</span>
                  <span>Citrus Grove</span>
                </div>
              </div>
              <div className="activity-time">2h ago</div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-title">Quality check passed</div>
                <div className="activity-meta">
                  <span>Batch #BAN-20250417-003</span>
                  <span>•</span>
                  <span>Tropical Farms</span>
                </div>
              </div>
              <div className="activity-time">1d ago</div>
            </div>
            
            <div className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
              </div>
              <div className="activity-content">
                <div className="activity-title">Soil analysis completed</div>
                <div className="activity-meta">
                  <span>Field #3</span>
                  <span>•</span>
                  <span>pH: 6.8, Moisture: 78%</span>
                </div>
              </div>
              <div className="activity-time">2d ago</div>
            </div>
          </div>
          
          <div className="card-footer">
            <Link to="/activities" className="btn btn-outlined">View All Activities</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;