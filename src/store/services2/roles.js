export const rolesAPI = api => {
  const fetchClustersRolesAccess = ({ params = {} }) =>
    api.get('/clusters_role_access', params);
  const fetchRoleClusters = ({ params = {}, payload: { roleId } }) =>
    api.get(`/roles_with_clusters/${roleId}`, params);
  const updateRoleClusters = ({ params = {}, payload = {} }) =>
    api.patch('/roles_with_clusters', payload, params);
  const fetchRoles = ({ params = {} }) => api.get('/roles', params);
  const fetchLdap = ({ payload = {}, params = {} }) =>
    api.post('/ldap-group', payload, params);
  const createNewRole = ({ payload = {} }) => api.post('/roles', payload);

  return {
    fetchClustersRolesAccess,
    fetchRoleClusters,
    updateRoleClusters,
    fetchRoles,
    createNewRole,
    fetchLdap,
  };
};
