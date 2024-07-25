import API from './api';

export const getLicenseExpiresData = async () => {
  const response = await API.get('/current-user');
  return response;
};
