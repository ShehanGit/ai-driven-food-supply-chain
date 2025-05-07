// src/pages/home/HomePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Fix your imports by adding one more "../" to go back an additional directory level
import farmerHeroImage from '../../assets/images/herosection/hero5.jpg';
import distributorImage from '../../assets/images/herosection/home7.jpg';
import retailerImage from '../../assets/images/herosection/home2.jpg';
import consumerImage from '../../assets/images/herosection/home5.jpg';

import hero8 from '../../assets/images/herosection/hero8.jpg';
import hero14 from '../../assets/images/herosection/hero14.jpg';
import hero10 from '../../assets/images/herosection/hero10.jpg';
import hero11 from '../../assets/images/herosection/hero11.jpg';
import hero12 from '../../assets/images/herosection/hero12.jpg';
import hero13 from '../../assets/images/herosection/hero13.jpg';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('farmer');
  const [isVisible, setIsVisible] = useState({
    features: false,
    howItWorks: false,
    roles: false,
    stats: false,
    testimonials: false,
    impact: false,
    casestudy: false,
    faq: false,
  });
  
  const [activeFaqItem, setActiveFaqItem] = useState<number | null>(null);
  const statsCountersRef = useRef<HTMLDivElement>(null);
  const [hasCountedStats, setHasCountedStats] = useState(false);

  // Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          
          // Start counting animation when stats section is visible
          if (id === 'stats' && !hasCountedStats) {
            startCountingAnimation();
            setHasCountedStats(true);
          }
          
          setIsVisible((prev) => ({ ...prev, [id]: true }));
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.animate-on-scroll');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [hasCountedStats]);

  // Counter animation for statistics
  const startCountingAnimation = () => {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
      const targetValue = parseInt(counter.textContent || '0');
      const increment = Math.ceil(targetValue / speed);
      let currentValue = 0;

      const updateCount = () => {
        if (currentValue < targetValue) {
          currentValue += increment;
          if (currentValue > targetValue) {
            currentValue = targetValue;
          }
          counter.textContent = currentValue.toString();
          requestAnimationFrame(updateCount);
        }
      };

      updateCount();
    });
  };

  // Handle FAQ item click
  const toggleFaqItem = (index: number) => {
    setActiveFaqItem(activeFaqItem === index ? null : index);
  };

  // Data for the testimonials slider
  const testimonials = [
    {
      quote: "SynerHarvest has revolutionized our farm operations. We've reduced waste by 35% and increased our profit margins significantly.",
      author: "Sarah Johnson",
      position: "Operations Director",
      company: "Green Valley Farms",
      avatar: "/images/testimonial-1.jpg"
    },
    {
      quote: "The transparency SynerHarvest provides has been a game-changer for our business. Our customers trust our products more than ever.",
      author: "Michael Chen",
      position: "CEO",
      company: "FreshDirect Distributors",
      avatar: "/images/testimonial-2.jpg"
    },
    {
      quote: "As a retailer, the ability to track products through the entire supply chain has improved our inventory management and customer satisfaction.",
      author: "Elena Rodriguez",
      position: "Supply Chain Manager",
      company: "Organic Market Group",
      avatar: "/images/testimonial-3.jpg"
    }
  ];

  // Data for the FAQ section
  const faqs = [
    {
      question: "How does SynerHarvest ensure data integrity?",
      answer: "SynerHarvest uses technology to create immutable records of every transaction and event in the supply chain. Once data is recorded, it cannot be altered or deleted, ensuring complete transparency and traceability."
    },
    {
      question: "Can SynerHarvest integrate with our existing systems?",
      answer: "Absolutely! SynerHarvest is designed with open APIs and flexible integration capabilities that allow it to work seamlessly with your existing ERP, inventory management, or farm management systems."
    },
    {
      question: "How does the AI-driven forecasting work?",
      answer: "Our AI algorithms analyze historical sales data, seasonal trends, weather patterns, and market conditions to predict future demand with high accuracy. This helps farmers plan production, distributors optimize logistics, and retailers manage inventory more efficiently."
    },
    {
      question: "Is SynerHarvest suitable for small-scale farmers?",
      answer: "Yes! We offer flexible pricing plans that cater to operations of all sizes. Small-scale farmers can benefit from simplified data entry, QR code generation, and marketplace access without needing extensive technical knowledge."
    },
    {
      question: "How does the product tracking work for consumers?",
      answer: "Each product batch receives a unique QR code that consumers can scan with their smartphones. This opens a web page showing the complete journey of that product – from the farm where it was grown to the store where it was purchased, including all quality checks and transport conditions."
    }
  ];

  return (
    <div className="home-page">
     {/* Hero Section with Background Slideshow */}
<section className="hero-section">
  {/* Background Slideshow */}
  <div className="hero-slideshow">
    <div className="slideshow-image slideshow-image-1" style={{ backgroundImage: `url(${hero13})` }}></div>
    <div className="slideshow-image slideshow-image-2" style={{ backgroundImage: `url(${hero10})` }}></div>
    <div className="slideshow-image slideshow-image-3" style={{ backgroundImage: `url(${hero12})` }}></div>
    <div className="slideshow-image slideshow-image-4" style={{ backgroundImage: `url(${hero14})` }}></div>
    <div className="slideshow-image slideshow-image-5" style={{ backgroundImage: `url(${hero8})` }}></div>
    <div className="slideshow-image slideshow-image-6" style={{ backgroundImage: `url(${hero11})` }}></div>
    <div className="slideshow-overlay"></div>
  </div>
  
  <div className="container hero-container">
    <div className="hero-content">
      <div className="hero-badge">
        <span className="ai-icon">✦</span> AI-Powered Platform
      </div>
      
      <h1 className="hero-title animate-in">
        Farm to Fork <span className="hero-highlight">Transparency</span> with
        <span className="gradient-text"> SynerHarvest</span>
      </h1>
      
      <p className="hero-subtitle animate-in-delay-1">
        Our integrated platform combines traceability, IoT monitoring,
        and AI-driven forecasting to revolutionize food supply chain management.
      </p>
      
      <div className="hero-stats animate-in-delay-2">
        <div className="hero-stat">
          <div className="hero-stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <div className="hero-stat-content">
            <span className="hero-stat-number">30%</span>
            <span className="hero-stat-text">Less Food Waste</span>
          </div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
          </div>
          <div className="hero-stat-content">
            <span className="hero-stat-number">45%</span>
            <span className="hero-stat-text">Increased Efficiency</span>
          </div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div className="hero-stat-content">
            <span className="hero-stat-number">95%</span>
            <span className="hero-stat-text">Traceability</span>
          </div>
        </div>
      </div>
      
      <div className="hero-actions animate-in-delay-3">
        <Link to="/register" className="btn btn-primary btn-lg with-icon">
          <span>Get Started</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
        <Link to="/tracking" className="btn btn-outlined btn-lg with-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          <span>Track a Product</span>
        </Link>
      </div>
    </div>
    
    <div className="hero-image animate-in-right">
      <div className="hero-feature-card">
        <h3>Complete Traceability</h3>
        <p>Track your products from farm to table with real-time data and complete transparency.</p>
        <div className="hero-feature-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
          </svg>
        </div>
      </div>
    </div>
  </div>
  
  <div className="hero-wave">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
      <path d="M0,0 C240,95 480,80 720,40 C960,0 1200,20 1440,60 L1440,100 L0,100 Z" fill="#ffffff"></path>
    </svg>
  </div>
</section>

      {/* Features Section with Cards */}
      <section id="features" className={`features-section animate-on-scroll ${isVisible.features ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Platform Features</span>
            <h2 className="section-title">Next-Gen Supply Chain Management</h2>
            <p className="section-subtitle">
              Our integrated platform combines blockchain, IoT, and AI to revolutionize your food supply chain
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--primary-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="feature-title">QR Traceability</h3>
              <p className="feature-description">
                Immutable record of every product's journey from farm to consumer with tamper-proof verification.
              </p>
              <Link to="/features/traceability" className="feature-link">
                Learn more 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary-color)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              </div>
              <h3 className="feature-title">IoT Monitoring</h3>
              <p className="feature-description">
                Real-time monitoring of temperature, humidity, and other critical conditions throughout the supply chain.
              </p>
              <Link to="/features/iot-monitoring" className="feature-link">
                Learn more 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"></polyline>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                </svg>
              </div>
              <h3 className="feature-title">AI-Driven Forecasting</h3>
              <p className="feature-description">
                Predictive analytics that forecast demand, optimize inventory, and reduce waste with machine learning.
              </p>
              <Link to="/features/ai-forecasting" className="feature-link">
                Learn more 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <h3 className="feature-title">Real-Time Tracking</h3>
              <p className="feature-description">
                Track your products in real-time with precise location data and status updates throughout the journey.
              </p>
              <Link to="/features/real-time-tracking" className="feature-link">
                Learn more 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="feature-title">Multi-Stakeholder Platform</h3>
              <p className="feature-description">
                Dedicated interfaces for farmers, distributors, retailers, and consumers - all connected in one ecosystem.
              </p>
              <Link to="/features/multi-stakeholder" className="feature-link">
                Learn more 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#ec4899' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Consumer Transparency</h3>
              <p className="feature-description">
                Let your customers scan QR codes to view the complete journey of their food, building trust and loyalty.
              </p>
              <Link to="/features/consumer-transparency" className="feature-link">
                Learn more 
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section with Animated Steps */}
      <section id="howItWorks" className={`how-it-works-section animate-on-scroll ${isVisible.howItWorks ? 'visible' : ''}`}>
        <div className="section-background">
          <div className="section-sphere section-sphere-1"></div>
          <div className="section-sphere section-sphere-2"></div>
          <div className="section-sphere section-sphere-3"></div>
        </div>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Simple Process</span>
            <h2 className="section-title">How SynerHarvest Works</h2>
            <p className="section-subtitle">Our platform streamlines your supply chain in four simple steps</p>
          </div>
          <div className="steps-container">
            <div className="steps-connection-line"></div>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3 className="step-title">Register & Create Products</h3>
                  <p className="step-description">Sign up as a farmer, distributor, or retailer and add your products with detailed attributes.</p>
                  <div className="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="8.5" cy="7" r="4"></circle>
                      <line x1="20" y1="8" x2="20" y2="14"></line>
                      <line x1="23" y1="11" x2="17" y2="11"></line>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3 className="step-title">Track & Monitor</h3>
                  <p className="step-description">Record critical data at each stage of the supply chain. Our IoT sensors automatically capture environmental conditions.</p>
                  <div className="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3 className="step-title">Analyze & Optimize</h3>
                  <p className="step-description">Our AI analyzes data to forecast demand, optimize inventory, and provide actionable insights to reduce waste.</p>
                  <div className="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3 className="step-title">Share & Verify</h3>
                  <p className="step-description">Generate QR codes that consumers can scan to verify the authenticity and journey of their food products.</p>
                  <div className="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="steps-cta">
            <Link to="/how-it-works" className="btn btn-primary">
              Learn More About Our Process
            </Link>
          </div>
        </div>
      </section>

      {/* User Roles Section with Tab Navigation */}
      <section id="roles" className={`roles-section animate-on-scroll ${isVisible.roles ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">For Everyone in the Chain</span>
            <h2 className="section-title">Tailored Solutions for Every Stakeholder</h2>
            <p className="section-subtitle">
              SynerHarvest provides specialized tools for every participant in the food supply chain
            </p>
          </div>
          
          <div className="roles-tabs">
            <div className="roles-tab-navigation">
              <button 
                className={`role-tab-button ${activeTab === 'farmer' ? 'active' : ''}`} 
                onClick={() => setActiveTab('farmer')}
              >
                <div className="role-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6l9 4 9-4"></path>
                    <path d="M21 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6"></path>
                    <circle cx="12" cy="15" r="2"></circle>
                  </svg>
                </div>
                <span>Farmers</span>
              </button>
              <button 
                className={`role-tab-button ${activeTab === 'distributor' ? 'active' : ''}`}
                onClick={() => setActiveTab('distributor')}
              >
                <div className="role-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <span>Distributors</span>
              </button>
              <button 
                className={`role-tab-button ${activeTab === 'retailer' ? 'active' : ''}`}
                onClick={() => setActiveTab('retailer')}
              >
                <div className="role-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3h18v18H3z"></path>
                    <path d="M21 9H3"></path>
                    <path d="M21 15H3"></path>
                    <path d="M12 3v18"></path>
                  </svg>
                </div>
                <span>Retailers</span>
              </button>
              <button 
                className={`role-tab-button ${activeTab === 'consumer' ? 'active' : ''}`}
                onClick={() => setActiveTab('consumer')}
              >
                <div className="role-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span>Consumers</span>
              </button>
            </div>
            
            <div className="roles-tab-content">
              {activeTab === 'farmer' && (
                <div className="role-content">
                  <div className="role-image">
                  <img src={farmerHeroImage} alt="Farmer Dashboard" />                  </div>
                  <div className="role-description">
                    <h3>For Farmers</h3>
                    <p>Digitize your farming operations and connect directly with distributors and retailers.</p>
                    <ul className="role-features">
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Track crop growth and harvest data</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Record farming practices and certifications</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Generate QR codes for batch traceability</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Receive AI-driven planting recommendations</span>
                      </li>
                    </ul>
                    <Link to="/farmers" className="btn btn-primary">Learn More</Link>
                  </div>
                </div>
              )}
              
              {activeTab === 'distributor' && (
                <div className="role-content">
                  <div className="role-image">
                  <img src={distributorImage} alt="Distributor Dashboard" />                  </div>
                  <div className="role-description">
                    <h3>For Distributors</h3>
                    <p>Optimize your logistics operations and maintain product quality throughout transport.</p>
                    <ul className="role-features">
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Monitor real-time temperature and humidity</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Optimize routes with AI-powered logistics</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Track chain of custody with QR</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Receive alerts for condition deviations</span>
                      </li>
                    </ul>
                    <Link to="/distributors" className="btn btn-primary">Learn More</Link>
                  </div>
                </div>
              )}
              
              {activeTab === 'retailer' && (
                <div className="role-content">
                  <div className="role-image">
                  <img src={retailerImage} alt="Retailer Dashboard" />
                  </div>
                  <div className="role-description">
                    <h3>For Retailers</h3>
                    <p>Manage inventory more efficiently and showcase product origins to your customers.</p>
                    <ul className="role-features">
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Verify product authenticity and quality</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Display product journey for consumers</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Get AI-driven inventory recommendations</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Reduce waste with expiration monitoring</span>
                      </li>
                    </ul>
                    <Link to="/retailers" className="btn btn-primary">Learn More</Link>
                  </div>
                </div>
              )}
              
              {activeTab === 'consumer' && (
                <div className="role-content">
                  <div className="role-image">
                  <img src={consumerImage} alt="Consumer App" />
                  </div>
                  <div className="role-description">
                    <h3>For Consumers</h3>
                    <p>Access complete transparency about the food you purchase and consume.</p>
                    <ul className="role-features">
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Scan QR codes to view product journey</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Verify authenticity and farming practices</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>See environmental impact metrics</span>
                      </li>
                      <li>
                        <span className="check-icon">✓</span>
                        <span>Connect directly with producers</span>
                      </li>
                    </ul>
                    <Link to="/consumers" className="btn btn-primary">Learn More</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section id="stats" className={`stats-section animate-on-scroll ${isVisible.stats ? 'visible' : ''}`} ref={statsCountersRef}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Achievements</span>
            <h2 className="section-title">Our Impact</h2>
            <p className="section-subtitle">Real results from businesses using SynerHarvest</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number"><span className="counter">30</span>%</div>
                <div className="stat-label">Reduction in Food Waste</div>
                <div className="stat-description">Our predictive analytics help prevent spoilage and optimize inventory management.</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4"></path>
                  <path d="M12 18v4"></path>
                  <path d="m4.93 4.93 2.83 2.83"></path>
                  <path d="m16.24 16.24 2.83 2.83"></path>
                  <path d="M2 12h4"></path>
                  <path d="M18 12h4"></path>
                  <path d="m4.93 19.07 2.83-2.83"></path>
                  <path d="m16.24 7.76 2.83-2.83"></path>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number"><span className="counter">95</span>%</div>
                <div className="stat-label">Transparency</div>
                <div className="stat-description">End-to-end visibility from farm to consumer.</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number">$<span className="counter">25</span>M+</div>
                <div className="stat-label">Cost Savings</div>
                <div className="stat-description">Cumulative cost savings achieved by our partners through optimized operations.</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="12" x2="2" y2="12"></line>
                  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                  <line x1="6" y1="16" x2="6.01" y2="16"></line>
                  <line x1="10" y1="16" x2="10.01" y2="16"></line>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number"><span className="counter">40</span>%</div>
                <div className="stat-label">Increase in Consumer Trust</div>
                <div className="stat-description">Enhanced brand loyalty through transparent product information.</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4"></path>
                  <path d="M12 18v4"></path>
                  <path d="m4.93 4.93 2.83 2.83"></path>
                  <path d="m16.24 16.24 2.83 2.83"></path>
                  <path d="M2 12h4"></path>
                  <path d="M18 12h4"></path>
                  <path d="m4.93 19.07 2.83-2.83"></path>
                  <path d="m16.24 7.76 2.83-2.83"></path>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-number"><span className="counter">80</span>%</div>
                <div className="stat-label">AI-Driven Forecasting</div>
                <div className="stat-description">Predictive analytics that forecast demand, optimize inventory</div>
              </div>
            </div>
            
          </div>
        </div>




        
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`testimonials-section animate-on-scroll ${isVisible.testimonials ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Success Stories</span>
            <h2 className="section-title">What Our Clients Say</h2>
            <p className="section-subtitle">Real feedback from SynerHarvest users across the supply chain</p>
          </div>
          
          <div className="testimonials-slider">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="testimonial-quote">
                    <svg width="42" height="36" viewBox="0 0 42 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.25 0C8.26631 0 5.40483 1.18999 3.2955 3.2955C1.18999 5.40483 0 8.26631 0 11.25C0 14.2337 1.18999 17.0952 3.2955 19.2045C5.40483 21.31 8.26631 22.5 11.25 22.5C11.25 28.0967 9.18 31.5 4.5 33.75C6.75 34.9867 9.36 36 12.375 36C15.3587 36 18.2202 34.81 20.3295 32.7045C22.43 30.5952 23.625 27.7337 23.625 24.75V11.25C23.6159 8.27379 22.4246 5.42211 20.3234 3.32638C18.2313 1.22275 15.3763 0.0309375 11.25 0ZM29.625 0C26.6413 0 23.7798 1.18999 21.6705 3.2955C19.57 5.40483 18.375 8.26631 18.375 11.25C18.375 14.2337 19.57 17.0952 21.6705 19.2045C23.7798 21.31 26.6413 22.5 29.625 22.5C29.625 28.0967 27.555 31.5 22.875 33.75C25.125 34.9867 27.735 36 30.75 36C33.7337 36 36.5952 34.81 38.7045 32.7045C40.81 30.5952 42 27.7337 42 24.75V11.25C41.9909 8.27379 40.7996 5.42211 38.6984 3.32638C36.6063 1.22275 33.7513 0.0309375 29.625 0Z" fill="rgba(34, 197, 94, 0.1)"/>
                    </svg>
                    <p>{testimonial.quote}</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      {/* <img src={testimonial.avatar} alt={testimonial.author} /> */}
                    </div>
                    <div className="testimonial-info">
                      <h4>{testimonial.author}</h4>
                      <p>{testimonial.position}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="testimonials-cta">
            <Link to="/case-studies" className="btn btn-outlined">
              Read More Case Studies
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section id="faq" className={`faq-section animate-on-scroll ${isVisible.faq ? 'visible' : ''}`}>
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Questions & Answers</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">Get answers to common questions about our platform</p>
          </div>
          
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className={`faq-item ${activeFaqItem === index ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaqItem(index)}>
                  <h3>{faq.question}</h3>
                  <div className="faq-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {activeFaqItem === index ? 
                        <line x1="5" y1="12" x2="19" y2="12"></line> :
                        <>
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </>
                      }
                    </svg>
                  </div>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="faq-more-questions">
            <p>Have more questions? We're here to help!</p>
            <Link to="/contact" className="btn btn-primary">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Food Supply Chain?</h2>
            <p>Join hundreds of businesses already using SynerHarvest to improve transparency, reduce waste, and build consumer trust.</p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started for Free</Link>
              <Link to="/demo" className="btn btn-outlined btn-lg">Request a Demo</Link>
            </div>
          </div>
        </div>
        <div className="cta-wave">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d=""></path>
          </svg>
        </div>
      </section>
    </div>
  );
};

export default HomePage;