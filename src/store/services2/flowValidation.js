export const flowValidationAPI = api => {
  const ruleScopeApi = () => api.get(`/rule-scopes`);
  const fetchRuleApi = () => api.get(`/rules`);
  const addRuleSCope = data => api.post(`/add-rule-scope`, data);
  return {
    ruleScopeApi,
    fetchRuleApi,
    addRuleSCope,
  };
};
