// src/pages/products/ProductsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productService, { Product } from '../../services/productService';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [productType, setProductType] = useState('all');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Product types for the dropdown filter
  const productTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'VEGETABLE', label: 'Vegetables' },
    { value: 'FRUIT', label: 'Fruits' },
    { value: 'GRAIN', label: 'Grains' },
    { value: 'DAIRY', label: 'Dairy' },
    { value: 'MEAT', label: 'Meat' },
    { value: 'SEAFOOD', label: 'Seafood' },
    { value: 'OTHER', label: 'Other' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchTerm, productType, organicOnly, sortBy, sortDirection]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await productService.getProductsByCurrentUser();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...products];

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const lowerCaseSearch = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(lowerCaseSearch) ||
        product.description.toLowerCase().includes(lowerCaseSearch) ||
        product.batchCode?.toLowerCase().includes(lowerCaseSearch)
      );
    }

    // Apply product type filter
    if (productType !== 'all') {
      result = result.filter(product => product.productType === productType);
    }

    // Apply organic filter
    if (organicOnly) {
      result = result.filter(product => product.organic === true);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = (a.price || 0) - (b.price || 0);
          break;
        case 'stock':
          comparison = (a.stock || 0) - (b.stock || 0);
          break;
        case 'date':
          comparison = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleProductTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductType(e.target.value);
  };

  const handleOrganicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrganicOnly(e.target.checked);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle direction if same column is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort column and default to ascending
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleDeleteProduct = async (id: number | undefined) => {
    if (!id || !window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.deleteProduct(id);
      // Remove the deleted product from the state
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Failed to delete product. Please try again.');
    }
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <div className="page-header-content">
          <div>
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">
              Manage your products and track them through the supply chain
            </p>
          </div>
          <div className="page-actions">
            <Link to="/products/create" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Product
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
          <div className="alert-content">{error}</div>
        </div>
      )}

      <div className="filters-section">
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="filter-group">
          <div className="filter-item">
            <label htmlFor="product-type" className="filter-label">Product Type:</label>
            <select
              id="product-type"
              className="filter-select"
              value={productType}
              onChange={handleProductTypeChange}
            >
              {productTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-item checkbox-filter">
            <input
              type="checkbox"
              id="organic-only"
              checked={organicOnly}
              onChange={handleOrganicChange}
              className="filter-checkbox"
            />
            <label htmlFor="organic-only" className="filter-checkbox-label">Organic Only</label>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-state-container">
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3>No Products Found</h3>
            {searchTerm || productType !== 'all' || organicOnly ? (
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            ) : (
              <p>You haven't added any products yet. Get started by adding your first product.</p>
            )}
            {!searchTerm && productType === 'all' && !organicOnly && (
              <Link to="/products/create" className="btn btn-primary mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="btn-icon">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Your First Product
              </Link>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="table products-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')} className="sortable-header">
                    Product Name
                    {sortBy === 'name' && (
                      <span className="sort-indicator">
                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th>Type</th>
                  <th onClick={() => handleSort('price')} className="sortable-header">
                    Price
                    {sortBy === 'price' && (
                      <span className="sort-indicator">
                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('stock')} className="sortable-header">
                    Stock
                    {sortBy === 'stock' && (
                      <span className="sort-indicator">
                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th>Organic</th>
                  <th onClick={() => handleSort('date')} className="sortable-header">
                    Created Date
                    {sortBy === 'date' && (
                      <span className="sort-indicator">
                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-name-cell">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="product-thumbnail" />
                        ) : (
                          <div className="product-thumbnail-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="2" x2="12" y2="6"></line>
                              <line x1="12" y1="18" x2="12" y2="22"></line>
                              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                              <line x1="2" y1="12" x2="6" y2="12"></line>
                              <line x1="18" y1="12" x2="22" y2="12"></line>
                              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                            </svg>
                          </div>
                        )}
                        <div className="product-info">
                          <span className="product-name">{product.name}</span>
                          <span className="product-batch-code">{product.batchCode}</span>
                        </div>
                      </div>
                    </td>
                    <td>{product.productType}</td>
                    <td>${product.price?.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      {product.organic ? (
                        <span className="badge badge-success">Organic</span>
                      ) : (
                        <span className="badge badge-neutral">Conventional</span>
                      )}
                    </td>
                    <td>{formatDate(product.createdAt)}</td>
                    <td>
                      <div className="table-actions">
                        <Link to={`/products/${product.id}`} className="table-action-btn" title="View Details">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </Link>
                        <Link to={`/products/${product.id}/edit`} className="table-action-btn" title="Edit Product">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </Link>
                        <button 
                          className="table-action-btn delete-btn" 
                          title="Delete Product"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                        <Link to={`/products/${product.id}/batches`} className="table-action-btn" title="View Batches">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
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

export default ProductsPage;