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

  const deleteRole = ({ roleId }) => api.delete(`/roles/${roleId}`);

  const editRole = ({ payload = {}, roleId }) =>
    api.patch(`roles/${roleId}`, payload);

  const fetchClusterUsers = ({ clusterId, params = {} }) =>
    api.get(`/clusters/${clusterId}/users`, params);

  const fetchClusterUserGroups = ({ clusterId, params = {} }) =>
    api.get(`/clusters/${clusterId}/user_groups`, params);

  const fetchClusterNiFiPolicies = ({ clusterId, params = {} }) =>
    api.get(`/clusters/${clusterId}/nifi_policies`, params);

  const fetchFlowPolicyDetails = ({ clusterId, namespaceId, params = {} }) =>
    api.get(`/clusters/${clusterId}/nifi-flow-policies/${namespaceId}`, params);

  const fetchPoliciesandActions = ({ id, payload = {} }) =>
    api.post(`clusters/${id}/nifi-access-policies`, payload);

  const updateClusterPermissionsAndActions = ({
    id,
    payload = {},
    forCluster,
    pgName,
    selectedPolicyName,
    changeFlags,
  }) => {
    let url = `clusters/${id}/update-policies`;

    const queryParams = new URLSearchParams();

    if (forCluster !== undefined) queryParams.append('forCluster', forCluster);
    if (pgName) queryParams.append('pgName', pgName);

    if (Array.from(queryParams).length > 0) {
      url += `?${queryParams.toString()}`;
    }

    const requestBody = {
      ...payload,
      selectedPolicyName,
      changeFlags,
    };

    return api.put(url, requestBody);
  };

  return {
    fetchClustersRolesAccess,
    fetchRoleClusters,
    updateRoleClusters,
    fetchRoles,
    createNewRole,
    fetchLdap,
    deleteRole,
    editRole,
    fetchClusterUsers,
    fetchClusterUserGroups,
    fetchClusterNiFiPolicies,
    fetchFlowPolicyDetails,
    fetchPoliciesandActions,
    updateClusterPermissionsAndActions,
  };
};
