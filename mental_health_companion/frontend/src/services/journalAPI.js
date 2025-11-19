import api from './api';

export const journalAPI = {
  // Journal
  getEntries: () => api.get('/journal/entries/'),
  createEntry: (data) => api.post('/journal/entries/', data),
  getEntry: (id) => api.get(`/journal/entries/${id}/`),
  updateEntry: (id, data) => api.put(`/journal/entries/${id}/`, data),
  deleteEntry: (id) => api.delete(`/journal/entries/${id}/`),
  
  // Meditation
  getMeditationSessions: () => api.get('/journal/meditation/'),
  createMeditationSession: (data) => api.post('/journal/meditation/', data),
  getMeditationStats: () => api.get('/journal/meditation/stats/'),
  
  // Self-Care
  getSelfCareActivities: () => api.get('/journal/selfcare/'),
  createSelfCareActivity: (data) => api.post('/journal/selfcare/', data),
  completeActivity: (id) => api.put(`/journal/selfcare/${id}/complete/`),
  deleteActivity: (id) => api.delete(`/journal/selfcare/${id}/delete/`),
};
