export const dashboardAPI = api => {
  const fetchDashboard = ({ queryParams: { clusterId, namespaceId } }) =>
    api.get(`/dashboard-insight/${clusterId}/namespaces/${namespaceId}`);

  return {
    fetchDashboard,
  };
};
