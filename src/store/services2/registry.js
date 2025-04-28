export const registryAPI = api => {
  const fetchRegistry = ({ params = {} }) => api.get('/registries', params);
  const testRegistry = ({ payload }) => {
    return api.post(`/test/registries`, payload);
  };
  const createRegistryAfterTest = ({ payload }) => {
    return api.post(`/registries`, payload);
  };
  const deleteRegistry = ({ registryId }) =>
    api.delete(`/registries/${registryId}`);

  const editRegistry = ({ registryId, payload }) => {
    return api.patch(`/registries/${registryId}`, payload);
  };

  return {
    fetchRegistry,
    testRegistry,
    createRegistryAfterTest,
    deleteRegistry,
    editRegistry,
  };
};
