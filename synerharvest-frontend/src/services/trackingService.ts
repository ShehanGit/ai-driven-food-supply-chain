// src/api/services/trackingService.ts
import apiClient from '../api/client';

const trackingService = {
  getProductJourney: async (batchCode: string) => {
    const response = await apiClient.get(`/public/journey/${batchCode}`);
    return response.data;
  },

  getProductTracking: async (batchCode: string) => {
    const response = await apiClient.get(`/public/tracking/batch/${batchCode}`);
    return response.data;
  },

  getBatchTimeline: async (batchCode: string) => {
    const response = await apiClient.get(`/public/tracking/timeline/${batchCode}`);
    return response.data;
  },
};

export default trackingService;