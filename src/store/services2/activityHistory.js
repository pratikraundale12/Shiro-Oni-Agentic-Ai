export const activityHistoryAPI = api => {
  const fetchActivityHistory = ({ params = {} }) => {
    return api.get('/audit', { ...params });
  };

  const fetchEmailReport = ({ queryParams = {} }) => {
    return api.post('/audit/email-report', { params: queryParams });
  };

  return {
    fetchActivityHistory,
    fetchEmailReport,
  };
};
