export const activityHistoryAPI = api => {
  const fetchActivityHistory = ({ params = {} }) => {
    return api.get('/audit', { ...params });
  };

  const fetchEmailReport = ({ queryParams = {} }) => {
    const queryString = new URLSearchParams(queryParams).toString();
    const url = queryString
      ? `/audit/email-report?${queryString}`
      : '/audit/email-report';

    return api.post(url);
  };

  const fetchDownloadReport = () => {
    return api.get('/audit/downloads');
  };

  return {
    fetchActivityHistory,
    fetchEmailReport,
    fetchDownloadReport,
  };
};
