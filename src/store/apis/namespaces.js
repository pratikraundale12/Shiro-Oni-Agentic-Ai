import { CLUSTERS_TOKEN } from '../../constants';
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
    `/clusters/${clusterId}/namespace/${namespaceId}`
  );
  return data;
};
export const updateNamespaceStatus = async (clusterId, namespaceId, state) => {
  const clusterData = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
  const selectedCluster = clusterData.find(item => item.id === clusterId);
  API.headers['x-cluster-id'] = selectedCluster?.id;
  API.headers['x-cluster-token'] = selectedCluster?.token;
  const data = await API.put(
    `/status-update/${clusterId}/namespace/${namespaceId}`,
    {
      state: state,
    }
  );
  return data;
};

export const deployCluster = async ({
  clusterId,
  namespaceId,
  flowId,
  bucketId,
  bucketName,
  registryId,
  version,
  position,
}) => {
  const data = {
    namespaceId,
    flowId,
    bucketId,
    bucketName,
    registryId,
    version,
    position,
  };

  const response = await API.post(`/clusters/${clusterId}/deploy`, data);
  return response;
};

export const fetchParameterContext = async (clusterId, parameterId) => {
  const response = await API.get(
    `parameter-context/${clusterId}?contextId=${parameterId}`
  );
  return response;
};

export const updateParameterContextService = async (
  clusterId,
  parameterContextId,
  revision,
  data
) => {
  const updateData = {
    revision: revision,
    parameters:
      data &&
      data?.map(item => ({
        parameter: {
          ...item,
        },
      })),
  };

  const response = await API.post(
    `parameter-context/${clusterId}/contextId/${parameterContextId}`,
    updateData
  );
  return response;
};

export const fetchVariables = async (clusterId, namespaceId) => {
  try {
    const response = await API.get(
      `clusters/${clusterId}/namespaces/${namespaceId}/variables`
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch variables:', error);
  }
};

export const addVariableServices = async (
  clusterId,
  namespaceId,
  version,
  variables
) => {
  try {
    const response = await API.post(
      `clusters/${clusterId}/namespaces/${namespaceId}/variables`,
      {
        version,
        variables: variables.map(variable => ({
          variable: {
            name: variable.name,
            value: variable.value,
          },
        })),
      }
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch variables:', error);
    throw error;
  }
};
export const GetVariableServices = async (clusterId, namespaceId, clientId) => {
  try {
    const response = await API.get(
      `clusters/${clusterId}/namespaces/${namespaceId}/variable-requests/${clientId}`
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch variables:', error);
    throw error;
  }
};
export const DeleteVariableServices = async (
  clusterId,
  namespaceId,
  clientId
) => {
  try {
    const response = await API.delete(
      `clusters/${clusterId}/namespaces/${namespaceId}/variable-requests/${clientId}`
    );
    return response;
  } catch (error) {
    console.error('Failed to fetch variables:', error);
    throw error;
  }
};
export const deleteParameterContextService = async (
  clusterId,
  parameterContextId,
  requestId,
  method = 'delete'
) => {
  let response;
  if (method === 'get') {
    response = await API.get(
      `parameter-context/${clusterId}/contextId/${parameterContextId}/requestId/${requestId}`
    );
  } else {
    response = await API.delete(
      `parameter-context/${clusterId}/contextId/${parameterContextId}/requestId/${requestId}`
    );
  }
  return response;
};
