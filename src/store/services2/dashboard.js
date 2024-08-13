import { CLUSTERS_TOKEN } from '../../constants';

export const dashboardAPI = api => {
  const fetchDashboard = (clusterId = '', namespaceId = '') => {
    const clusterData = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
    const selectedCluster = clusterData.find(item => item.id === clusterId);
    api.headers['x-cluster-id'] = selectedCluster?.id;
    api.headers['x-cluster-token'] = selectedCluster?.token;
    return api.get(`/dashboard-insight/${clusterId}/namespaces/${namespaceId}`);
  };

  return {
    fetchDashboard,
  };
};
