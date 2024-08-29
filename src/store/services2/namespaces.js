export const namespacesAPI = api => {
  const fetchNamespaces = ({
    params = {},
    queryParams: { clusterId, namespaceId },
  }) => {
    return api.get(
      `/clusters/${clusterId}/namespaces${namespaceId && `/${namespaceId}`}`,
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
    sourceNamespaceName,
  }) =>
    api.post(`clusters/${clusterId}/namespaces/${namespaceId}/variables`, {
      sourceNamespaceName,
      version,
      variables: variables.map(variable => ({
        variable: {
          name: variable.name,
          value: variable.value,
        },
      })),
    });

  const getVariableServices = ({
    clusterId,
    namespaceId,
    requestId,
    sourceNamespaceName,
  }) =>
    api.get(
      `clusters/${clusterId}/namespaces/${namespaceId}/variable-requests/${requestId}`,
      { sourceNamespaceName }
    );

  const deleteVariableServices = ({ clusterId, namespaceId, requestId }) =>
    api.delete(
      `clusters/${clusterId}/namespaces/${namespaceId}/variable-requests/${requestId}`
    );

  const deployCluster = ({ clusterId, ...rest }) =>
    api.post(`/clusters/${clusterId}/deploy`, rest);

  const upgradeCluster = ({ clusterId, ...rest }) =>
    api.post(`/clusters/${clusterId}/upgrade`, rest);

  const clusterProgress = ({ clusterId, progressId }, queryParams) =>
    api.get(`/clusters/${clusterId}/progress/${progressId}`, queryParams);

  const clusterProgressDelete = ({ clusterId, progressId }) =>
    api.delete(`/clusters/${clusterId}/progress/${progressId}`);

  const getCountDetails = ({ clusterId, namespaceId }) =>
    api.get(`/clusters/${clusterId}/namespace/${namespaceId}`);

  const fetchParameterContext = ({ clusterId, parameterId }) =>
    api.get(`parameter-context/${clusterId}?contextId=${parameterId}`);

  const updateParameterContext = ({
    clusterId,
    parameterContextId,
    payloadData,
  }) =>
    api.post(
      `parameter-context/${clusterId}/contextId/${parameterContextId}`,
      payloadData
    );

  const getParameterContextStatus = ({
    clusterId,
    parameterContextId,
    requestId,
  }) =>
    api.get(
      `parameter-context/${clusterId}/contextId/${parameterContextId}/requestId/${requestId}`
    );

  const deleteParameterContext = ({
    clusterId,
    parameterContextId,
    requestId,
  }) =>
    api.delete(
      `parameter-context/${clusterId}/contextId/${parameterContextId}/requestId/${requestId}`
    );

  const fetchNamespaceAudit = ({ params = {} }) =>
    api.get('/audit', { ...params });

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
    updateParameterContext,
    getParameterContextStatus,
    deleteParameterContext,
    getVariableList,
    addVariableServices,
    deleteVariableServices,
    getVariableServices,
    fetchNamespaceAudit,
  };
};
