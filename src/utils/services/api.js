import axios from "axios";

import { ACCESS_TOKEN, API_URL } from "../constants";


const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use((config) => {
  const options = config;
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) options.headers.Authorization = token;
  return options;
});

export default API;
