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
    locationCoordinates: '',
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
      await register(registerData);
      navigate('/dashboard');
    } catch (err: any) {
      const responseErrors = err.response?.data?.errors || {};
      const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      
      setErrors((prev) => ({
        ...prev,
        ...Object.fromEntries(
          Object.entries(responseErrors).map(([key, value]) => [key, value as string])
        ),
        form: errorMsg,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="h-12 w-auto"
            src="/logo.svg"
            alt="SynerHarvest Logo"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {errors.form && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.form}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Username */}
              <div className="sm:col-span-3">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.username ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.username && (
                    <p className="mt-2 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.email ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* First Name */}
              <div className="sm:col-span-3">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.firstName ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div className="sm:col-span-3">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.lastName ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="sm:col-span-3">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.password ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="sm:col-span-3">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.confirmPassword ? 'border-red-300' : ''
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-3">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="sm:col-span-3">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1">
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className={`shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.role ? 'border-red-300' : ''
                    }`}
                  >
                    <option value="FARMER">Farmer</option>
                    <option value="DISTRIBUTOR">Distributor</option>
                    <option value="RETAILER">Retailer</option>
                    <option value="CONSUMER">Consumer</option>
                  </select>
                  {errors.role && (
                    <p className="mt-2 text-sm text-red-600">{errors.role}</p>
                  )}
                </div>
              </div>

              {/* Company Name */}
              <div className="sm:col-span-6">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Company Address */}
              <div className="sm:col-span-6">
                <label htmlFor="companyAddress" className="block text-sm font-medium text-gray-700">
                  Company address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="companyAddress"
                    id="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {/* Location Coordinates */}
              <div className="sm:col-span-6">
                <label htmlFor="locationCoordinates" className="block text-sm font-medium text-gray-700">
                  Location coordinates (latitude,longitude)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="locationCoordinates"
                    id="locationCoordinates"
                    placeholder="e.g. 40.7128,-74.0060"
                    value={formData.locationCoordinates}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;