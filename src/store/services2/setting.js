export const settingsAPI = api => {
  const fetchSettings = ({ params = {} }) => api.get('/settings', params);
  const createSettings = ({ payload = {} }) => api.patch('/settings', payload);
  const downloadLogsZip = ({ payload = {} }) =>
    api.post('/logs/download-zip', payload, {
      responseType: 'blob',
    });
  return {
    createSettings,
    fetchSettings,
    downloadLogsZip,
  };
};
