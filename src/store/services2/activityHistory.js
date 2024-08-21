export const activityHistoryAPI = api => {
  const fetchActivityHistory = ({ params = {}, payload = {} }) => {
    return api.post('/audit', payload, { params });
  };

  return {
    fetchActivityHistory,
  };
};
