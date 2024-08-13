import { CLUSTERS_TOKEN } from '../../constants';

export const namespacesAPI = api => {
  const fetchNamespaces = (clusterId = '', namespaceId = '', params = {}) => {
    const clusterData = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
    const selectedCluster = clusterData.find(item => item.id === clusterId);
    console.log(selectedCluster);
    api.headers['x-cluster-id'] = selectedCluster?.id;
    api.headers['x-cluster-token'] = selectedCluster?.token;
    return api.get(
      `/clusters/${selectedCluster.id}/namespaces${namespaceId && `/${namespaceId}`}`,
      params
    );
  };

  return {
    fetchNamespaces,
  };
};
