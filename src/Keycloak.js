/* eslint-disable no-undef */
import Keycloak from 'keycloak-js';

const savedConfig = JSON.parse(localStorage.getItem('keycloakConfig') || '{}');

const keycloakConfig = {
  url: savedConfig.keycloak_url || 'https://keycloak.dfmanager.com:8443/',
  realm: savedConfig.keycloak_realm || 'DFM-DEV',
  clientId: savedConfig.keycloak_client_id || 'dfm-demo',
};

// Initialize and export Keycloak
const keycloak = new Keycloak(keycloakConfig);
export default keycloak;

export const keycloakInitOptions = {
  onLoad: 'check-sso',
  checkLoginIframe: true,
  pkceMethod: 'S256',
  // silentCheckSsoRedirectUri: window.location.origin + '/check-sso-login.html',
};
