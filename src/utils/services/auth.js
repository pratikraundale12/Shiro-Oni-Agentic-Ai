import API from './api';

export const login = async payload => {
  const { data } = await API.post('/login', payload);
  return data;
};

export const resetPasswordToken = async email => {
  const { data } = await API.post('/reset-password-request', email);
  return data;
};

export const resetPassword = async (password, resetToken) => {
  const requestBody = {
    password: password,
    resetToken: resetToken,
  };
  const { data } = await API.post('/reset-password', requestBody);
  return data;
};

export const currentUser = async () => {
  const { data } = await API.get('/current-user');
  return data;
};
