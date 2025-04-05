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
  const clusterLogout = ({ clusterId, payload = {} }) =>
    api.post(`/clusters/${clusterId}/logout`, payload);
  const getNiFiVersions = () => api.get(`/nifi-versions/list-versions`);

  const checkCredentialsClusterSetup = ({ payload }) =>
    api.post(`/test-host-credentials/test-private-keys`, payload);

  const fetchHostNodesList = ({ payload }) => {
    const url = payload
      ? `cluster-nodes/list-nodes`
      : `cluster-nodes/list-nodes?is_selected=false`;
    return api.get(url);
  };
  const addIndividualHost = ({ payload }) =>
    api.post(`/clusters/add-node/node-private-keys`, payload);

  const deleteIndividualHost = ({ hostId }) =>
    api.delete(`/clusters/delete-node/${hostId}`);
  const updateIndividualHost = ({ hostId, payload }) =>
    api.patch(`/clusters/update-node/${hostId}/node-private-keys`, payload);
  const getConfigList = ({ nifiVersion }) => {
    const url = nifiVersion
      ? `/get-list-configs?nifi_version=${nifiVersion}`
      : `/get-list-configs`;
    return api.get(url);
  };
  const addConfigClusterSetup = ({ payload }) =>
    api.post(`/clusters/add-config/configuration-files`, payload);
  const deleteConfig = ({ configId }) =>
    api.delete(`/clusters/delete-config/${configId}`);

  const getConfigVersions = ({ configName }) => {
    return api.get(`get-config-version?config_name=${configName}`);
  };
  const createCluster = ({ payload }) =>
    api.post(`/clusters/ansible/create-cluster`, payload);
  const getSingleConfigData = ({ configId }) => {
    return api.get(`/cluter-configs/${configId}`);
  };
  return {
    fetchClusters,
    fetchClusterList,
    fetchClusterNodes,
    getClusterToken,
    clusterLogout,
    getNiFiVersions,
    checkCredentialsClusterSetup,
    fetchHostNodesList,
    addIndividualHost,
    deleteIndividualHost,
    updateIndividualHost,
    getConfigList,
    addConfigClusterSetup,
    deleteConfig,
    getConfigVersions,
    createCluster,
    getSingleConfigData,
  };
};
