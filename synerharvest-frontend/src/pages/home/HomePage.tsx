// src/pages/home/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              AI-Driven Food Supply Chain Management
            </h1>
            <p className="hero-subtitle">
              Track your food from farm to fork with blockchain transparency, 
              IoT monitoring, and AI-powered forecasting.
            </p>
            <div className="hero-actions">
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link to="/tracking" className="btn btn-outlined btn-lg">
                Track a Product
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/hero-image.svg" alt="Food Supply Chain Management" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Everything you need to manage your food supply chain effectively
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--primary-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3 className="feature-title">End-to-End Traceability</h3>
              <p className="feature-description">
                Track products from farm to consumer with blockchain-verified data for complete transparency.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h3 className="feature-title">Real-time Monitoring</h3>
              <p className="feature-description">
                Monitor temperature, humidity, and other conditions in real-time with IoT sensors.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <polyline points="1 20 1 14 7 14"></polyline>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                </svg>
              </div>
              <h3 className="feature-title">Supply Chain Optimization</h3>
              <p className="feature-description">
                Optimize routes, inventory, and delivery schedules with AI-powered recommendations.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              // src/pages/home/HomePage.tsx (continued)
              <h3 className="feature-title">Demand Forecasting</h3>
              <p className="feature-description">
                Predict demand with machine learning models that analyze historical data and market trends.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"></path>
                  <polyline points="15 3 15 9 21 9"></polyline>
                </svg>
              </div>
              <h3 className="feature-title">Quality Assurance</h3>
              <p className="feature-description">
                Ensure food quality and safety with automated checks and compliance management.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <h3 className="feature-title">Analytics Dashboard</h3>
              <p className="feature-description">
                Gain insights with customizable dashboards that visualize your supply chain metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              SynerHarvest streamlines your food supply chain in four simple steps
            </p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3 className="step-title">Register & Create Products</h3>
              <p className="step-description">
                Sign up as a farmer, distributor, or retailer and add your products to the system.
              </p>
            </div>

            <div className="step-connector"></div>

            <div className="step">
              <div className="step-number">2</div>
              <h3 className="step-title">Generate Batch QR Codes</h3>
              <p className="step-description">
                Create batches for your products with unique QR codes for tracking throughout the supply chain.
              </p>
            </div>

            <div className="step-connector"></div>

            <div className="step">
              <div className="step-number">3</div>
              <h3 className="step-title">Record Supply Chain Events</h3>
              <p className="step-description">
                Log harvests, shipments, quality checks, and other events as products move through the chain.
              </p>
            </div>

            <div className="step-connector"></div>

            <div className="step">
              <div className="step-number">4</div>
              <h3 className="step-title">Track & Analyze</h3>
              <p className="step-description">
                Monitor your supply chain in real-time and optimize operations with AI-powered insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Solutions Section */}
      <section className="roles-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Role-Based Solutions</h2>
            <p className="section-subtitle">
              Tailored features for every participant in the food supply chain
            </p>
          </div>

          <div className="tabs-container">
            <div className="tabs">
              <button className="tab active" data-role="farmer">Farmers</button>
              <button className="tab" data-role="distributor">Distributors</button>
              <button className="tab" data-role="retailer">Retailers</button>
              <button className="tab" data-role="consumer">Consumers</button>
            </div>

            <div className="tab-content active" id="farmer-content">
              <div className="tab-content-grid">
                <div className="tab-content-text">
                  <h3>For Farmers</h3>
                  <ul className="feature-list">
                    <li>Create and manage product batches</li>
                    <li>Record harvest data and growing conditions</li>
                    <li>Generate QR codes for traceability</li>
                    <li>AI-powered planting recommendations</li>
                    <li>Real-time storage condition monitoring</li>
                    <li>Demand forecasting and price optimization</li>
                  </ul>
                  <Link to="/register" className="btn btn-primary">Register as a Farmer</Link>
                </div>
                <div className="tab-content-image">
                  <img src="/images/farmer.svg" alt="Farmer using SynerHarvest" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to transform your food supply chain?</h2>
            <p className="cta-description">
              Join SynerHarvest today and bring transparency, efficiency, and intelligence to your operations.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
              <Link to="/contact" className="btn btn-outlined btn-lg">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;