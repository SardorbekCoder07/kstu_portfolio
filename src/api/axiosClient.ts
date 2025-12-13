import axios from 'axios';

const axiosClient = axios.create({
  // baseURL: 'http://5.189.158.5:8080/',
  baseURL: 'https://admin.qdtu.uz/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
