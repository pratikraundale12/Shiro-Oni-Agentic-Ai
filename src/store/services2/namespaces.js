export const namespacesAPI = api => {
  const fetchNamespaces = ({
    params = {},
    queryParams: { clusterId, namespaceId, is_scheduled },
  }) => {
    return api.get(
      `/clusters/${clusterId}/namespaces${namespaceId && `/${namespaceId}`}?is_scheduled=${is_scheduled || false}`,
      params
    );
  };

  const checkDestCluster = ({
    clusterId,
    srcClusterId,
    srcClusterToken,
    path,
    is_scheduled,
    sourceNamespaceId,
  }) =>
    api.post(`/clusters/${clusterId}/check`, {
      srcClusterId,
      srcClusterToken,
      path,
      is_scheduled,
      sourceNamespaceId,
    });

  const updateNamespaceStatus = ({ clusterId, namespaceId, state }) => {
    return api.put(`/status-update/${clusterId}/namespace/${namespaceId}`, {
      state,
    });
  };

  const getVariableList = ({ clusterId, namespaceId }) =>
    api.get(`clusters/${clusterId}/namespaces/${namespaceId}/variables`);
  const getAllRootControllerServiceNamespace = ({ clusterId, namespaceId }) => {
    const url =
      namespaceId && window?.location?.pathname != '/controller-service'
        ? `controller-services/${clusterId}/namespace/${namespaceId}`
        : `controller-services/${clusterId}/namespace`;

    return api.get(url);
  };

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

  const deployCluster = ({ clusterId, payload }) =>
    api.post(`/clusters/${clusterId}/deploy`, payload);

  const upgradeCluster = ({ clusterId, payload }) =>
    api.post(`/clusters/${clusterId}/upgrade`, payload);

  const clusterProgress = ({ clusterId, progressId, auditId }, queryParams) =>
    api.get(
      `/clusters/${clusterId}/progress/${progressId}?auditId=${auditId}`,
      queryParams
    );

  const clusterProgressDelete = ({ clusterId, progressId }) =>
    api.delete(`/clusters/${clusterId}/progress/${progressId}`);

  const getCountDetails = ({ clusterId, namespaceId }) =>
    api.get(`/clusters/${clusterId}/namespace/${namespaceId}`);

  const fetchParameterContext = ({
    clusterId,
    parameterId,
    includeInherited,
  }) =>
    api.get(
      `parameter-context/${clusterId}?contextId=${parameterId}&includeInherited=${includeInherited}`
    );

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

  const singleNamespaceData = ({
    params = {},
    queryParams: { clusterId, namespaceId },
  }) => {
    return api.get(`/clusters/${clusterId}/namespace/${namespaceId}`, params);
  };

  const getAllControllerServiceToAdd = ({ clusterId }) =>
    api.get(`/list-controller-services/${clusterId}`);

  const addControllerServiceRootLevel = ({
    clusterId,
    payloadData,
    namespaceId,
  }) => {
    const url = namespaceId
      ? `controller-services/${clusterId}/namespace/${namespaceId}`
      : `controller-services/${clusterId}/namespace`;

    return api.post(url, payloadData);
  };

  const addPropertyControllerService = ({
    clusterId,
    controllerId,
    payloadData,
  }) =>
    api.put(
      `controller-services/${clusterId}/service/${controllerId}`,
      payloadData
    );

  const getNewPropertyControllerService = ({
    clusterId,
    type,
    group,
    artifact,
    version,
  }) =>
    api.get(
      `/controller-services/${clusterId}/service-type?type=${type}&group=${group}&artifact=${artifact}&version=${version}`
    );

  const getNewPropertyControllerServiceUpdated = ({ clusterId, serviceName }) =>
    api.get(
      `/${clusterId}/controller-service-types?serviceName=${serviceName}`
    );

  const addControllerServicePropertyByDropdown = ({
    clusterId,
    payloadData,
    namespaceId,
  }) => {
    const url = namespaceId
      ? `controller-services/${clusterId}/namespace/${namespaceId}`
      : `controller-services/${clusterId}/namespace`;

    return api.post(url, payloadData);
  };

  const changeStatusControllerService = ({
    clusterId,
    payloadData,
    controllerId,
  }) =>
    api.put(
      `controller-services/status/${clusterId}/service/${controllerId}`,
      payloadData
    );
  const deleteControllerService = ({ clusterId, payloadData, controllerId }) =>
    api.delete(
      `controller-services/${clusterId}/service/${controllerId}`,
      payloadData
    );
  const fetchNamespacesForDestiationCluster = ({ clusterId, namespaceId }) => {
    return api.get(`/clusters/${clusterId}/namespaces${`/${namespaceId}`}`);
  };

  const fetchRegistryData = ({ clusterId, registriesId }) => {
    return api.get(`/buckets/${clusterId}/registry/${registriesId}`);
  };

  const fetchFlowNameList = ({ clusterId, registriesId, bucketId }) => {
    return api.get(
      `/flows/${clusterId}/registry/${registriesId}/buckets/${bucketId}`
    );
  };

  const fetchVersionData = ({ clusterId, registriesId, bucketId, flowId }) => {
    return api.get(
      `/versions/${clusterId}/registry/${registriesId}/buckets/${bucketId}/flows/${flowId}`
    );
  };

  const fetchRegistryFlowDetails = ({
    clusterId,
    namespaceId,
    bucketId,
    flowId,
    version,
    isUpgrade = false,
  }) => {
    const URL = isUpgrade
      ? `/upgrade/${clusterId}/namespaceId/${namespaceId}/buckets/${bucketId}/flows/${flowId}/versions/${version}`
      : `/exports/${clusterId}/buckets/${bucketId}/flows/${flowId}/versions/${version}`;
    return api.get(URL);
  };

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
    singleNamespaceData,
    getAllRootControllerServiceNamespace,
    getAllControllerServiceToAdd,
    addControllerServiceRootLevel,
    addPropertyControllerService,
    getNewPropertyControllerService,
    getNewPropertyControllerServiceUpdated,
    addControllerServicePropertyByDropdown,
    changeStatusControllerService,
    deleteControllerService,
    fetchNamespacesForDestiationCluster,
    fetchRegistryData,
    fetchFlowNameList,
    fetchVersionData,
    fetchRegistryFlowDetails,
  };
};
