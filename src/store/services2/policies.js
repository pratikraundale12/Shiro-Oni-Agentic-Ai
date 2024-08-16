export const policiesAPI = api => {
  const fetchPoliciesRolesAccess = ({ params = {} }) =>
    api.get('/policies_role_access', params);
  const fetchRolesPolicies = ({ params = {} }) =>
    api.get('/roles_with_policies', params);
  const updateRolesPolicies = ({ params = {}, payload = {} }) =>
    api.patch('/roles_with_policies', payload, params);
  const fetchPolicies = ({ params = {} }) => api.get('/policies', params);

  return {
    fetchPoliciesRolesAccess,
    fetchRolesPolicies,
    updateRolesPolicies,
    fetchPolicies,
  };
};
