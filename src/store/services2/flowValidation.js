export const flowValidationAPI = api => {
  const ruleScopeApi = () => api.get(`/rule-scopes`);
  const fetchRuleApi = id => api.get(`/rules/${id}`);
  const addRuleSCope = data => api.post(`/add-rule-scope`, data);
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
    addRuleSCope,
    fetchPropertyApi,
    validateRulesApi,
    compareRulesApi,
  };
};
