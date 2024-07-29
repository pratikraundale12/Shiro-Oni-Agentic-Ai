import API from './api';

export const getAllClustersApi = async () => {
  try {
    return await API.get(`/clusters`);
  } catch (error) {
    return error.response.data;
  }
};

export const getInitialClusterData = async id => {
  try {
    return await API.get(`/dashboard-insight/${id}/namespaces`);
  } catch (error) {
    return error.response.data;
  }
};
