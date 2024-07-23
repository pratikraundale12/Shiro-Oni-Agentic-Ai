import API from './api';

export const getUsersList = async params => {
  const { data } = await API.get('/users', { params });
  return data;
};

export const createUserApi = async data => {
  const { datas } = await API.post('/users', data);
  return datas;
};
