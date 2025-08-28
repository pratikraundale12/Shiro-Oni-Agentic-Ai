import axios from 'axios';

import { ACCESS_TOKEN, API_URL } from '../../constants';

const API = axios.create({
  baseURL: `${API_URL}/api`,
});

API.interceptors.request.use(config => {
  const options = config;
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) options.headers.Authorization = `Bearer ${token}`;
  if (options.data instanceof FormData) {
    delete options.headers['Content-Type'];
  }
  return options;
});

// Response Interceptor for handling 401
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      localStorage.removeItem(ACCESS_TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
