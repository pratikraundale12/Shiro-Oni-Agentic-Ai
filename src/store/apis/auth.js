import API from './api';

export const login = async payload => {
  try {
    return await API.post('/login/admin', payload);
  } catch (error) {
    return error?.response?.data;
  }
};

export const resetPasswordToken = async email => {
  try {
    return await API.post('/reset-password-request', email);
  } catch (error) {
    return error?.response?.data;
  }
};

export const resetPassword = async payload => {
  try {
    return await API.post('/reset-password', payload);
  } catch (error) {
    console.log(error);
    return error?.response?.data;
  }
};

export const currentUser = async () => {
  try {
    return await API.get('/current-user');
  } catch (error) {
    return error?.response?.data;
  }
};

export const checkLicense = async () => {
  try {
    const response = await API.get('/license-info');
    return [response, null];
  } catch (error) {
    return [null, error];
  }
};
export const getLicenseExpiresData = async () => {
  try {
    const response = await API.get('/current-user');
    return response;
  } catch (error) {
    return error?.response?.data;
  }
};
