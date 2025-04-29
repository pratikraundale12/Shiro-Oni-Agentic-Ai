export const aiFlowGeneratorAPI = api => {
  const fetchDefaultRecentFlows = async payload => {
    try {
      return await api.post(`/recent-flows`, payload);
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
  const fetchRegistryDetails = async () => {
    try {
      return await api.get(`/get-registry`);
    } catch (error) {
      return error.response.data;
    }
  };
  const addFlowToRegistry = async ({ clusterId, payload, registryId }) => {
    const { bucketId } = payload;
    const payloaDdata = {
      flowName: payload?.flowName,
      flowDesc: payload?.flowDesc,
      flowJson: payload?.flowJson,
      isDataInventory: payload?.isDataInventory,
      registryId: registryId,
    };
    try {
      return await api.post(
        `/clusters/${clusterId}/buckets/${bucketId}/add-flows`,
        payloaDdata
      );
    } catch (error) {
      return error.response.data;
    }
  };
  const addNewBucketToRegistry = async ({ clusterId, payload }) => {
    try {
      return await api.post(`/clusters/${clusterId}/add-buckets`, payload);
    } catch (error) {
      return error.response.data;
    }
  };
  const validateFlowJson = async payload => {
    try {
      return await api.post(`/namespace/validate-json`, payload);
    } catch (error) {
      return error?.response?.data;
    }
  };
  return {
    fetchDefaultRecentFlows,
    generateFlowAPI,
    deleteGeneratedFlow,
    updateGeneratedFlow,
    fetchRegistryDetails,
    addFlowToRegistry,
    addNewBucketToRegistry,
    validateFlowJson,
  };
};
