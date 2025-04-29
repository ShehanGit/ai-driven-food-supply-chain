// src/pages/auth/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
// Import the logos and images
import logo from '../../../src/assets/images/herosection/logo2.png';
import registerImage from '../../../src/assets/images/herosection/register2.jpg';
// Import CSS

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'FARMER', // Default role
    companyName: '',
    companyAddress: '',
    locationCoordinates: '7.8731,80.7718', // Default coordinates (central Sri Lanka)
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSubmitted, setRegistrationSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Store the registration data in localStorage for future reference
      // In a real application, you might send this to a database
      const { confirmPassword, ...registrationData } = formData;
      localStorage.setItem('pendingRegistration', JSON.stringify(registrationData));
      
      // Log the data for demonstration purposes
      console.log('Registration data saved:', registrationData);
      
      // Show the approval message instead of calling register()
      setTimeout(() => {
        setIsLoading(false);
        setRegistrationSubmitted(true);
      }, 1500);
      
      // Note: We're not calling the register function anymore
      // await register(registerData);
      // navigate('/dashboard');
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrors({
        form: 'Something went wrong. Please try again later.'
      });
      setIsLoading(false);
    }
  };

  // If registration is submitted, show the approval message
  if (registrationSubmitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-form-section approval-message">
            <div className="auth-header">
              <div className="auth-logo">
                <img src={logo} alt="SynerHarvest Logo" className="logo-img" />
              </div>
              <div className="success-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h1 className="auth-title">Registration Submitted</h1>
              <p className="auth-subtitle">
                Thank you for registering with SynerHarvest!
              </p>
            </div>
            
            <div className="approval-card">
              <div className="approval-content">
                <p>Your registration is pending admin approval. This usually takes 24-48 hours.</p>
                <p>Once approved, you will receive an email notification at <strong>{formData.email}</strong> with instructions to access your account.</p>
                <p>If you have any questions, please contact our support team.</p>
              </div>
            </div>
            
            <div className="auth-footer">
              <Link to="/" className="auth-submit">
                Return to Home
              </Link>
              <p className="auth-footer-text mt-4">
                Already have an account? <Link to="/login" className="auth-footer-link">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card split-layout">
        {/* Image Section */}
        <div className="auth-image-section" style={{ backgroundImage: `url(${registerImage})` }}>
          <div className="auth-image-overlay"></div>
          <div className="auth-image-content">
            <h2>Join SynerHarvest</h2>
            <p>Create your account to connect with farmers, distributors, and retailers across Sri Lanka's agricultural ecosystem.</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="auth-form-section">
          <div className="auth-header">
            <div className="auth-logo">
              <img src={logo} alt="SynerHarvest Logo" className="logo-img" />
            </div>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">
              Or <Link to="/login">sign in to your existing account</Link>
            </p>
          </div>

          {errors.form && (
            <div className="alert alert-danger">
              <div className="alert-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div className="alert-content">{errors.form}</div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="register-grid">
              {/* Username */}
              <div className="auth-input-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Choose a username"
                  className={`auth-input ${errors.username ? 'error' : ''}`}
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>

              {/* Email */}
              <div className="auth-input-group">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className={`auth-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              {/* First Name */}
              <div className="auth-input-group">
                <label htmlFor="firstName">First name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Your first name"
                  className={`auth-input ${errors.firstName ? 'error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                {errors.firstName && <div className="error-message">{errors.firstName}</div>}
              </div>

              {/* Last Name */}
              <div className="auth-input-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Your last name"
                  className={`auth-input ${errors.lastName ? 'error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
                {errors.lastName && <div className="error-message">{errors.lastName}</div>}
              </div>

              {/* Password */}
              <div className="auth-input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Min. 8 characters"
                  className={`auth-input ${errors.password ? 'error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>

              {/* Confirm Password */}
              <div className="auth-input-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>

              {/* Phone Number */}
              <div className="auth-input-group">
                <label htmlFor="phoneNumber">Phone number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Optional"
                  className="auth-input"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Role */}
              <div className="auth-input-group">
                <label htmlFor="role">Role</label>
                <select
                  id="role"
                  name="role"
                  className={`auth-input ${errors.role ? 'error' : ''}`}
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="FARMER">Farmer</option>
                  <option value="DISTRIBUTOR">Distributor</option>
                  <option value="RETAILER">Retailer</option>
                  <option value="CONSUMER">Consumer</option>
                </select>
                {errors.role && <div className="error-message">{errors.role}</div>}
              </div>

              {/* Company Name */}
              <div className="auth-input-group register-full-width">
                <label htmlFor="companyName">Company name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  placeholder="Optional"
                  className="auth-input"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>

              {/* Company Address */}
              <div className="auth-input-group register-full-width">
                <label htmlFor="companyAddress">Company address</label>
                <input
                  type="text"
                  id="companyAddress"
                  name="companyAddress"
                  placeholder="Optional"
                  className="auth-input"
                  value={formData.companyAddress}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="auth-loading"></span>
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Already have an account? <Link to="/login" className="auth-footer-link">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;