// src/services/analyticsService.ts
import apiClient from '../api/client';

export interface AnalyticsSummary {
  totalProducts: number;
  totalBatches: number;
  activeShipments: number;
  expiringBatches: number;
}

export interface BatchStatusDistribution {
  status: string;
  count: number;
}

export interface ProductTypeDistribution {
  productType: string;
  count: number;
}

export interface MonthlyProduction {
  month: string;
  count: number;
}

export interface BatchEventSummary {
  eventType: string;
  count: number;
}

export interface EnvironmentalData {
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture?: number;
  soilPh?: number;
}

export interface QualityMetric {
  batchCode: string;
  productName: string;
  score: number;
  issues: string[];
}

const analyticsService = {
  // Get overall analytics summary for the current user
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    try {
      // This endpoint doesn't exist yet, so we'll simulate it for now
      // Once the backend is updated, we can use the actual endpoint
      
      // For now, we'll use existing endpoints to gather this data
      const [products, batches, expiringBatches] = await Promise.all([
        apiClient.get('/products'),
        apiClient.get('/batches'),
        apiClient.get('/batches/expiring?days=14')
      ]);
      
      return {
        totalProducts: products.data.length,
        totalBatches: batches.data.length,
        activeShipments: batches.data.filter(b => b.status === 'IN_TRANSIT').length,
        expiringBatches: expiringBatches.data.length
      };
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      // Return default values if API fails
      return {
        totalProducts: 0,
        totalBatches: 0,
        activeShipments: 0,
        expiringBatches: 0
      };
    }
  },
  
  // Get batch status distribution
  getBatchStatusDistribution: async (): Promise<BatchStatusDistribution[]> => {
    try {
      // Simulate API call
      // In a real implementation, this would call a specific endpoint
      const response = await apiClient.get('/batches');
      const batches = response.data;
      
      // Count batches by status
      const statusMap = new Map<string, number>();
      batches.forEach(batch => {
        const status = batch.status || 'UNKNOWN';
        statusMap.set(status, (statusMap.get(status) || 0) + 1);
      });
      
      // Convert map to array of objects
      return Array.from(statusMap.entries()).map(([status, count]) => ({
        status,
        count
      }));
    } catch (error) {
      console.error('Error fetching batch status distribution:', error);
      return [];
    }
  },
  
  // Get product type distribution
  getProductTypeDistribution: async (): Promise<ProductTypeDistribution[]> => {
    try {
      // Simulate API call
      const response = await apiClient.get('/products');
      const products = response.data;
      
      // Count products by type
      const typeMap = new Map<string, number>();
      products.forEach(product => {
        const type = product.productType || 'UNKNOWN';
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      });
      
      // Convert map to array of objects
      return Array.from(typeMap.entries()).map(([productType, count]) => ({
        productType,
        count
      }));
    } catch (error) {
      console.error('Error fetching product type distribution:', error);
      return [];
    }
  },
  
  // Get monthly production data
  getMonthlyProduction: async (): Promise<MonthlyProduction[]> => {
    try {
      // Simulate API call
      const response = await apiClient.get('/batches');
      const batches = response.data;
      
      // Group batches by month
      const monthMap = new Map<string, number>();
      batches.forEach(batch => {
        if (batch.productionDate) {
          // Format date as YYYY-MM
          const month = batch.productionDate.substring(0, 7);
          monthMap.set(month, (monthMap.get(month) || 0) + 1);
        }
      });
      
      // Convert map to array of objects
      const result = Array.from(monthMap.entries()).map(([month, count]) => ({
        month,
        count
      }));
      
      // Sort by month
      return result.sort((a, b) => a.month.localeCompare(b.month));
    } catch (error) {
      console.error('Error fetching monthly production:', error);
      return [];
    }
  },
  
  // Get batch event summary
  getBatchEventSummary: async (): Promise<BatchEventSummary[]> => {
    try {
      // This endpoint doesn't exist yet, so we'll simulate it
      // Once implemented, we would call a specific endpoint
      
      // For now, we'll generate some sample data
      return [
        { eventType: 'CREATED', count: 45 },
        { eventType: 'HARVESTED', count: 42 },
        { eventType: 'QUALITY_CHECK', count: 38 },
        { eventType: 'SHIPPED', count: 30 },
        { eventType: 'RECEIVED', count: 28 },
        { eventType: 'SOLD', count: 20 }
      ];
    } catch (error) {
      console.error('Error fetching batch event summary:', error);
      return [];
    }
  },
  
  // Get environmental data for a specific product
  getEnvironmentalData: async (productId: number): Promise<EnvironmentalData[]> => {
    try {
      const response = await apiClient.get(`/products/${productId}/environmental-conditions`);
      return response.data.map((condition) => ({
        timestamp: condition.timestamp,
        temperature: condition.temperature || 0,
        humidity: condition.humidity || 0,
        soilMoisture: condition.soilMoisture,
        soilPh: condition.soilPh
      }));
    } catch (error) {
      console.error(`Error fetching environmental data for product ${productId}:`, error);
      return [];
    }
  },
  
  // Get quality metrics for batches
  getQualityMetrics: async (): Promise<QualityMetric[]> => {
    try {
      // This endpoint doesn't exist yet, so we'll simulate it
      // Once implemented, we would call a specific endpoint
      
      // For now, we'll generate some sample data
      return [
        { 
          batchCode: 'APL-20250418-001', 
          productName: 'Organic Apples', 
          score: 98,
          issues: [] 
        },
        { 
          batchCode: 'BAN-20250410-002', 
          productName: 'Bananas', 
          score: 92,
          issues: ['Minor bruising on 2% of batch'] 
        },
        { 
          batchCode: 'STR-20250415-003', 
          productName: 'Strawberries', 
          score: 85,
          issues: ['Some ripening variation', 'Small size in 5% of batch'] 
        },
        { 
          batchCode: 'TOM-20250412-004', 
          productName: 'Roma Tomatoes', 
          score: 95,
          issues: [] 
        },
        { 
          batchCode: 'POT-20250405-005', 
          productName: 'Russet Potatoes', 
          score: 90,
          issues: ['Slight soil residue'] 
        }
      ];
    } catch (error) {
      console.error('Error fetching quality metrics:', error);
      return [];
    }
  },
  
  // Get demand forecast for products
  getDemandForecast: async (): Promise<any[]> => {
    try {
      // This endpoint doesn't exist yet, so we'll simulate it
      // Once implemented, we would call a specific endpoint
      
      // For now, we'll generate some sample data
      const currentDate = new Date();
      const months = [];
      
      // Generate forecast for next 6 months
      for (let i = 0; i < 6; i++) {
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() + i);
        months.push(month.toLocaleString('default', { month: 'short', year: 'numeric' }));
      }
      
      return [
        {
          productName: 'Organic Apples',
          forecast: months.map((month, index) => ({
            month,
            demand: 100 + Math.floor(Math.random() * 50) + (index * 10)
          }))
        },
        {
          productName: 'Bananas',
          forecast: months.map((month, index) => ({
            month,
            demand: 150 + Math.floor(Math.random() * 30) + (index * 5)
          }))
        },
        {
          productName: 'Strawberries',
          forecast: months.map((month, index) => ({
            month, 
            demand: 80 + Math.floor(Math.random() * 40) + (index * 8)
          }))
        }
      ];
    } catch (error) {
      console.error('Error fetching demand forecast:', error);
      return [];
    }
  },
  
  // Get carbon footprint data
  getCarbonFootprintData: async (): Promise<any[]> => {
    try {
      // This endpoint doesn't exist yet, so we'll simulate it
      // Once implemented, we would call a specific endpoint
      
      // For now, we'll generate some sample data
      return [
        { 
          productType: 'Apples', 
          totalEmissions: 2.3, 
          breakdown: { 
            farming: 1.1, 
            processing: 0.3, 
            transport: 0.6, 
            packaging: 0.3 
          } 
        },
        { 
          productType: 'Tomatoes', 
          totalEmissions: 3.1, 
          breakdown: { 
            farming: 1.3, 
            processing: 0.5, 
            transport: 0.9, 
            packaging: 0.4 
          } 
        },
        { 
          productType: 'Potatoes', 
          totalEmissions: 1.8, 
          breakdown: { 
            farming: 0.6, 
            processing: 0.4, 
            transport: 0.5, 
            packaging: 0.3 
          } 
        },
        { 
          productType: 'Lettuce', 
          totalEmissions: 2.7, 
          breakdown: { 
            farming: 1.0, 
            processing: 0.6, 
            transport: 0.7, 
            packaging: 0.4 
          } 
        }
      ];
    } catch (error) {
      console.error('Error fetching carbon footprint data:', error);
      return [];
    }
  }
};

export default analyticsService;