// src/pages/batches/BatchesPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import batchService, { Batch } from '../../services/batchService';

const BatchesPage: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchBatches();
  }, [selectedStatus]);

  const fetchBatches = async () => {
    try {
      setIsLoading(true);
      let data;
      
      if (selectedStatus === 'ALL') {
        data = await batchService.getBatchesByCurrentUser();
      } else {
        data = await batchService.getBatchesByStatus(selectedStatus);
      }
      
      setBatches(data);
    } catch (err) {
      console.error('Error fetching batches:', err);
      setError('Failed to load batches. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter batches based on search term
  const filteredBatches = batches.filter(batch => 
    batch.batchCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBatches = filteredBatches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'CREATED':
        return 'badge-primary';
      case 'HARVESTED':
        return 'badge-success';
      case 'IN_STORAGE':
        return 'badge-secondary';
      case 'IN_TRANSIT':
        return 'badge-warning';
      case 'DELIVERED':
        return 'badge-info';
      case 'AT_RETAILER':
        return 'badge-info';
      case 'SOLD':
        return 'badge-success';
      case 'EXPIRED':
        return 'badge-danger';
      case 'RECALLED':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="batches-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Batches</h1>
            <p className="page-subtitle">
              Manage and track your product batches across the supply chain
            </p>
          </div>
          <div className="page-actions">
            <Link to="/batches/create" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Batch
            </Link>
          </div>
        </div>
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

      <div className="filters">
        <div className="filter-group">
          <div className="filter-item">
            <label htmlFor="status-filter" className="filter-label">Status:</label>
            <select 
              id="status-filter" 
              className="filter-select" 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="CREATED">Created</option>
              <option value="HARVESTED">Harvested</option>
              <option value="IN_STORAGE">In Storage</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="AT_RETAILER">At Retailer</option>
              <option value="SOLD">Sold</option>
              <option value="EXPIRED">Expired</option>
              <option value="RECALLED">Recalled</option>
            </select>
          </div>
          <div className="search-box-container">
            <div className="search-box">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search batches..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading batches...</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Batch Code</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Production Date</th>
                  <th>Expiration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBatches.length > 0 ? (
                  currentBatches.map((batch) => (
                    <tr key={batch.id}>
                      <td>{batch.batchCode}</td>
                      <td>{batch.productName}</td>
                      <td>{batch.quantity}</td>
                      <td>{new Date(batch.productionDate || '').toLocaleDateString()}</td>
                      <td>{batch.expirationDate ? new Date(batch.expirationDate).toLocaleDateString() : 'N/A'}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(batch.status || '')}`}>
                          {batch.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <Link 
                            to={`/batches/${batch.id}`}
                            className="table-action-btn"
                            title="View Details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </Link>
                          <Link 
                            to={`/batches/${batch.id}/events`}
                            className="table-action-btn"
                            title="View Events"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                          </Link>
                          <Link 
                            to={`/batches/${batch.id}/update-status`}
                            className="table-action-btn"
                            title="Update Status"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="9 11 12 14 22 4"></polyline>
                              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                            </svg>
                          </Link>
                          <Link 
                            to={`/batches/${batch.id}/qr-code`}
                            className="table-action-btn"
                            title="View QR Code"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="7" height="7"></rect>
                              <rect x="14" y="3" width="7" height="7"></rect>
                              <rect x="14" y="14" width="7" height="7"></rect>
                              <rect x="3" y="14" width="7" height="7"></rect>
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      No batches found. Create your first batch to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredBatches.length)} of {filteredBatches.length} batches
              </div>
              <div className="pagination">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="11 17 6 12 11 7"></polyline>
                    <polyline points="18 17 13 12 18 7"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 17 18 12 13 7"></polyline>
                    <polyline points="6 17 11 12 6 7"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BatchesPage;