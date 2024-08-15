import { CLUSTERS_TOKEN } from '../../constants';

export const namespacesAPI = api => {
  const fetchNamespaces = ({
    params = {},
    queryParams: { clusterId, namespaceId },
  }) => {
    const clusterData = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
    const selectedCluster = clusterData.find(item => item.id === clusterId);
    api.headers['x-cluster-id'] = selectedCluster?.id;
    api.headers['x-cluster-token'] = selectedCluster?.token;
    return api.get(
      `/clusters/${selectedCluster.id}/namespaces${namespaceId && `/${namespaceId}`}`,
      params
    );
  };

  const checkDestCluster = ({
    clusterId,
    srcClusterId,
    srcClusterToken,
    path,
  }) =>
    api.post(`/clusters/${clusterId}/check`, {
      srcClusterId,
      srcClusterToken,
      path,
    });

  const updateNamespaceStatus = ({ clusterId, namespaceId, state }) => {
    return api.put(`/status-update/${clusterId}/namespace/${namespaceId}`, {
      state,
    });
  };

  const getVariableList = ({ clusterId, namespaceId }) =>
    api.get(`clusters/${clusterId}/namespaces/${namespaceId}/variables`);

  const addVariableServices = ({
    clusterId,
    namespaceId,
    version,
    variables,
  }) => {
    api.post(`clusters/${clusterId}/namespaces/${namespaceId}/variables`, {
      version,
      variables: variables.map(variable => ({
        variable: {
          name: variable.name,
          value: variable.value,
        },
      })),
    });
  };
  const getVariableServices = async ({ clusterId, namespaceId, clientId }) => {
    api.get(
      `clusters/${clusterId}/namespaces/${namespaceId}/variable-requests/${clientId}`
    );
  };

  const deleteVariableServices = async ({
    clusterId,
    namespaceId,
    clientId,
  }) => {
    api.get(
      `clusters/${clusterId}/namespaces/${namespaceId}/variable-requests/${clientId}`
    );
  };

  const deployCluster = ({ clusterId, ...rest }) =>
    api.post(`/clusters/${clusterId}/deploy`, rest);

  const upgradeCluster = ({ clusterId, ...rest }) =>
    api.post(`/clusters/${clusterId}/upgrade`, rest);

  const clusterProgress = ({ clusterId, progressId }) =>
    api.get(`/clusters/${clusterId}/progress/${progressId}`);

  const clusterProgressDelete = ({ clusterId, progressId }) =>
    api.delete(`/clusters/${clusterId}/progress/${progressId}`);

  const getCountDetails = ({ clusterId, namespaceId }) =>
    api.get(`/clusters/${clusterId}/namespace/${namespaceId}`);

  const fetchParameterContext = ({ clusterId, parameterId }) =>
    api.get(`parameter-context/${clusterId}?contextId=${parameterId}`);

  const updateParameterContextService = ({
    clusterId,
    parameterContextId,
    updateData,
  }) =>
    api.post(
      `parameter-context/${clusterId}/contextId/${parameterContextId}`,
      updateData
    );

  return {
    fetchNamespaces,
    checkDestCluster,
    deployCluster,
    updateNamespaceStatus,
    upgradeCluster,
    clusterProgress,
    clusterProgressDelete,
    getCountDetails,
    fetchParameterContext,
    updateParameterContextService,
    getVariableList,
    addVariableServices,
    deleteVariableServices,
    getVariableServices,
  };
};
