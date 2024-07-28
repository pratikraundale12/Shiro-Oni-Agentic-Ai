import API from './api';

export const getNamespacesList = async ({ clusterId, ...params }) => {
  const { data } = await API.get(`/clusters/${clusterId}/namespaces`, {
    ...params,
  });
  return data;
};

export const fetchClustersList = async params => {
  const { data } = await API.get('/clusters', { params });
  return data;
};
