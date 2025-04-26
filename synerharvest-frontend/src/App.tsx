// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/home/HomePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import BatchesPage from './pages/batches/BatchesPage';
import BatchDetailsPage from './pages/batches/BatchDetailsPage';
import BatchEventsPage from './pages/batches/BatchEventsPage';
import BatchUpdateStatusPage from './pages/batches/BatchUpdateStatusPage';
import BatchAddEventPage from './pages/batches/BatchAddEventPage';
import BatchQRCodePage from './pages/batches/BatchQRCodePage';
import BatchTrackingPage from './pages/public/BatchTrackingPage';
import BatchCreatePage from './pages/batches/BatchCreatePage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import AppLayout from './components/layout/AppLayout';

import ProductsPage from './pages/products/ProductsPage';
import ProductCreatePage from './pages/products/ProductCreatePage';
import ProductDetailsPage from './pages/products/ProductDetailsPage';
import ProductEditPage from './pages/products/ProductEditPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Home page - visible without login, but with standard layout */}
          <Route path="/" element={
            <AppLayout requireAuth={false}>
              <HomePage />
            </AppLayout>
          } />
          
          {/* Public product tracking */}
          <Route path="/tracking" element={<BatchTrackingPage />} />
          <Route path="/tracking/:batchCode" element={<BatchTrackingPage />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          } />
          
          {/* Batch routes */}
          <Route path="/batches" element={
            <AppLayout>
              <BatchesPage />
            </AppLayout>
          } />
          
          <Route path="/batches/create" element={
            <AppLayout>
              <BatchCreatePage />
            </AppLayout>
          } />
          
          <Route path="/batches/:id" element={
            <AppLayout>
              <BatchDetailsPage />
            </AppLayout>
          } />
          
          <Route path="/batches/:id/events" element={
            <AppLayout>
              <BatchEventsPage />
            </AppLayout>
          } />
          
          <Route path="/batches/:id/update-status" element={
            <AppLayout>
              <BatchUpdateStatusPage />
            </AppLayout>
          } />
          
          <Route path="/batches/:id/add-event" element={
            <AppLayout>
              <BatchAddEventPage />
            </AppLayout>
          } />
          
          <Route path="/batches/:id/qr-code" element={
            <AppLayout>
              <BatchQRCodePage />
            </AppLayout>
          } />
          
          {/* Analytics route */}
          <Route path="/analytics" element={
            <AppLayout>
              <AnalyticsPage />
            </AppLayout>
          } />

           {/* Products routes */}
           <Route path="/products" element={
            <AppLayout>
              <ProductsPage />
            </AppLayout>
          } />
          
          <Route path="/products/create" element={
            <AppLayout>
              <ProductCreatePage />
            </AppLayout>
          } />
          
          <Route path="/products/:id" element={
            <AppLayout>
              <ProductDetailsPage />
            </AppLayout>
          } />
          
          <Route path="/products/:id/edit" element={
            <AppLayout>
              <ProductEditPage />
            </AppLayout>
          } />
          
          
          {/* Redirect any unmatched routes to dashboard or home depending on auth status */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;