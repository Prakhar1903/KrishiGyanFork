// src/services/api.js
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const farmAPI = {
  getFarms: () => api.get('/farm'),
  addFarm: (farmData) => api.post('/farm', farmData),
  updateFarm: (id, farmData) => api.put(`/farm/${id}`, farmData),
  deleteFarm: (id) => api.delete(`/farm/${id}`),
};

export const cropAPI = {
  getRecommendations: (data) => api.post('/crops/recommendations', data),
  searchCrops: (query) => api.get(`/crops/search/${query}`),
  getCropDetails: (id) => api.get(`/crops/${id}`),
};

export const weatherAPI = {
  getWeather: (district) => api.get(`/weather/${district}`),
};

export default api;