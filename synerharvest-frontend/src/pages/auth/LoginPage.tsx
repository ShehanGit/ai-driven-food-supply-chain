// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
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
          <h1 className="auth-title">Sign in to your account</h1>
          <p className="auth-subtitle">
            Or <Link to="/register">create a new account</Link>
          </p>
        </div>

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

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-remember">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>

          <div className="auth-actions">
            <Link to="/forgot-password" className="auth-forgot">
              Forgot your password?
            </Link>
          </div>

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="auth-loading"></span>
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Don't have an account? <Link to="/register" className="auth-footer-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;