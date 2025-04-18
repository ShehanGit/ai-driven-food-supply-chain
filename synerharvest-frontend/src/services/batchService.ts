// src/api/services/batchService.ts
import apiClient from '../api/client';

export interface Batch {
  id?: number;
  batchCode?: string;
  productId: number;
  productName?: string;
  quantity: number;
  productionDate?: string;
  expirationDate?: string;
  status?: string;
  qrCodeUrl?: string;
  createdAt?: string;
  createdByUsername?: string;
  notes?: string;
  events?: BatchEvent[];
}

export interface BatchEvent {
  id?: number;
  batchId?: number;
  recordedByUsername?: string;
  timestamp?: string;
  eventType: string;
  location?: string;
  temperature?: number;
  humidity?: number;
  notes?: string;
  blockchainTxHash?: string;
}

const batchService = {
  createBatch: async (batch: Batch) => {
    const response = await apiClient.post('/batches', batch);
    return response.data;
  },

  getBatch: async (id: number) => {
    const response = await apiClient.get(`/batches/${id}`);
    return response.data;
  },

  getBatchByCode: async (batchCode: string) => {
    const response = await apiClient.get(`/batches/code/${batchCode}`);
    return response.data;
  },

  getBatchesByProduct: async (productId: number) => {
    const response = await apiClient.get(`/batches/product/${productId}`);
    return response.data;
  },

  getBatchesByCurrentUser: async () => {
    const response = await apiClient.get('/batches');
    return response.data;
  },

  getBatchesByStatus: async (status: string) => {
    const response = await apiClient.get(`/batches/status/${status}`);
    return response.data;
  },

  updateBatchStatus: async (id: number, status: string, event: BatchEvent) => {
    const response = await apiClient.put(`/batches/${id}/status?status=${status}`, event);
    return response.data;
  },

  addBatchEvent: async (batchId: number, event: BatchEvent) => {
    const response = await apiClient.post(`/batches/${batchId}/events`, event);
    return response.data;
  },

  getBatchEvents: async (batchId: number) => {
    const response = await apiClient.get(`/batches/${batchId}/events`);
    return response.data;
  },

  getExpiringBatches: async (days = 7) => {
    const response = await apiClient.get(`/batches/expiring?days=${days}`);
    return response.data;
  },
};

export default batchService;