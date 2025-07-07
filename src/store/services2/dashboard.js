export const dashboardAPI = api => {
  const fetchDashboard = ({ queryParams: { clusterId, namespaceId } }) =>
    api.get(
      `/dashboard-insight/${clusterId}/namespaces${namespaceId && `/${namespaceId}`}`
    );

  const fetchDeploymentMetrics = ({ clusterId, start_date, end_date }) => {
    let url = `/clusters/${clusterId}/deployment-metrics`;

    const params = new URLSearchParams();
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);

    if ([...params].length) {
      url += `?${params.toString()}`; // Use backticks and a proper template string
    }

    return api.get(url);
  };

  return {
    fetchDashboard,
    fetchDeploymentMetrics,
  };
};
