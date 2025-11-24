import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  signup: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    availableOnly?: boolean;
    sortBy?: 'name' | 'price' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    isAvailable?: boolean;
  }) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  update: async (id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    imageUrl?: string;
    isAvailable?: boolean;
  }) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  toggleAvailability: async (id: string) => {
    const response = await api.patch(`/products/${id}/toggle-availability`);
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (items: Array<{ productId: string; quantity: number }>) => {
    const response = await api.post('/orders', { items });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getUserOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    sortBy?: 'createdAt' | 'total' | 'status';
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await api.get('/orders/user/my-orders', { params });
    return response.data;
  },

  getAllOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    sortBy?: 'createdAt' | 'total' | 'status';
    sortOrder?: 'asc' | 'desc';
  }) => {
    const response = await api.get('/orders/admin/all', { params });
    return response.data;
  },

  updateStatus: async (id: string, status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    const response = await api.patch(`/orders/admin/${id}/status`, { status });
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.post(`/orders/cancel/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/orders/stats/overview');
    return response.data;
  },

  previewCart: async (items: Array<{ productId: string; quantity: number }>) => {
    const response = await api.post('/orders/cart/preview', { items });
    return response.data;
  },
};

export default api;