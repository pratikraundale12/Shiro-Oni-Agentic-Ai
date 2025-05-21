export const settingsAPI = api => {
  const fetchSettings = ({ params = {} }) => api.get('/settings', params);
  const createSettings = ({ payload = {} }) => api.patch('/settings', payload);
  const downloadLogsZip = ({ payload = {} }) =>
    api.post('/logs/download-zip', payload, {
      responseType: 'blob',
    });
  const verifyEmail = () => api.post('/verify-email');
  return {
    createSettings,
    fetchSettings,
    downloadLogsZip,
    verifyEmail,
  };
};
