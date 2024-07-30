import API from './api';

export const getNamespacesList = async ({
  clusterId,
  namespaceId = '',
  ...params
}) => {
  const { data } = await API.get(
    `/clusters/${clusterId}/namespaces${namespaceId ? `/${namespaceId}` : ''}`,
    {
      params,
    }
  );
  return data;
};

export const fetchClustersList = async params => {
  const { data } = await API.get('/clusters', { params });
  return data;
};

export const checkCluster = async ({ clusterId, srcClusterId, path }) => {
  const { data } = await API.post(`/clusters/${clusterId}/check`, {
    srcClusterId,
    path,
  });
  return data;
};
export const upgradeCluster = async ({ clusterId, namespaceId, version }) => {
  const { data } = await API.post(`/clusters/${clusterId}/upgrade`, {
    namespaceId,
    version,
  });
  return data;
};

export const getClusterProgress = async ({ clusterId, progressId }) => {
  const { data } = await API.get(
    `/clusters/${clusterId}/progress/${progressId}`
  );
  return data;
};

export const getClusterProgressDelete = async ({ clusterId, progressId }) => {
  const { data } = await API.delete(
    `/clusters/${clusterId}/progress/${progressId}`
  );
  return data;
};

export const getCountDetails = async ({ clusterId, namespaceId }) => {
  const { data } = await API.get(
    `/clusters/${clusterId}/namespaces/${namespaceId}`
  );
  return data;
};
