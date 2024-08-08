/*eslint-disable*/

import { API_URL } from '../../utils';
import API from './api';

export const getClustersList = async params => {
  const { data } = await API.get('/clusters', { params });
  return data;
};

export const testCluster = async payload => {
  try {
    return await API.post(`${API_URL}/api/test/clusters`, payload);
  } catch (error) {
    return error?.response?.data;
  }
};

export const createRegistry = async payload => {
  try {
    return await API.post(`${API_URL}/api/registries`, payload);
  } catch (error) {
    return error?.response?.data;
  }
};

export const createCluster = async payload => {
  try {
    return await API.post(`${API_URL}/api/clusters`, payload);
  } catch (error) {
    return error?.response?.data;
  }
};

export const testRegistry = async payload => {
  try {
    return await API.post(`${API_URL}/api/test/registries`, payload);
  } catch (error) {
    return error?.response?.data;
  }
};

export const getRegistryList = async params => {
  const { data } = await API.get(`${API_URL}/api/registries`, {
    params,
  });
  return data;
};

export const getOneRegistry = async params => {
  const { data } = await API.get(
    `${API_URL}/api/registries/${params}`
  );
  return data;
};

export const updateCluster = async (id, payload) => {
  const { data } = await API.patch(
    `${API_URL}/api/clusters/${id}`,
    payload
  );
  return data;
};

export const updateRegistry = async (id, payload) => {
  const { data } = await API.patch(
    `${API_URL}/registries/${id}`,
    payload
  );
  return data;
};

export const deleteCluster = async id => {
  try {
    return await API.delete(`${API_URL}/api/clusters/${id}`);
  } catch (error) {
    return error?.response?.data;
  }
};

export const getNodeList = async ({ nodeClusterId }) => {
  const { data } = await API.get(
    `${API_URL}/api/clusters/${nodeClusterId}/nodes`
  );
  return data;
};
