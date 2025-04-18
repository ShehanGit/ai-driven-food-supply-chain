import apiClient from '../api/client';

export interface Product {
  id?: number;
  batchCode?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdByUsername?: string;
  createdAt?: string;
  harvestDate?: string;
  expirationDate?: string;
  productType: string;
  organic: boolean;
  certification?: string;
  cultivationMethod?: string;
  qrCodeUrl?: string;
  imageUrl?: string;
  environmentalConditions?: EnvironmentalCondition[];
}

export interface EnvironmentalCondition {
  id?: number;
  productId?: number;
  timestamp?: string;
  temperature?: number;
  humidity?: number;
  lightExposure?: number;
  soilMoisture?: number;
  soilPh?: number;
  airQuality?: number;
  recordedBy?: string;
  location?: string;
  notes?: string;
}

const productService = {
  createProduct: async (product: Product) => {
    const response = await apiClient.post('/products', product);
    return response.data;
  },

  getProduct: async (id: number) => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  getProductByBatchCode: async (batchCode: string) => {
    const response = await apiClient.get(`/products/batch/${batchCode}`);
    return response.data;
  },

  getProductsByCurrentUser: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  getProductsPaged: async (page = 0, size = 10, sortBy = 'id', sortDir = 'DESC', search?: string) => {
    const params = { page, size, sortBy, sortDir, search };
    const response = await apiClient.get('/products/paged', { params });
    return response.data;
  },

  updateProduct: async (id: number, product: Product) => {
    const response = await apiClient.put(`/products/${id}`, product);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  addEnvironmentalCondition: async (productId: number, condition: EnvironmentalCondition) => {
    const response = await apiClient.post(`/products/${productId}/environmental-conditions`, condition);
    return response.data;
  },

  getEnvironmentalConditions: async (productId: number) => {
    const response = await apiClient.get(`/products/${productId}/environmental-conditions`);
    return response.data;
  },

  searchProducts: async (keyword: string) => {
    const response = await apiClient.get(`/products/search?keyword=${keyword}`);
    return response.data;
  },

  getProductsByType: async (productType: string) => {
    const response = await apiClient.get(`/products/type/${productType}`);
    return response.data;
  },

  getOrganicProducts: async () => {
    const response = await apiClient.get('/products/organic');
    return response.data;
  },

  getExpiringProducts: async (days = 7) => {
    const response = await apiClient.get(`/products/expiring?days=${days}`);
    return response.data;
  },
};

export default productService;