import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createWorkoutPlan = (data) => api.post('/workouts/create', {
  name: data.name,
  description: data.description,
  client_id: data.clientId,
  exercises: data.workouts.map(w => ({
    type: w.type,
    exercise_name: w.exercise,
    reps: parseInt(w.reps) || 0,
    sets: parseInt(w.sets) || 0,
    duration: parseInt(w.duration) || 0,
    laps: parseInt(w.laps) || 0,
    notes: w.notes
  }))
});

export const fetchClientWorkouts = async (clientId) => {
  return await axios.get(`/api/client-workouts/${clientId}`);
};
export const fetchTrainerClients = (trainerId) => api.get(`/trainer/clients/${trainerId}`);

export default api;