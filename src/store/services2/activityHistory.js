export const activityHistoryAPI = api => {
  const fetchActivityHistory = ({ params = {} }) => {
    return api.get('/audit', { ...params });
  };

  return {
    fetchActivityHistory,
  };
};
