export const flowValidationAPI = api => {
  const ruleScopeApi = () => api.get(`/rule-scopes`);
  const fetchRuleApi = () => api.get(`/rules`);
  return {
    ruleScopeApi,
    fetchRuleApi,
  };
};
