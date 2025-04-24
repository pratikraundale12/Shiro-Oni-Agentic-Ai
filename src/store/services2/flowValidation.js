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
  const updateRuleApi = (id, data) => api.put(`/rule/${id}`, data);
  const createRule = data => api.post(`/add-rule`, data);
  const deleteRuleScope = id => api.delete(`/rule-scope/${id}`);
  const deleteRule = id => api.delete(`/rule/${id}`);
  const emailReportApi = data => api.post(`/namespace/email-report`, data);
  const validateRandomFlowApi = data => api.post(`/validate-random-flow`, data);
  const getFlows = () => api.get('/inventry-flow');
  const setRulePriorityApi = (ruleScopeId, data) =>
    api.put(`/rule-priority/${ruleScopeId}`, data);

  return {
    ruleScopeApi,
    fetchRuleApi,
    addRuleScope,
    updateRuleScope,
    fetchPropertyApi,
    validateRulesApi,
    compareRulesApi,
    updateRuleApi,
    createRule,
    deleteRuleScope,
    deleteRule,
    emailReportApi,
    validateRandomFlowApi,
    getFlows,
    setRulePriorityApi,
  };
};
