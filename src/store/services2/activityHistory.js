export const activityHistoryAPI = api => {
  const fetchActivityHistory = ({ params = {}, payload = {} }) => {
    // const body = JSON.parse(payload) || [];
    return api.post('/audit', payload, { params });
  };

  return {
    fetchActivityHistory,
  };
};
