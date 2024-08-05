import API from './api';

export const login = async payload => {
  try {
    return await API.post('/login', payload);
  } catch (error) {
    return error.response.data;
  }
};

export const resetPasswordToken = async email => {
  try {
    return await API.post('/reset-password-request', email);
  } catch (error) {
    return error.response.data;
  }
};

export const resetPassword = async payload => {
  try {
    return await API.post('/reset-password', payload);
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

export const currentUser = async () => {
  try {
    return await API.get('/current-user');
  } catch (error) {
    return error.response.data;
  }
};
