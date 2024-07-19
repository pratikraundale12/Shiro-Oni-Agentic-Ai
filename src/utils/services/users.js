import API from './api';

export const getUsersList = async params => {
  const { data } = await API.get('/users', { params });
  return data;
};
