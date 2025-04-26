// src/pages/products/ProductEditPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import productService, { Product } from '../../services/productService';

const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    productType: 'VEGETABLE',
    organic: false,
    certification: '',
    cultivationMethod: 'CONVENTIONAL',
    harvestDate: '',
    expirationDate: ''
  });

  // Product types for the dropdown
  const productTypes = [
    { value: 'VEGETABLE', label: 'Vegetable' },
    { value: 'FRUIT', label: 'Fruit' },
    { value: 'GRAIN', label: 'Grain' },
    { value: 'DAIRY', label: 'Dairy' },
    { value: 'MEAT', label: 'Meat' },
    { value: 'SEAFOOD', label: 'Seafood' },
    { value: 'OTHER', label: 'Other' }
  ];

  // Cultivation methods for the dropdown
  const cultivationMethods = [
    { value: 'CONVENTIONAL', label: 'Conventional' },
    { value: 'ORGANIC', label: 'Organic' },
    { value: 'HYDROPONIC', label: 'Hydroponic' },
    { value: 'GREENHOUSE', label: 'Greenhouse' },
    { value: 'VERTICAL_FARMING', label: 'Vertical Farming' },
    { value: 'AQUAPONIC', label: 'Aquaponic' }
  ];

  // Certifications for the dropdown - visible only for organic products
  const certifications = [
    { value: 'USDA_ORGANIC', label: 'USDA Organic' },
    { value: 'EU_ORGANIC', label: 'EU Organic' },
    { value: 'NON_GMO', label: 'Non-GMO Project Verified' },
    { value: 'FAIR_TRADE', label: 'Fair Trade Certified' },
    { value: 'RAINFOREST_ALLIANCE', label: 'Rainforest Alliance Certified' },
    { value: 'OTHER', label: 'Other' }
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!id) {
        throw new Error('Product ID is missing');
      }

      const productId = parseInt(id);
      const productData = await productService.getProduct(productId);
      
      // Format dates for input fields
      if (productData.harvestDate) {
        productData.harvestDate = new Date(productData.harvestDate).toISOString().split('T')[0];
      }
      if (productData.expirationDate) {
        productData.expirationDate = new Date(productData.expirationDate).toISOString().split('T')[0];
      }
      
      setFormData(productData);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checkbox.checked
      });
    } else if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Make a copy of the formData
      const productData = { ...formData };
      
      // If not organic, clear certification field
      if (!productData.organic) {
        productData.certification = '';
      }

      if (!id) {
        throw new Error('Product ID is missing');
      }

      const productId = parseInt(id);
      await productService.updateProduct(productId, productData as Product);
      navigate(`/products/${id}`);
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.message || 'Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className="product-edit-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Edit Product</h1>
            <p className="page-subtitle">
              Update {formData.name} details
            </p>
          </div>
        </div>
      </div>

      <div className="product-form-container">
        <div className="card product-form-card">
          {error && (
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
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h3 className="form-section-title">Basic Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Product Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Organic Tomatoes"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="productType" className="form-label">Product Type *</label>
                  <select
                    id="productType"
                    name="productType"
                    className="form-control"
                    value={formData.productType}
                    onChange={handleInputChange}
                    required
                  >
                    {productTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="price" className="form-label">Price per Unit ($) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    placeholder="e.g., 2.99"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="stock" className="form-label">Current Stock *</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    className="form-control"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    required
                    placeholder="e.g., 100"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    placeholder="Provide a detailed description of your product..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Production Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="harvestDate" className="form-label">Harvest Date</label>
                  <input
                    type="date"
                    id="harvestDate"
                    name="harvestDate"
                    className="form-control"
                    value={formData.harvestDate}
                    onChange={handleInputChange}
                  />
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
                </div>

                <div className="form-group">
                  <label htmlFor="cultivationMethod" className="form-label">Cultivation Method</label>
                  <select
                    id="cultivationMethod"
                    name="cultivationMethod"
                    className="form-control"
                    value={formData.cultivationMethod}
                    onChange={handleInputChange}
                  >
                    {cultivationMethods.map(method => (
                      <option key={method.value} value={method.value}>{method.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group checkbox-group">
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      id="organic"
                      name="organic"
                      checked={formData.organic}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <label htmlFor="organic" className="checkbox-label">Organic Product</label>
                  </div>
                </div>

                {formData.organic && (
                  <div className="form-group">
                    <label htmlFor="certification" className="form-label">Certification</label>
                    <select
                      id="certification"
                      name="certification"
                      className="form-control"
                      value={formData.certification}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Certification</option>
                      {certifications.map(cert => (
                        <option key={cert.value} value={cert.value}>{cert.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="batchCode" className="form-label">Batch Code</label>
                  <input
                    type="text"
                    id="batchCode"
                    name="batchCode"
                    className="form-control"
                    value={formData.batchCode}
                    onChange={handleInputChange}
                    disabled  // Prevent changing batch code after creation
                  />
                  <small className="form-text text-muted">Batch codes cannot be changed after creation.</small>
                </div>

                <div className="form-group">
                  <label htmlFor="imageUrl" className="form-label">Product Image URL</label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    className="form-control"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/product-image.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Link to={`/products/${id}`} className="btn btn-outlined">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-sm"></span>
                    Updating...
                  </>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductEditPage;