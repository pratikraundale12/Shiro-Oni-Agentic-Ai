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

  return {
    fetchLabels,
    fetchLogs,
  };
};
