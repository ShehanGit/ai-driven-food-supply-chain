// src/components/dashboard/RecentProducts.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import { Product } from '../../types/product.types';
import { formatDate } from '../../utils/formatters';

interface RecentProductsProps {
  products: Product[];
}

const RecentProducts: React.FC<RecentProductsProps> = ({ products }) => {
  return (
    <Card title="Recent Products">
      <div className="overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {products.length === 0 ? (
            <li className="py-4 text-gray-500">No products available</li>
          ) : (
            products.slice(0, 5).map((product) => (
              <li key={product.id} className="py-4">
                <Link to={`/products/${product.id}`} className="block hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {product.organic ? 'Organic' : 'Conventional'} • {product.productType}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <p className="text-sm text-gray-500">
                        {product.createdAt ? formatDate(product.createdAt) : 'N/A'}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
        {products.length > 5 && (
          <div className="mt-4 flex justify-center">
            <Link
              to="/products"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              View all products
            </Link>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecentProducts;