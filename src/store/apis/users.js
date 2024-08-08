import API from './api';

export const getUsersList = async params => {
  const { data } = await API.get('/users', { params });
  return data;
};

export const createUserApi = async payload => {
  try {
    return await API.post('/users', payload);
  } catch (error) {
    return error?.response?.data;
  }
};

export const deleteUserApi = async id => {
  try {
    return await API.delete(`/users/${id}`);
  } catch (error) {
    return error?.response?.data;
  }
};

export const getSingleUserData = async id => {
  try {
    return await API.get(`/users/${id}`);
  } catch (error) {
    return error?.response?.data;
  }
};
export const editUserDataApi = async (id, payload) => {
  try {
    return await API.patch(`/users/${id}`, payload);
  } catch (error) {
    return error?.response?.data;
  }
};
