export const rolesAPI = api => {
  const fetchClustersRolesAccess = ({ params = {} }) =>
    api.get('/clusters_role_access', params);
  const fetchRolesClusters = ({ params = {} }) =>
    api.get('/roles_with_clusters', params);
  const updateRolesClusters = ({ params = {}, payload = {} }) =>
    api.patch('/roles_with_clusters', payload, params);
  const fetchRoles = ({ params = {} }) => api.get('/roles', params);
  const fetchLdap = ({ payload = {}, params = {} }) =>
    api.post('/ldap-group', payload, params);
  const createNewRole = ({ payload = {} }) => api.post('/roles', payload);
  return {
    fetchClustersRolesAccess,
    fetchRolesClusters,
    updateRolesClusters,
    fetchRoles,
    createNewRole,
    fetchLdap,
  };
};
