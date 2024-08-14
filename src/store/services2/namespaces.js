import { CLUSTERS_TOKEN } from '../../constants';

export const namespacesAPI = api => {
  const fetchNamespaces = ({
    params = {},
    queryParams: { clusterId, namespaceId },
  }) => {
    const clusterData = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
    const selectedCluster = clusterData.find(item => item.id === clusterId);
    api.headers['x-cluster-id'] = selectedCluster?.id;
    api.headers['x-cluster-token'] = selectedCluster?.token;
    return api.get(
      `/clusters/${selectedCluster.id}/namespaces${namespaceId && `/${namespaceId}`}`,
      params
    );
  };

  const checkDestCluster = ({
    clusterId,
    srcClusterId,
    srcClusterToken,
    path,
  }) =>
    api.post(`/clusters/${clusterId}/check`, {
      srcClusterId,
      srcClusterToken,
      path,
    });

  const deployCluster = ({ clusterId, ...rest }) =>
    api.post(`/clusters/${clusterId}/deploy`, rest);

  return {
    fetchNamespaces,
    checkDestCluster,
    deployCluster,
  };
};
