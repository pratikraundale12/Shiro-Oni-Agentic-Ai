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
  const getAllRegistiesList = () => api.get('/list-registries');
  const createRegistryKubeConfig = ({ payload }) => {
    return api.post(`/registry/registry-kube-config`, payload);
  };
  const fetchRegistryKubeConfigList = () =>
    api.get('/registry/registry-kube-config');
  const deleteRegistryKubeConfig = ({ kubeId }) =>
    api.delete(`/registry/registry-kube-config/${kubeId}`);

  const createConfigRegistry = ({ payload }) => {
    return api.post(`/registry/registry-configs`, payload);
  };
  const fetchRegistryConfigurationList = () =>
    api.get('/registry/registry-configs');

  const fetchRegistryConfigurationDefaultData = ({ type }) =>
    api.get(`/registry/registry-configs/template?type=${type}`);
  const deleteRegistryConfiguration = ({ configId }) =>
    api.delete(`/registry/registry-configs/${configId}`);

  return {
    fetchRegistry,
    testRegistry,
    createRegistryAfterTest,
    deleteRegistry,
    editRegistry,
    getAllRegistiesList,
    createRegistryKubeConfig,
    fetchRegistryKubeConfigList,
    deleteRegistryKubeConfig,
    createConfigRegistry,
    fetchRegistryConfigurationList,
    fetchRegistryConfigurationDefaultData,
    deleteRegistryConfiguration,
  };
};
