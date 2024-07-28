import API from './api';

export const getNamespacesList = async ({
  clusterId,
  namespaceId = '',
  ...params
}) => {
  const { data } = await API.get(
    `/clusters/${clusterId}/namespaces/${namespaceId}`,
    {
      ...params,
    }
  );
  return data;
};
