import axios from 'axios';

const api = axios.create({
  baseURL:'https://kisanmitra-ug40.onrender.com/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('km_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;