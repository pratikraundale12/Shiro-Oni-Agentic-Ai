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

  const fetchDownloadReport = (status = [], event = [], entity = []) => {
    const extractValue = item =>
      typeof item === 'object' && item?.value ? item.value : item;

    const queryParams = new URLSearchParams();

    const statusValues = status.map(extractValue).filter(Boolean);
    const eventValues = event.map(extractValue).filter(Boolean);
    const entityValues = entity.map(extractValue).filter(Boolean);

    if (statusValues.length) {
      queryParams.append('status', statusValues.join(','));
    }
    if (eventValues.length) {
      queryParams.append('event', eventValues.join(','));
    }
    if (entityValues.length) {
      queryParams.append('entity', entityValues.join(','));
    }

    return api.get(`/audit/downloads?${queryParams.toString()}`);
  };

  return {
    fetchActivityHistory,
    fetchEmailReport,
    fetchDownloadReport,
  };
};
