import API from './api';

export const getNamespacesList = async ({ id, ...params }) => {
  const { data } = await API.get(`/clusters/${id}/namespaces`, {
    ...params,
  });
  return data;
};
