import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadCsv = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const login = (credentials) => apiClient.post('/auth/login', credentials);
export const register = (credentials) => apiClient.post('/auth/register', credentials);
export const getPredictions = () => apiClient.get('/predict');
export const getHotspots = () => apiClient.get('/hotspots');