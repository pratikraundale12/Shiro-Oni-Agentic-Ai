import API from './api';

export const getNamespacesList = async ({
  id = '292582f8-2894-451d-9e39-13a17aff74d2',
  ...params
}) => {
  const { data } = await API.get(`/clusters/${id}/namespaces`, {
    ...params,
  });
  return data;
};
