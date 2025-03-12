export const aiFlowGeneratorAPI = api => {
  const fetchDefaultRecentFlows = async () => {
    try {
      return await api.get(`/default-recent-flows`);
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
  return {
    fetchDefaultRecentFlows,
    generateFlowAPI,
  };
};
