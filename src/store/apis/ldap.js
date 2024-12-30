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

export const ldapConfig = async payload => {
  try {
    return await API.post(`/ldap-config`, payload);
  } catch (error) {
    return error?.response?.data;
  }
};

export const getLdapGroupAPI = async payload => {
  try {
    return await API.post(`/ldap-group`, payload);
  } catch (error) {
    return error?.response?.data;
  }
};

export const getRolesAPI = async () => {
  try {
    return await API.get(`/roles`);
  } catch (error) {
    return error?.response?.data;
  }
};

export const groupMappingApi = async payload => {
  try {
    return await API.patch(`/group-mapping`, payload);
  } catch (error) {
    return error?.response?.data;
  }
};

export const SyncUsers = async () => {
  try {
    return await API.get(`/sync-users`);
  } catch (error) {
    return error?.response?.data;
  }
};

export const getExistingMapping = async () => {
  try {
    return await API.get(`/current-ldap-mapping`);
  } catch (error) {
    return error?.response?.data;
  }
};
