// import Keycloak from 'keycloak-js';
// import { AuthenticationActions } from './store';
// import { useDispatch } from 'react-redux';

// let keycloak;

// export async function initializeKeycloak() {
//   const dispatch = useDispatch();
//   try {
//     const storedConfig = JSON.parse(localStorage.getItem('keycloakConfig'));
//     if (storedConfig && storedConfig?.keycloak_url) {
//       keycloak = await new Keycloak({
//         url: storedConfig?.keycloak_url,
//         realm: storedConfig?.keycloak_realm,
//         clientId: storedConfig?.keycloak_client_id,
//       });
//       console.log('window.location.origin----', window.location.origin);
//       const authenticated = await keycloak.init({
//         onLoad: 'login-required',
//         checkLoginIframe: true,
//         pkceMethod: 'S256',
//         silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
//         redirectUri: `${window.location.origin}/keycloakLogin`,
//       });
//       if (authenticated) {
//         console.log('User is authenticated:', keycloak.token);
//         localStorage.setItem('keyCloakToken', keycloak.token);
//         localStorage.setItem('keyCloakInitialized', true);
//         dispatch(
//           AuthenticationActions.ssoUserLogin({
//             loginToken: keycloak.token,
//           })
//         );
//         // Handle authentication (e.g., store token, update UI)
//       } else {
//         console.log('User is not authenticated');
//         localStorage.setItem('keyCloakInitialized', false);
//         // Handle not authenticated case
//       }
//     }
//   } catch (error) {
//     console.error('Keycloak initialization failed', error);
//   }
// }

<<<<<<< Updated upstream
// Initialize and export Keycloak
const keycloak = new Keycloak(keycloakConfig);
export default keycloak;

export const keycloakInitOptions = {
  onLoad: 'check-sso',
  checkLoginIframe: true,
  pkceMethod: 'S256',
  // silentCheckSsoRedirectUri: window.location.origin + '/check-sso-login.html',
};
=======
// export { keycloak };
>>>>>>> Stashed changes
