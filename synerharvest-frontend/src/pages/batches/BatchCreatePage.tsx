// src/pages/batches/BatchCreatePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import batchService from '../../services/batchService';
import productService, { Product } from '../../services/productService';

interface FormData {
  batchCode: string;
  productId: number;
  quantity: number;
  productionDate: string;
  expirationDate: string;
  status: string;
  notes: string;
}

const BatchCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    batchCode: '',
    productId: 0,
    quantity: 0,
    productionDate: new Date().toISOString().split('T')[0], // Today as default
    expirationDate: '',
    status: 'CREATED',
    notes: ''
  });

  // Calculate a default expiration date (6 months from today)
  const calculateDefaultExpirationDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 6);
    return date.toISOString().split('T')[0];
  };

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await productService.getProductsByCurrentUser();
        setProducts(data);
        
        // Set default product if we have one
        if (data.length > 0 && data[0].id) {
          setFormData(prev => ({
            ...prev,
            productId: data[0].id as number,
            expirationDate: calculateDefaultExpirationDate()
          }));
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'productId') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else if (name === 'quantity') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Generate a batch code
  const generateBatchCode = () => {
    const selectedProduct = products.find(p => p.id === formData.productId);
    if (!selectedProduct) return;
    
    const prefix = selectedProduct.name.substring(0, 3).toUpperCase();
    const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').substring(0, 14);
    const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const batchCode = `${prefix}-${timestamp.substring(0, 8)}-${randomDigits}`;
    
    setFormData({
      ...formData,
      batchCode
    });
  };

  // Validate the current step
  const validateCurrentStep = () => {
    if (activeStep === 1) {
      if (!formData.productId) {
        setError('Please select a product');
        return false;
      }
      
      // Generate batch code if none exists
      if (!formData.batchCode || formData.batchCode.trim() === '') {
        generateBatchCode();
      }
      
      setError('');
      return true;
    }
    
    if (activeStep === 2) {
      if (!formData.quantity || formData.quantity <= 0) {
        setError('Please enter a valid quantity');
        return false;
      }
      
      if (!formData.productionDate) {
        setError('Please select a production date');
        return false;
      }
      
      setError('');
      return true;
    }
    
    return true;
  };

  // Go to next step
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setActiveStep(activeStep + 1);
      setError('');
    }
  };

  // Go to previous step
  const goToPreviousStep = () => {
    setActiveStep(activeStep - 1);
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await batchService.createBatch(formData);
      setSuccessMessage(`Batch ${response.batchCode} created successfully!`);
      
      // Reset form and go to first step
      setFormData({
        batchCode: '',
        productId: products.length > 0 && products[0].id ? products[0].id : 0,
        quantity: 0,
        productionDate: new Date().toISOString().split('T')[0],
        expirationDate: calculateDefaultExpirationDate(),
        status: 'CREATED',
        notes: ''
      });
      
      setActiveStep(4); // Success step
      
      // Redirect to batch details after a short delay
      setTimeout(() => {
        navigate(`/batches/${response.id}`);
      }, 2000);
    } catch (err: any) {
      console.error('Error creating batch:', err);
      setError(err.response?.data?.message || 'Failed to create batch. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Get selected product name
  const getSelectedProductName = () => {
    const selectedProduct = products.find(p => p.id === formData.productId);
    return selectedProduct ? selectedProduct.name : 'Select a product';
  };

  // Get selected product details
  const getSelectedProduct = () => {
    return products.find(p => p.id === formData.productId);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="batch-create-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Create New Batch</h1>
            <p className="page-subtitle">
              Create a new batch for tracking products through the supply chain
            </p>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="no-products-container">
          <div className="no-products-card">
            <div className="no-products-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h2>No Products Found</h2>
            <p>You need to create a product before you can create a batch. Products are the foundation of your supply chain tracking.</p>
            <Link to="/products/create" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Your First Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="create-batch-container">
          {/* Progress Steps */}
          <div className="progress-steps">
            <div className={`progress-step ${activeStep >= 1 ? 'active' : ''} ${activeStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Select Product</div>
            </div>
            <div className="step-connector"></div>
            <div className={`progress-step ${activeStep >= 2 ? 'active' : ''} ${activeStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Batch Details</div>
            </div>
            <div className="step-connector"></div>
            <div className={`progress-step ${activeStep >= 3 ? 'active' : ''} ${activeStep > 3 ? 'completed' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Review & Create</div>
            </div>
          </div>

          <div className="create-batch-form-card card">
            {successMessage && (
              <div className="alert alert-success mb-4">
                <div className="alert-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div className="alert-content">{successMessage}</div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger mb-4">
                <div className="alert-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className="alert-content">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Select Product */}
              {activeStep === 1 && (
                <div className="form-step">
                  <h3 className="step-title">Select Product for Batch</h3>
                  
                  <div className="product-selection">
                    <div className="form-group full-width">
                      <label htmlFor="productId" className="form-label">Choose Product</label>
                      <select
                        id="productId"
                        name="productId"
                        className="form-control form-control-lg"
                        value={formData.productId}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - {product.productType} {product.organic ? '(Organic)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {formData.productId > 0 && (
                      <div className="selected-product-preview">
                        <div className="product-preview-header">
                          <h4>Selected Product</h4>
                        </div>
                        <div className="product-preview-body">
                          {getSelectedProduct() && (
                            <>
                              <div className="product-preview-detail">
                                <span className="label">Name:</span>
                                <span className="value">{getSelectedProduct()?.name}</span>
                              </div>
                              <div className="product-preview-detail">
                                <span className="label">Type:</span>
                                <span className="value">{getSelectedProduct()?.productType}</span>
                              </div>
                              <div className="product-preview-detail">
                                <span className="label">Organic:</span>
                                <span className="value">{getSelectedProduct()?.organic ? 'Yes' : 'No'}</span>
                              </div>
                              <div className="product-preview-detail">
                                <span className="label">Description:</span>
                                <span className="value">{getSelectedProduct()?.description || 'No description available'}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="form-group full-width">
                      <label htmlFor="batchCode" className="form-label">
                        Batch Code
                        <span className="optional-text"> (Optional - will be generated if left empty)</span>
                      </label>
                      <div className="input-with-button">
                        <input
                          type="text"
                          id="batchCode"
                          name="batchCode"
                          className="form-control"
                          value={formData.batchCode}
                          onChange={handleInputChange}
                          placeholder="e.g., APL-20250418-001"
                        />
                        <button
                          type="button"
                          className="btn btn-secondary input-button"
                          onClick={generateBatchCode}
                          disabled={!formData.productId}
                        >
                          Generate Code
                        </button>
                      </div>
                      {formData.batchCode && (
                        <div className="form-text">
                          This code will be used to track this batch through the supply chain.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 2: Batch Details */}
              {activeStep === 2 && (
                <div className="form-step">
                  <h3 className="step-title">Batch Details</h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="quantity" className="form-label">Quantity</label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        className="form-control"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        required
                        placeholder="e.g., 100"
                      />
                      <div className="form-text">
                        The number of items in this batch
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="status" className="form-label">Initial Status</label>
                      <select
                        id="status"
                        name="status"
                        className="form-control"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="CREATED">Created</option>
                        <option value="HARVESTED">Harvested</option>
                        <option value="IN_STORAGE">In Storage</option>
                      </select>
                      <div className="form-text">
                        The current status of this batch
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="productionDate" className="form-label">Production Date</label>
                      <input
                        type="date"
                        id="productionDate"
                        name="productionDate"
                        className="form-control"
                        value={formData.productionDate}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="form-text">
                        When the batch was produced or harvested
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
                      <input
                        type="date"
                        id="expirationDate"
                        name="expirationDate"
                        className="form-control"
                        value={formData.expirationDate}
                        onChange={handleInputChange}
                      />
                      <div className="form-text">
                        When the batch will expire (if applicable)
                      </div>
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="notes" className="form-label">Notes</label>
                      <textarea
                        id="notes"
                        name="notes"
                        className="form-control"
                        rows={4}
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Additional information about this batch..."
                      ></textarea>
                      <div className="form-text">
                        Any additional details to track with this batch
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 3: Review */}
              {activeStep === 3 && (
                <div className="form-step">
                  <h3 className="step-title">Review Batch Details</h3>
                  
                  <div className="batch-review-card">
                    <div className="review-header">
                      <h4>Batch Summary</h4>
                      <span className={`badge ${formData.status === 'CREATED' ? 'badge-primary' : formData.status === 'HARVESTED' ? 'badge-success' : 'badge-secondary'}`}>
                        {formData.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="review-product-section">
                      <div className="review-section-title">Product Information</div>
                      <div className="review-grid">
                        <div className="review-item">
                          <div className="review-label">Product</div>
                          <div className="review-value">{getSelectedProductName()}</div>
                        </div>
                        <div className="review-item">
                          <div className="review-label">Type</div>
                          <div className="review-value">{getSelectedProduct()?.productType || 'N/A'}</div>
                        </div>
                        <div className="review-item">
                          <div className="review-label">Organic</div>
                          <div className="review-value">{getSelectedProduct()?.organic ? 'Yes' : 'No'}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="review-batch-section">
                      <div className="review-section-title">Batch Details</div>
                      <div className="review-grid">
                        <div className="review-item">
                          <div className="review-label">Batch Code</div>
                          <div className="review-value highlight">{formData.batchCode}</div>
                        </div>
                        <div className="review-item">
                          <div className="review-label">Quantity</div>
                          <div className="review-value">{formData.quantity}</div>
                        </div>
                        <div className="review-item">
                          <div className="review-label">Production Date</div>
                          <div className="review-value">
                            {formData.productionDate ? new Date(formData.productionDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        <div className="review-item">
                          <div className="review-label">Expiration Date</div>
                          <div className="review-value">
                            {formData.expirationDate ? new Date(formData.expirationDate).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {formData.notes && (
                      <div className="review-notes-section">
                        <div className="review-section-title">Notes</div>
                        <div className="review-notes">{formData.notes}</div>
                      </div>
                    )}
                    
                    <div className="qr-preview-section">
                      <div className="review-section-title">QR Code Preview</div>
                      <div className="qr-preview">
                        <div className="qr-placeholder">
                          <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                          </svg>
                        </div>
                        <div className="qr-info">
                          <p>A QR code will be generated for this batch when created.</p>
                          <p>The QR code can be used to track this batch through the supply chain.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Step 4: Success */}
              {activeStep === 4 && (
                <div className="form-step">
                  <div className="success-message">
                    <div className="success-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h3>Batch Created Successfully!</h3>
                    <p>Your batch has been created and is ready to be tracked through the supply chain.</p>
                    <p>You will be redirected to the batch details page shortly...</p>
                  </div>
                </div>
              )}

              {activeStep < 4 && (
                <div className="form-actions">
                  {activeStep > 1 && (
                    <button
                      type="button"
                      className="btn btn-outlined"
                      onClick={goToPreviousStep}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      Back
                    </button>
                  )}
                  
                  {activeStep < 3 && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={goToNextStep}
                    >
                      Next
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon-right">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  )}
                  
                  {activeStep === 3 && (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-sm"></span>
                          Creating Batch...
                        </>
                      ) : (
                        <>
                          Create Batch
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon-right">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchCreatePage;