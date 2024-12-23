import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createWorkoutPlan = (data) => api.post('/workouts/create', data);
export const fetchClientWorkouts = (clientId) => api.get(`/workouts/client/${clientId}`);
export const fetchTrainerClients = (trainerId) => api.get(`/trainer/${trainerId}/clients`);

export default api;
