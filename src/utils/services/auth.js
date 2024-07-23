import API from './api';

export const login = async payload => {
  const { data } = await API.post('/login', payload);
  return data;
};
