export const authenticationAPI = api => {
  const loginAdmin = payload => api.post('/login/admin', payload);
  const loginUser = payload => api.post('/login/user', payload);
  const resetPasswordRequest = payload =>
    api.post('/reset-password-request', payload);
  const resetPassword = payload => api.post('/reset-password', payload);
  const fetchLicenseInfo = () => api.get('/license-info');
  const fetchCurrentUser = () => api.get('/current-user');

  return {
    loginAdmin,
    loginUser,
    resetPasswordRequest,
    resetPassword,
    fetchLicenseInfo,
    fetchCurrentUser,
  };
};
