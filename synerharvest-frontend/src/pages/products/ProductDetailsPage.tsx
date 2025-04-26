// src/pages/products/ProductDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import productService, { Product } from '../../services/productService';
import batchService, { Batch } from '../../services/batchService';

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [recentBatches, setRecentBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [environmentalConditionsVisible, setEnvironmentalConditionsVisible] = useState(false);

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!id) {
        throw new Error('Product ID is missing');
      }

      const productId = parseInt(id);
      
      // Fetch product details
      const productData = await productService.getProduct(productId);
      setProduct(productData);
      
      // Fetch batches for this product
      const batchesData = await batchService.getBatchesByProduct(productId);
      setBatches(batchesData);
      
      // Set recent batches (last 3)
      setRecentBatches(batchesData.slice(0, 3));
      
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEnvironmentalConditions = () => {
    setEnvironmentalConditionsVisible(!environmentalConditionsVisible);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const handleDeleteProduct = async () => {
    if (!product?.id || !window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.deleteProduct(product.id);
      navigate('/products');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">
          <div className="alert-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div className="alert-content">{error}</div>
        </div>
        <div className="mt-4">
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Product not found</h2>
        <p>The product you are looking for does not exist or has been removed.</p>
        <div className="mt-4">
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">{product.name}</h1>
            <p className="page-subtitle">
              {product.productType} • {product.organic ? 'Organic' : 'Conventional'} • Batch Code: {product.batchCode}
            </p>
          </div>
          <div className="page-actions">
            <Link to={`/products/${id}/edit`} className="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Product
            </Link>
            <Link to={`/batches/create?productId=${id}`} className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Batch
            </Link>
          </div>
        </div>
      </div>

      <div className="product-details-container">
        <div className="product-main-details">
          <div className="card product-info-card">
            <div className="card-header">
              <h2 className="card-title">Product Information</h2>
            </div>
            <div className="card-content">
              <div className="product-image-container">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                ) : (
                  <div className="product-image-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                    <span>No image available</span>
                  </div>
                )}
              </div>

              <div className="product-details">
                <div className="detail-group">
                  <div className="detail-item">
                    <span className="detail-label">Price</span>
                    <span className="detail-value">${product.price?.toFixed(2)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Current Stock</span>
                    <span className="detail-value">{product.stock}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Product Type</span>
                    <span className="detail-value">{product.productType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Organic</span>
                    <span className="detail-value">
                      {product.organic ? (
                        <span className="badge badge-success">Yes</span>
                      ) : (
                        <span className="badge badge-neutral">No</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="detail-group">
                  <div className="detail-item">
                    <span className="detail-label">Harvest Date</span>
                    <span className="detail-value">{formatDate(product.harvestDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Expiration Date</span>
                    <span className="detail-value">{formatDate(product.expirationDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Cultivation Method</span>
                    <span className="detail-value">{product.cultivationMethod || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Certification</span>
                    <span className="detail-value">
                      {product.certification ? (
                        <span className="badge badge-info">{product.certification.replace('_', ' ')}</span>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                </div>

                <div className="product-description">
                  <span className="detail-label">Description</span>
                  <p>{product.description}</p>
                </div>

                <div className="detail-group">
                  <div className="detail-item">
                    <span className="detail-label">Created By</span>
                    <span className="detail-value">{product.createdByUsername || 'Unknown'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Created At</span>
                    <span className="detail-value">{formatDate(product.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {product.qrCodeUrl && (
            <div className="card qr-code-card">
              <div className="card-header">
                <h2 className="card-title">QR Code</h2>
              </div>
              <div className="card-content qr-content">
                <img src={product.qrCodeUrl} alt="Product QR Code" className="qr-image" />
                <div className="qr-info">
                  <p>Use this QR code to track this product in the supply chain.</p>
                  <p>Consumers can scan this code to view product origin and journey.</p>
                  <button className="btn btn-outlined mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          )}

          {product.environmentalConditions && product.environmentalConditions.length > 0 && (
            <div className="card environmental-conditions-card">
              <div className="card-header clickable" onClick={toggleEnvironmentalConditions}>
                <h2 className="card-title">Environmental Conditions</h2>
                <button className="toggle-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {environmentalConditionsVisible ? (
                      <polyline points="18 15 12 9 6 15"></polyline>
                    ) : (
                      <polyline points="6 9 12 15 18 9"></polyline>
                    )}
                  </svg>
                </button>
              </div>
              {environmentalConditionsVisible && (
                <div className="card-content">
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Temp (°C)</th>
                          <th>Humidity (%)</th>
                          <th>Soil pH</th>
                          <th>Location</th>
                          <th>Recorded By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.environmentalConditions.map(condition => (
                          <tr key={condition.id}>
                            <td>{new Date(condition.timestamp || '').toLocaleString()}</td>
                            <td>{condition.temperature?.toFixed(1) || 'N/A'}</td>
                            <td>{condition.humidity?.toFixed(1) || 'N/A'}</td>
                            <td>{condition.soilPh?.toFixed(1) || 'N/A'}</td>
                            <td>{condition.location || 'N/A'}</td>
                            <td>{condition.recordedBy || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="card-actions">
                    <Link to={`/products/${id}/environmental-conditions`} className="btn btn-outlined">
                      View All Conditions
                    </Link>
                    <Link to={`/products/${id}/add-environmental-condition`} className="btn btn-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      Add Condition
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="product-sidebar">
          <div className="card product-batches-card">
            <div className="card-header">
              <h2 className="card-title">Batches</h2>
              <span className="badge">{batches.length}</span>
            </div>
            {batches.length === 0 ? (
              <div className="empty-batches">
                <div className="empty-state-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <p>No batches created yet</p>
                <Link to={`/batches/create?productId=${id}`} className="btn btn-primary">
                  Create First Batch
                </Link>
              </div>
            ) : (
              <div className="card-content">
                <div className="recent-batches">
                  {recentBatches.map(batch => (
                    <div key={batch.id} className="batch-item">
                      <div className="batch-info">
                        <div className="batch-code">{batch.batchCode}</div>
                        <div className="batch-meta">
                          <span>Qty: {batch.quantity}</span>
                          <span>•</span>
                          <span className={`badge ${batch.status === 'RECALLED' ? 'badge-danger' : 'badge-primary'}`}>
                            {batch.status?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <Link to={`/batches/${batch.id}`} className="btn btn-icon" title="View Batch">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="card-actions">
                  <Link to={`/products/${id}/batches`} className="btn btn-outlined">
                    View All Batches
                  </Link>
                  <Link to={`/batches/create?productId=${id}`} className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Create Batch
                    </Link>
                </div>
              </div>
            )}
          </div>

          <div className="card danger-zone">
            <div className="card-header">
              <h2 className="card-title">Danger Zone</h2>
            </div>
            <div className="card-content">
              <p className="warning-text">
                Once you delete a product, there is no going back. Please be certain.
              </p>
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteProduct}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="btn-icon"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;