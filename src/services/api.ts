import axios, { InternalAxiosRequestConfig } from 'axios';
import { Location, Review, AuthResponse } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    characterName: string;
    characterClass: string;
    characterRace: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData);
    return response.data as AuthResponse;
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data as AuthResponse;
  },
};

// Locations API
export const locationsApi = {
  getAll: async (): Promise<Location[]> => {
    const response = await api.get('/locations');
    return response.data;
  },

  getById: async (id: string): Promise<Location> => {
    const response = await api.get(`/locations/${id}`);
    return response.data;
  },

  getByType: async (type: string): Promise<Location[]> => {
    const response = await api.get(`/locations?type=${type}`);
    return response.data;
  },

  getByWorld: async (world: string): Promise<Location[]> => {
    const response = await api.get(`/locations?world=${world}`);
    return response.data;
  },

  create: async (locationData: Omit<Location, 'id' | 'createdBy' | 'averageRating' | 'createdAt'>): Promise<Location> => {
    const response = await api.post('/locations', locationData);
    return response.data;
  },

  update: async (id: string, locationData: Partial<Location>): Promise<Location> => {
    const response = await api.put(`/locations/${id}`, locationData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/locations/${id}`);
  },
};

// Reviews API
export const reviewsApi = {
  getByLocation: async (locationId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/location/${locationId}`);
    return response.data as Review[];
  },

  getByUser: async (userId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/user/${userId}`);
    return response.data as Review[];
  },

  create: async (reviewData: Omit<Review, 'id' | 'user' | 'createdAt'>): Promise<Review> => {
    const response = await api.post('/reviews', reviewData);
    return response.data as Review;
  },

  update: async (id: string, reviewData: Partial<Review>): Promise<Review> => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data as Review;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};

export default api; 