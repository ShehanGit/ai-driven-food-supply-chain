// src/pages/auth/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

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
      const { confirmPassword, ...registerData } = formData;
      
      // Log the data we're sending to help debug API issues
      console.log('Sending registration data:', registerData);
      
      await register(registerData);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err.response?.data);
      
      // Extract validation errors if available
      const errorData = err.response?.data;
      
      if (errorData?.errors) {
        // Set individual field errors
        setErrors({
          ...errorData.errors,
          form: errorData.message || 'Registration failed. Please check the form for errors.'
        });
        
        // Log specific validation errors to help debug
        Object.entries(errorData.errors).forEach(([field, message]) => {
          console.log(`Validation error for ${field}: ${message}`);
        });
      } else {
        // Generic error handling
        setErrors({
          form: errorData?.message || err.message || 'Registration failed. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/logo.svg" alt="SynerHarvest Logo" />
          </div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Or <Link to="/login">sign in to your existing account</Link>
          </p>
        </div>

        {errors.form && (
          <div className="alert alert-danger mx-6 mt-4">
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
                className="auth-input"
                value={formData.companyAddress}
                onChange={handleChange}
              />
            </div>

            {/* Removed location coordinates field as requested */}
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
  );
};

export default RegisterPage;