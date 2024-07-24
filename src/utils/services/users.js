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
