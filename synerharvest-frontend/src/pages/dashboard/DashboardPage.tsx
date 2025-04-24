// src/pages/dashboard/DashboardPage.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleBasedDashboard from '../dashboard/RoleBasedDashboard';
const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back, {user?.firstName}! Here's what's happening with your supply chain.
        </p>
      </div>

      <RoleBasedDashboard />
    </div>
  );
};

export default DashboardPage;






// // src/pages/dashboard/DashboardPage.tsx
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';
// import productService from '../../services/productService';
// import batchService from '../../services/batchService';

// interface DashboardStatsState {
//   totalProducts: number;
//   totalBatches: number;
//   expiringBatches: number;
// }

// const DashboardPage: React.FC = () => {
//   const { user } = useAuth();
//   const [stats, setStats] = useState<DashboardStatsState>({
//     totalProducts: 0,
//     totalBatches: 0,
//     expiringBatches: 0,
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
        
//         // Get products
//         const products = await productService.getProductsByCurrentUser();
        
//         // Get batches
//         const batches = await batchService.getBatchesByCurrentUser();
        
//         // Get expiring batches
//         const expiringBatches = await batchService.getExpiringBatches(7); // Batches expiring in 7 days
        
//         setStats({
//           totalProducts: products.length,
//           totalBatches: batches.length,
//           expiringBatches: expiringBatches.length,
//         });
//       } catch (err) {
//         console.error('Error fetching dashboard data:', err);
//         setError('Failed to load dashboard data. Please try again later.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="dashboard-page">
//       <div className="page-header">
//         <h1 className="page-title">Dashboard</h1>
//         <p className="page-subtitle">
//           Welcome back, {user?.firstName}! Here's what's happening with your supply chain.
//         </p>
//       </div>

//       {error && (
//         <div className="alert alert-danger">
//           <div className="alert-icon">
//             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <circle cx="12" cy="12" r="10"></circle>
//               <line x1="12" y1="8" x2="12" y2="12"></line>
//               <line x1="12" y1="16" x2="12.01" y2="16"></line>
//             </svg>
//           </div>
//           <div className="alert-content">
//             {error}
//           </div>
//         </div>
//       )}

//       {isLoading ? (
//         <div className="stats-grid">
//           {[1, 2, 3, 4].map((item) => (
//             <div key={item} className="stat-card loading">
//               <div className="stat-card-body">
//                 <div className="loading-rect loading-icon"></div>
//                 <div className="loading-rect loading-title"></div>
//                 <div className="loading-rect loading-value"></div>
//               </div>
//               <div className="stat-card-footer">
//                 <div className="loading-rect loading-footer"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="stats-grid">
//           <div className="stat-card">
//             <div className="stat-card-body">
//               <div className="stat-card-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--primary-color)' }}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
//                   <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
//                   <line x1="12" y1="22.08" x2="12" y2="12"></line>
//                 </svg>
//               </div>
//               <div className="stat-card-title">Total Products</div>
//               <div className="stat-card-value">{stats.totalProducts}</div>
//             </div>
//             <Link to="/products" className="stat-card-footer">
//               View all products
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
//                 <polyline points="9 18 15 12 9 6"></polyline>
//               </svg>
//             </Link>
//           </div>
          
//           <div className="stat-card">
//             <div className="stat-card-body">
//               <div className="stat-card-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary-color)' }}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
//                   <line x1="16" y1="2" x2="16" y2="6"></line>
//                   <line x1="8" y1="2" x2="8" y2="6"></line>
//                   <line x1="3" y1="10" x2="21" y2="10"></line>
//                 </svg>
//               </div>
//               <div className="stat-card-title">Total Batches</div>
//               <div className="stat-card-value">{stats.totalBatches}</div>
//             </div>
//             <Link to="/batches" className="stat-card-footer">
//               View all batches
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
//                 <polyline points="9 18 15 12 9 6"></polyline>
//               </svg>
//             </Link>
//           </div>
          
//           <div className="stat-card">
//             <div className="stat-card-body">
//               <div className="stat-card-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning-color)' }}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <circle cx="12" cy="12" r="10"></circle>
//                   <line x1="12" y1="8" x2="12" y2="12"></line>
//                   <line x1="12" y1="16" x2="12.01" y2="16"></line>
//                 </svg>
//               </div>
//               <div className="stat-card-title">Expiring Soon</div>
//               <div className="stat-card-value">{stats.expiringBatches}</div>
//             </div>
//             <Link to="/batches?filter=expiring" className="stat-card-footer">
//               View expiring batches
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
//                 <polyline points="9 18 15 12 9 6"></polyline>
//               </svg>
//             </Link>
//           </div>
          
//           <div className="stat-card">
//             <div className="stat-card-body">
//               <div className="stat-card-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
//                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                   <line x1="18" y1="20" x2="18" y2="10"></line>
//                   <line x1="12" y1="20" x2="12" y2="4"></line>
//                   <line x1="6" y1="20" x2="6" y2="14"></line>
//                 </svg>
//               </div>
//               <div className="stat-card-title">Analytics</div>
//               <div className="stat-card-value">View Reports</div>
//             </div>
//             <Link to="/analytics" className="stat-card-footer">
//               Go to analytics
//               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stat-card-footer-icon">
//                 <polyline points="9 18 15 12 9 6"></polyline>
//               </svg>
//             </Link>
//           </div>
//         </div>
//       )}

//       <div className="dashboard-section">
//         <div className="dashboard-section-header">
//           <h2 className="dashboard-section-title">Recent Activity</h2>
//           <div className="dashboard-section-actions">
//             <Link to="/events" className="btn btn-outlined">View All</Link>
//           </div>
//         </div>
        
//         <div className="activities-list">
//           <div className="activity-item">
//             <div className="activity-icon" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--primary-color)' }}>
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               // src/pages/dashboard/DashboardPage.tsx (continued)
//                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
//               </svg>
//             </div>
//             <div className="activity-content">
//               <div className="activity-title">New batch created</div>
//               <div className="activity-meta">
//                 <span>Batch #APL-20250418-001</span>
//                 <span>•</span>
//                 <span>Apple Farm</span>
//               </div>
//             </div>
//             <div className="activity-time">5m ago</div>
//           </div>
          
//           <div className="activity-item">
//             <div className="activity-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--secondary-color)' }}>
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="1" y="3" width="15" height="13"></rect>
//                 <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
//                 <circle cx="5.5" cy="18.5" r="2.5"></circle>
//                 <circle cx="18.5" cy="18.5" r="2.5"></circle>
//               </svg>
//             </div>
//             <div className="activity-content">
//               <div className="activity-title">Batch shipped</div>
//               <div className="activity-meta">
//                 <span>Batch #ORA-20250417-002</span>
//                 <span>•</span>
//                 <span>Citrus Grove</span>
//               </div>
//             </div>
//             <div className="activity-time">2h ago</div>
//           </div>
          
//           <div className="activity-item">
//             <div className="activity-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)' }}>
//               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
//                 <polyline points="22 4 12 14.01 9 11.01"></polyline>
//               </svg>
//             </div>
//             <div className="activity-content">
//               <div className="activity-title">Quality check passed</div>
//               <div className="activity-meta">
//                 <span>Batch #BAN-20250417-003</span>
//                 <span>•</span>
//                 <span>Tropical Farms</span>
//               </div>
//             </div>
//             <div className="activity-time">1d ago</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;