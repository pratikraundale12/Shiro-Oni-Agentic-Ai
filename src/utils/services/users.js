import API from './api';

export const getUsersList = async params => {
  const { data } = await API.get('/users', { params });
  return data;
};

export const createUserApi = async payload => {
  try {
    const response = await API.post('/users', payload);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};

export const deleteUserApi = async id => {
  try {
    const response = await API.delete(`/users/${id}`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
export const getSingleUserData = async id => {
  try {
    const response = await API.get(`/users/${id}`);
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
