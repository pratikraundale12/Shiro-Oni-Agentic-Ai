import Keycloak from 'keycloak-js';
const getKeycloak = localStorage.getItem('keycloakStroage');
const userObject = getKeycloak ? JSON.parse(getKeycloak) : {};
const keycloak = new Keycloak({
  url: userObject?.keycloak_url,
  realm: userObject?.keycloak_realm,
  clientId: userObject?.keycloak_client_id,
});

export default keycloak;

export const keycloakInitOptions = {
  onLoad: 'check-sso',
  checkLoginIframe: true,
  pkceMethod: 'S256',
  silentCheckSsoRedirectUri: window.location.origin + '/check-sso-login.html',
};
