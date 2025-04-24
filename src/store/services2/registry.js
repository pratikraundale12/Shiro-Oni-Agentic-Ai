export const registryAPI = api => {
  const fetchRegistry = ({ params = {} }) => api.get('/registries', params);
  const testRegistry = ({ payload }) => {
    return api.post(`/test/registries`, payload);
  };
  const createRegistryAfterTest = ({ payload }) => {
    return api.post(`/registries`, payload);
  };
  return {
    fetchRegistry,
    testRegistry,
    createRegistryAfterTest,
  };
};
