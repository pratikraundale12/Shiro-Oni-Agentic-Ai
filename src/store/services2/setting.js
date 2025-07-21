export const settingsAPI = api => {
  const fetchSettings = ({ params = {} }) => api.get('/settings', params);
  const createSettings = ({ payload = {} }) => api.patch('/settings', payload);
  const downloadLogsZip = ({ payload = {} }) =>
    api.post('/logs/download-zip', payload, {
      responseType: 'blob',
    });
  const verifyEmail = ({ to_email, changedSmtpData }) =>
    api.post('/verify-email', {
      to_email: to_email,
      changedSmtpData: changedSmtpData,
    });
  const fetchKeycloakUsers = ({ payload }) => {
    return api.post(`/keycloack-users`, payload);
  };
  const assignKeycloakRolesToUsers = ({ payload }) => {
    return api.post(`/assign-roles`, payload);
  };
  return {
    createSettings,
    fetchSettings,
    downloadLogsZip,
    verifyEmail,
    fetchKeycloakUsers,
    assignKeycloakRolesToUsers,
  };
};
