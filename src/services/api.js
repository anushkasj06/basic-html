import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const auth = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const profile = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

export const quiz = {
  getAnswers: () => api.get('/quiz/answers'),
};

export default api; 