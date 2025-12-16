import axios from 'axios';

const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const API_BASE = `http://${host}:5000/api`;

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default api;
export { API_BASE };
