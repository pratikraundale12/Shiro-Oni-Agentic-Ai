import API from './api';

export const getClustersAccess = async params => {
  const { data } = await API.get('/clusters_role_access', {
    params,
  });
  return data;
};

export const getRolesClusters = async params => {
  const { data } = await API.get('/roles_with_clusters', {
    params,
  });
  return data;
};

export const updatePermission = async payload => {
  const { data } = await API.patch('/clusters_role_access', payload);
  return data;
};

export const getPoliciesAccess = async params => {
  const { data } = await API.get('/policies_role_access', {
    params,
  });
  return data;
};

export const getRolesPolicies = async params => {
  const { data } = await API.get('/roles_with_policies', {
    params,
  });
  return data;
};

export const updatePolicies = async payload => {
  const { data } = await API.patch('/policies_role_access', payload);
  return data;
};

export const getPolicies = async params => {
  const { data } = await API.get('/policies', {
    params,
  });
  return data.data;
};

export const getRoles = async params => {
  const { data } = await API.get('/roles', {
    params,
  });
  return data;
};
