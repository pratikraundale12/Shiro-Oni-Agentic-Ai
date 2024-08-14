import API from './api';

export const checkLdapConfig = async () => {
  try {
    return await API.get(`/check-ldap`);
  } catch (error) {
    return error?.response?.data;
  }
};

export const testConfigApi = async payload => {
  try {
    return await API.post(`/test-ldap`, payload);
  } catch (error) {
    return error?.response?.data;
  }
};
