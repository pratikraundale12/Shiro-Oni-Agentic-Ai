/* eslint-disable no-undef */
import Keycloak from 'keycloak-js';

// Read saved config
const savedConfig = JSON.parse(localStorage.getItem('keycloakConfig') || '{}');

const keycloakConfig = {
  url: savedConfig.url || process.env.REACT_APP_KEYCLOAK_URL,
  realm: savedConfig.realm || process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: savedConfig.clientId || process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
};

// Initialize and export Keycloak
const keycloak = new Keycloak(keycloakConfig);
export default keycloak;

export const keycloakInitOptions = {
  onLoad: 'check-sso',
  checkLoginIframe: true,
  pkceMethod: 'S256',
  silentCheckSsoRedirectUri: window.location.origin + '/check-sso-login.html',
};
