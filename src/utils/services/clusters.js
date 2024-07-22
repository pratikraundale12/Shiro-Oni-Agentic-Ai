import API from './api';

export const getClustersList = async params => {
  const { data } = await API.get('/clusters', { params });
  return data;
};
