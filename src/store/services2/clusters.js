export const clustersAPI = api => {
  const fetchClusters = ({ params = {}, payload = {} }) => {
    const body = payload || [];
    return api.post('/list-clusters', body, { params });
  };
  const fetchClusterList = ({ params = {} }) =>
    api.get('/get-list-clusters', params);
  const fetchClusterNodes = ({ queryParams: { clusterId }, params = {} }) =>
    api.get(`/clusters/${clusterId}/nodes`, params);

  const getClusterToken = ({ payload }) => api.post(`/clusters/token`, payload);

  return {
    fetchClusters,
    fetchClusterList,
    fetchClusterNodes,
    getClusterToken,
  };
};
