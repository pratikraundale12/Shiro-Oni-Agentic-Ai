/*eslint-disable*/

import API from './api';

export const getClustersList = async params => {
  const { data } = await API.get('/clusters', { params });
  return data;
};

export const testCluster = async payload => {
  // console.log("PAYLOAD",payload);
  try {
    return await API.post('http://localhost:8000/api/test/clusters', payload);
  } catch (error) {
    return error.response.data;
  }
};

export const createRegistry = async payload => {
  // console.log("PAYLOAD",payload);
  try {
    return await API.post('http://localhost:8000/api/registries', payload);
  } catch (error) {
    return error.response.data;
  }
};

export const createCluster = async payload => {
  // console.log("PAYLOAD",payload);
  try {
    return await API.post('http://localhost:8000/api/clusters', payload);
  } catch (error) {
    return error.response.data;
  }
};

export const testRegistry = async payload => {
  try {
    return await API.post('http://localhost:8000/api/test/registries', payload);
  } catch (error) {
    return error.response.data;
  }
}

export const getRegistryList = async params => {
  const { data } = await API.get('http://localhost:8000/api/registries', { params });
  return data;
};


export const getOneRegistry = async params => {
  const { data } = await API.get(`http://localhost:8000/api/registries/${params}`);
  return data;
};

