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
  const getAllRootControllerServiceNamespace = ({
    clusterId,
    namespaceId,
    localOnly,
    use_service_account,
    is_from_toggle,
    is_from_pg_details = false,
  }) => {
    const url =
      namespaceId &&
      use_service_account &&
      is_from_toggle &&
      window?.location?.pathname != '/controller-service' &&
      !localOnly
        ? `controller-services/${clusterId}/namespace/${namespaceId}?use_service_account=true`
        : namespaceId &&
            window?.location?.pathname != '/controller-service' &&
            localOnly &&
            !use_service_account
          ? `controller-services/${clusterId}/namespace/${namespaceId}?localOnly=true`
          : is_from_toggle && localOnly && use_service_account
            ? `controller-services/${clusterId}/namespace/${namespaceId}?localOnly=true&use_service_account=true`
            : use_service_account &&
                !is_from_toggle &&
                window?.location?.pathname != '/controller-service'
              ? `controller-services/${clusterId}/namespace?use_service_account=true`
              : is_from_pg_details &&
                  namespaceId &&
                  window?.location?.pathname != '/controller-service'
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
    namespaceId,
    flowVersion,
  }) =>
    api.get(
      `parameter-context/${clusterId}/contextId/${parameterContextId}/requestId/${requestId}?namespaceId=${namespaceId}&flowVersion=${flowVersion}`
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

  const getAllControllerServiceToAdd = ({ clusterId, use_service_account }) => {
    return use_service_account
      ? api.get(
          `/list-controller-services/${clusterId}?use_service_account=true`
        )
      : api.get(`/list-controller-services/${clusterId}`);
  };

  const addControllerServiceRootLevel = ({
    clusterId,
    payloadData,
    namespaceId,
    isFromPgDetails,
  }) => {
    const { isFromControllerServiceTab } = payloadData;
    const url =
      namespaceId && !isFromControllerServiceTab && isFromPgDetails
        ? `controller-services/${clusterId}/namespace/${namespaceId}`
        : !namespaceId && isFromControllerServiceTab && !isFromPgDetails
          ? `controller-services/${clusterId}/namespace?use_service_account=true`
          : `controller-services/${clusterId}/namespace`;
    const updatedPayload = {
      name: payloadData.name,
      type: payloadData?.type,
      bundle: payloadData?.bundle,
    };
    return api.post(url, updatedPayload);
  };

  const addPropertyControllerService = ({
    clusterId,
    controllerId,
    payloadData,
    use_service_account,
  }) => {
    return use_service_account
      ? api.put(
          `controller-services/${clusterId}/service/${controllerId}?use_service_account=true`,
          payloadData
        )
      : api.put(
          `controller-services/${clusterId}/service/${controllerId}`,
          payloadData
        );
  };

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
    use_service_account,
  }) => {
    return use_service_account
      ? api.put(
          `controller-services/status/${clusterId}/service/${controllerId}?use_service_account=${use_service_account}`,
          payloadData
        )
      : api.put(
          `controller-services/status/${clusterId}/service/${controllerId}`,
          payloadData
        );
  };
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

  const fetchVersionData = ({
    clusterId,
    registriesId,
    bucketId,
    flowId,
    namespaceId,
  }) => {
    return api.get(
      `/versions/${clusterId}/registry/${registriesId}/buckets/${bucketId}/flows/${flowId}?namespaceId=${namespaceId}`
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
  const fetchDuplicateScheduleData = ({ flowId }) => {
    return api.get(`/check-exisiting-flow/${flowId}`);
  };

  const fetchAddPropertyToAdd = ({
    clusterId,
    controllerId,
    propertyName,
    sensitive,
  }) => {
    return api.get(
      `controller-services/${clusterId}/service/${controllerId}/descriptor?propertyName=${propertyName}&sensitive=${sensitive || false}`
    );
  };

  const fetchSanityCheckSummaryData = ({ namespaceId }) => {
    return api.get(`namespace/${namespaceId}/sanity-check`);
  };
  const fetchLocalChanges = ({ clusterId, namespaceId }) => {
    return api.get(
      `/clusters/${clusterId}/namespaces/${namespaceId}/local-changes`
    );
  };

  const revertLocalChanges = ({ clusterId, namespaceId }) => {
    return api.post(
      `/clusters/${clusterId}/namespaces/${namespaceId}/revert-local-changes`
    );
  };

  const deleteNamespace = ({ clusterId, namespaceId }) => {
    return api.delete(`/clusters/${clusterId}/namespace/${namespaceId}`);
  };

  const getInvalidProcessorDetails = ({ clusterId, namespaceId }) => {
    return api.get(
      `/clusters/${clusterId}/namespace/${namespaceId}/invalid-processors`
    );
  };
  const fetchSanityReportAuditLog = ({ recordId }) => {
    return api.get(`sanity-report/${recordId}`);
  };

  const getDeleteNamespaceDetails = ({ clusterId, namespaceId }) => {
    return api.get(
      `/clusters/${clusterId}/namespaces/${namespaceId}/namespace-details`
    );
  };

  const fetchLastSanityReport = ({ namespaceId }) => {
    return api.get(`/last-sanity-report/${namespaceId}`);
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
    fetchDuplicateScheduleData,
    fetchAddPropertyToAdd,
    fetchSanityCheckSummaryData,
    fetchLocalChanges,
    revertLocalChanges,
    deleteNamespace,
    getInvalidProcessorDetails,
    fetchSanityReportAuditLog,
    getDeleteNamespaceDetails,
    fetchLastSanityReport,
  };
};
