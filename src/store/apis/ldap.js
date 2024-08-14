import API from './api';

export const checkLdapConfig = async () => {
  try {
    return await API.get(`/check-ldap`);
  } catch (error) {
    return error?.response?.data;
  }
};
