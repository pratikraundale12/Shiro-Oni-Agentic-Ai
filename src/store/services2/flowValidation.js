export const flowValidationAPI = api => {
  const ruleScopeApi = () => api.get(`/rule-scopes`);
  const fetchRuleApi = id => api.get(`/rules/${id}`);
  const addRuleScope = data => api.post(`/add-rule-scope`, data);
  const updateRuleScope = (id, data) => api.put(`/rule-scope/${id}`, data);
  const fetchPropertyApi = type => api.get(`/rule-properties?type=${type}`);
  const validateRulesApi = (clusterId, namespaceId, data) =>
    api.post(`/clusters/${clusterId}/namespaces/${namespaceId}/validate`, data);
  const compareRulesApi = (clusterId, namespaceId, data) =>
    api.post(
      `/clusters/${clusterId}/namespaces/${namespaceId}/compare-flow-versions`,
      data
    );
  return {
    ruleScopeApi,
    fetchRuleApi,
    addRuleScope,
    updateRuleScope,
    fetchPropertyApi,
    validateRulesApi,
    compareRulesApi,
  };
};
