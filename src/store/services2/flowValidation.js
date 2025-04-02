export const flowValidationAPI = api => {
  const ruleScopeApi = () => api.get(`/rule-scopes`);
  const fetchRuleApi = id => api.get(`/rules/${id}`);
  const addRuleSCope = data => api.post(`/add-rule-scope`, data);
  const fetchPropertyApi = type => api.get(`/rule-properties?type=${type}`);
  return {
    ruleScopeApi,
    fetchRuleApi,
    addRuleSCope,
    fetchPropertyApi,
  };
};
