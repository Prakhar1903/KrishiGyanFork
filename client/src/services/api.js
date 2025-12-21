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

// Handle 401 responses (invalid/expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

export const expenseAPI = {
  getExpenses: () => api.get('/expenses'),
  addExpense: (data) => api.post('/expenses', data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};

export const incomeAPI = {
  getIncome: () => api.get('/income'),
  saveIncome: (data) => api.put('/income', data),
};

export const taskAPI = {
  getTasks: () => api.get('/tasks'),
  addTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export default api;