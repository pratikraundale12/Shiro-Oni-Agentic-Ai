export const observabilityAPI = api => {
  const fetchLabels = async () => {
    try {
      return await api.get(`/logs/labels`);
    } catch (error) {
      return error?.response?.data;
    }
  };

  //   /logs/labels/:label/values

  const fetchLogs = async ({ params = {} }) => {
    try {
      return await api.get(`/logs/query`, { ...params });
    } catch (error) {
      return error?.response?.data;
    }
  };

  const fetchMetricsList = async ({ params = {} }) => {
    try {
      return await api.get(`/prometheus/metrics`, { ...params });
    } catch (error) {
      return error?.response?.data;
    }
  };

  const fetchMetrics = async ({ params = {} }) => {
    try {
      return await api.get(`/prometheus/query`, { ...params });
    } catch (error) {
      return error?.response?.data;
    }
  };

  return {
    fetchLabels,
    fetchLogs,
    fetchMetricsList,
    fetchMetrics,
  };
};
