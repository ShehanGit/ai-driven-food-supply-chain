import apiClient from '../api/client';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: 'FARMER' | 'DISTRIBUTOR' | 'RETAILER' | 'CONSUMER';
  companyName?: string;
  companyAddress?: string;
  locationCoordinates?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  updateCurrentUser: async (data: any) => {
    const response = await apiClient.put('/auth/me', data);
    return response.data;
  },
};

export default authService;