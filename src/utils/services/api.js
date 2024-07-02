import axios from "axios";

import { ACCESS_TOKEN, API_URL } from "../constants";


const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use((config) => {
  const options = config;
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) options.headers.Authorization = `Bearer ${token}`;
  return options;
});

// remove token when user get unauthorized status (401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem(ACCESS_TOKEN);
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default API;
