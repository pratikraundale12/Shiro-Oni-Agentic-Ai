export const authenticationAPI = api => {
  const loginAdmin = payload => api.post('/login/admin', payload);
  const loginUser = payload => api.post('/login/user', payload);
  const resetPasswordRequest = payload =>
    api.post('/reset-password-request', payload);
  const resetPassword = payload =>
    api.post(`/reset-password?token=${payload.resetToken}`, {
      password: payload.password, // This sends the password in the request body
    });

  const fetchLicenseInfo = () => api.get('/license-info');
  const fetchCurrentUser = () => api.get('/current-user');
  const fetchSettingLogo = () => api.get('/settings/login');
  const fetchKeycloakConfig = () => api.get('/settings/keycloak-config');
  const ssoUserLogin = payload => api.post('/login/sso-user', payload);
  const updateTermsAndPolicies = ({ userId, payload }) =>
    api.patch(`/users/${userId}`, payload);

  return {
    loginAdmin,
    loginUser,
    resetPasswordRequest,
    resetPassword,
    fetchLicenseInfo,
    fetchCurrentUser,
    updateTermsAndPolicies,
    fetchSettingLogo,
    fetchKeycloakConfig,
    ssoUserLogin,
  };
};
