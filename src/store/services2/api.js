import apisauce from 'apisauce';

import { API_URL, ACCESS_TOKEN } from '../../constants';
import { authenticationAPI } from './auth';
import { dashboardAPI } from './dashboard';
import { clustersAPI } from './clusters';
import { usersAPI } from './users';
import { namespacesAPI } from './namespaces';
import { rolesAPI } from './roles';
import { policiesAPI } from './policies';
import { schedularAPI } from './schedular';

const create = (baseURL = `${API_URL}/api`) => {
  const api = apisauce.create({
    baseURL,
  });

  // Request interceptors for all API calls
  api.axiosInstance.interceptors.request.use(
    async config => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      // Remove 'Content-Type' for FormData to let Axios set the correct multipart header automatically
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Interface
  return {
    ...api,
    // Authentication
    ...authenticationAPI(api),
    // Dashboard
    ...dashboardAPI(api),
    // Users
    ...usersAPI(api),
    // Clusters
    ...clustersAPI(api),
    // Namespaces
    ...namespacesAPI(api),
    // Roles
    ...rolesAPI(api),
    // Policies
    ...policiesAPI(api),
    // Schedular
    ...schedularAPI(api),
  };
};

export default {
  create,
};
