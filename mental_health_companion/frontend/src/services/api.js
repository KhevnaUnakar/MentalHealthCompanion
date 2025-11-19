import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: () => api.post('/auth/logout/'),
  getProfile: () => api.get('/auth/profile/'),
};

export const chatAPI = {
  getSessions: () => api.get('/chat/sessions/'),
  createSession: (mood) => api.post('/chat/sessions/create/', { mood }),
  getSession: (id) => api.get(`/chat/sessions/${id}/`),
  sendMessage: (sessionId, message) => api.post(`/chat/sessions/${sessionId}/message/`, { message }),
  deleteSession: (id) => api.delete(`/chat/sessions/${id}/delete/`),
};

export const moodAPI = {
  trackMood: (data) => api.post('/mood/track/', data),
  getHistory: (days = 30) => api.get(`/mood/history/?days=${days}`),
  getAnalytics: (days = 30) => api.get(`/mood/analytics/?days=${days}`),
};

export const newsAPI = {
  getArticles: () => api.get('/news/articles/'),
  refreshArticles: () => api.get('/news/articles/refresh/'),
};

export default api;
