import apisauce from 'apisauce';
import { ACCESS_TOKEN, API_URL } from '../../constants';
import { history } from '../../helpers/history';
import { activityHistoryAPI } from './activityHistory';
import { aiFlowGeneratorAPI } from './aiFlowGenerator';
import { authenticationAPI } from './auth';
import { clustersAPI } from './clusters';
import { dashboardAPI } from './dashboard';
import { flowValidationAPI } from './flowValidation';
import { namespacesAPI } from './namespaces';
import { policiesAPI } from './policies';
import { rolesAPI } from './roles';
import { schedularAPI } from './schedular';
import { settingsAPI } from './setting';
import { usersAPI } from './users';

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

  api.axiosInstance.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        const { data } = error.response;
        if (data?.raw?.raw?.requireClusterLogin) {
          localStorage.removeItem('selected_cluster');
          window.location.reload();
        }
        if (data.raw?.log_out) {
          localStorage.clear();
          history.push('/login');
        }
      }

      // Reject the promise with the error
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
    // Settings
    ...settingsAPI(api),
    // Activity History
    ...activityHistoryAPI(api),
    // Flow Validation
    ...flowValidationAPI(api),
    // AI Flow Generator
    ...aiFlowGeneratorAPI(api),
  };
};

export default {
  create,
};
