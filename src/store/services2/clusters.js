export const clustersAPI = api => {
  const fetchClusters = ({ params = {}, payload = {} }) => {
    const body = JSON.parse(payload) || [];
    return api.post('/list-clusters', body, { params });
  };
  const fetchClusterList = ({ params = {} }) =>
    api.get('/list-clusters', params);
  const fetchClusterNodes = ({ queryParams: { clusterId }, params = {} }) =>
    api.get(`/clusters/${clusterId}/nodes`, params);

  return {
    fetchClusters,
    fetchClusterList,
    fetchClusterNodes,
  };
};
