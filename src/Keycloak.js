/* eslint-disable no-undef */
import Keycloak from 'keycloak-js';

// Read saved config
const savedConfig = JSON.parse(localStorage.getItem('keycloakConfig') || '{}');

const keycloakConfig = {
  url: savedConfig.url || 'http://localhost:8180/',
  realm: savedConfig.realm || 'DFM-DEMO',
  clientId: savedConfig.clientId || 'dfm-demo',
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
