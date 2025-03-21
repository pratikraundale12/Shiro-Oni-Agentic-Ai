export const aiFlowGeneratorAPI = api => {
  const fetchDefaultRecentFlows = async () => {
    try {
      return await api.get(`/recent-flows`);
    } catch (error) {
      return error?.response?.data;
    }
  };
  const generateFlowAPI = async payload => {
    try {
      return await api.post('/generate-flow', payload);
    } catch (error) {
      return error.response.data;
    }
  };
  const deleteGeneratedFlow = async flowId => {
    try {
      return await api.delete(`/delete-flow/${flowId}`);
    } catch (error) {
      return error.response.data;
    }
  };
  const updateGeneratedFlow = async ({ id, data }) => {
    try {
      return await api.post(`/update-flow/${id}`, data);
    } catch (error) {
      return error.response.data;
    }
  };
  return {
    fetchDefaultRecentFlows,
    generateFlowAPI,
    deleteGeneratedFlow,
    updateGeneratedFlow,
  };
};
