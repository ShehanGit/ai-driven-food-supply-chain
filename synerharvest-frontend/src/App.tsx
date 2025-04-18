// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/home/HomePage';
import DashboardPage from './pages/dashboard/DashboardPage';
import BatchesPage from './pages/batches/BatchesPage';
import AppLayout from './components/layout/AppLayout';

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
          
          {/* Protected routes - require authentication */}
          <Route path="/dashboard" element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          } />
          
          <Route path="/batches" element={
            <AppLayout>
              <BatchesPage />
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