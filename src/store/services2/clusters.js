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

  const fetchHostNodesList = ({ clusterId, update_node, payload }) => {
    const url = update_node
      ? `cluster-nodes/list-nodes?update_node=${update_node}&cluster_id=${clusterId}`
      : payload
        ? `cluster-nodes/list-nodes`
        : clusterId
          ? `cluster-nodes/list-nodes?cluster_id=${clusterId}`
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
  const changeClusterActionState = ({ clusterId, payload }) => {
    return api.post(`/clusters/${clusterId}/actions`, payload);
  };
  const fetchClusterRegistryNodes = ({ clusterId }) => {
    return api.get(`/clusters/${clusterId}/nodes-registry`);
  };
  const fetchRunningStatusCluster = ({ clusterId }) => {
    return api.get(`/clusters/${clusterId}/status`);
  };
  const fetchClusterMetrics = ({ clusterId }) => {
    return api.get(`/clusters/${clusterId}/metrics`);
  };
  const associateClusterWithRegistry = ({ clusterId, payload }) => {
    return api.post(`/clusters/${clusterId}/associate-registry`, payload);
  };

  const createClusterServiceAcc = ({ payload }) => {
    return api.post(`/clusters`, payload);
  };

  const updateClusterServiceAcc = ({ clusterId, payload }) => {
    return api.patch(`/clusters/${clusterId}`, payload);
  };

  const fetchAnsibleClusterData = ({ clusterId }) => {
    return api.get(`/clusters/${clusterId}/get-edit-details`);
  };
  const upgradeAnsibleCluster = ({ clusterId, payload }) => {
    return api.post(`/clusters/${clusterId}/ansible/upgrade-cluster`, payload);
  };
  const updateNodesAnsibleCluster = ({ clusterId, payload }) => {
    return api.post(`/clusters/${clusterId}/ansible/update-nodes`, payload);
  };
  const deleteAnsibleClusterHard = ({ clusterId }) =>
    api.delete(`clusters/${clusterId}/nifi_uninstall`);

  const fetchAnsibleCLusterProcessData = ({
    clusterId,
    process_id,
    process_name,
    cluster_type,
  }) => {
    let url = `/clusters/${clusterId}/ansible-logs?process_id=${process_id}&process_name=${process_name}`;

    if (cluster_type) {
      url += `&cluster_type=${cluster_type}`;
    }

    return api.get(url);
  };

  const fetchAllConfigPropertiesWithValue = ({ version }) => {
    return api.post(`/clusters/config-properties/${version}`);
  };
  const testMultipleNodes = ({ payload }) => {
    return api.post(`/test-hosts-credentials/test-private-keys`, payload);
  };
  const updateMultipleNodeswithSSH = ({ id, payload }) => {
    return api.patch(`/clusters/${id}/update-multiple-nodes`, payload);
  };
  const fetchSSHstatus = ({ clusterId }) => {
    return api.get(`/clusters/${clusterId}/check-ssh-details`);
  };
  const addNarFile = ({ clusterId, payload }) => {
    return api.post(`/clusters/${clusterId}/upload-nars`, payload);
  };
  const fetchNarList = ({ clusterId }) => {
    return api.get(`/clusters/${clusterId}/nars-list`);
  };
  const restartCluster = ({ clusterId, payload }) => {
    return api.post(`/clusters/${clusterId}/restart`, payload);
  };
  const uploadClusterDriver = ({ clusterId, payload }) => {
    return api.post(`/clusters/${clusterId}/upload-drivers`, payload);
  };
  const fetchDriversList = ({ clusterId }) => {
    return api.get(`/clusters/${clusterId}/drivers-list`);
  };

  const fetchMasterHostNodesList = () => {
    const url = `cluster-nodes/list-master-nodes`;
    return api.get(url);
  };
  const fetchConfigFieldsForKubernetes = () => {
    return api.get(`/config-fields`);
  };
  const createConfigForKubernetesCluster = ({ payload }) => {
    return api.post(`/create-config`, payload);
  };
  const fetchConfigListForKubernetes = () => {
    return api.get(`/list-configs`);
  };
  const createKubernetesCluster = ({ payload }) => {
    return api.post(`/kube/create-cluster`, payload);
  };
  const deleteKubeConfig = ({ id }) => api.delete(`/delete-kube-config/${id}`);
  const fetchConfigVersionsPerConfig = ({ config_name }) => {
    return api.get(`/config-version?config_name=${config_name}`);
  };
  const createKubernetesMasterNodeCluster = ({ payload }) => {
    return api.post(`/clusters/add-master-node`, payload);
  };
  const deleteMasterNodeConfig = ({ id }) =>
    api.delete(`/delete-master-node/${id}`);
  const fetchKubeClusterDataToUpgrade = ({ id }) => {
    return api.get(`/clusters/${id}/get-upgrade-details`);
  };
  const deleteClusterKube = ({ clusterIdToDelete, deleteType, payload }) =>
    api.post(
      `clusters/delete-kube-cluster/${clusterIdToDelete}/${deleteType}`,
      payload
    );
  const deleteClusterNarFile = ({ id, narId }) =>
    api.delete(`/clusters/${id}/nars/${narId}`);

  const deleteClusterDriverFile = ({ id, driverId }) =>
    api.delete(`/clusters/${id}/drivers/${driverId}`);

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
    changeClusterActionState,
    fetchClusterRegistryNodes,
    fetchRunningStatusCluster,
    fetchClusterMetrics,
    associateClusterWithRegistry,
    createClusterServiceAcc,
    updateClusterServiceAcc,
    fetchAnsibleClusterData,
    upgradeAnsibleCluster,
    updateNodesAnsibleCluster,
    deleteAnsibleClusterHard,
    fetchAnsibleCLusterProcessData,
    fetchAllConfigPropertiesWithValue,
    testMultipleNodes,
    updateMultipleNodeswithSSH,
    fetchSSHstatus,
    addNarFile,
    fetchNarList,
    restartCluster,
    uploadClusterDriver,
    fetchDriversList,
    fetchMasterHostNodesList,
    fetchConfigFieldsForKubernetes,
    createConfigForKubernetesCluster,
    fetchConfigListForKubernetes,
    deleteKubeConfig,
    createKubernetesCluster,
    fetchConfigVersionsPerConfig,
    createKubernetesMasterNodeCluster,
    deleteMasterNodeConfig,
    fetchKubeClusterDataToUpgrade,
    deleteClusterKube,
    deleteClusterNarFile,
    deleteClusterDriverFile,
  };
};
