export const policiesAPI = api => {
  const fetchPoliciesRoles = ({ params = {}, payload: { roleId } }) =>
    api.get(`/roles_with_policies/${roleId}`, params);
  // const fetchRolesPolicies = ({ params = {}, payload: { roleId } }) =>
  //   api.get(`/roles_with_policies/${roleId}`, params);
  const updateRolesPolicies = ({ params = {}, payload = {} }) =>
    api.patch('/roles_with_policies', payload, params);
  const fetchPolicies = ({ params = {} }) => api.get('/policies', params);

  return {
    fetchPoliciesRoles,
    // fetchRolesPolicies,
    updateRolesPolicies,
    fetchPolicies,
  };
};
