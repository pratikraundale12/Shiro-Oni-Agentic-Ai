import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '../../constants';
import { AuthenticationActions, LoadingSelectors } from '../../store';
import { FullPageLoader } from '../FullPageLoader';

const KeycloakRedirectPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search); // looking for URL parameters received
    const returnedState = urlParams.get('state');
    const storedState = localStorage.getItem('keycloak_state_val');

    if (returnedState === storedState) {
      const code = urlParams.get('code');
      // Log the code to verify if we have successfully parsed them
      // Now using code to exchange for an access token
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async code => {
    const storedConfig = JSON.parse(localStorage.getItem('keycloakConfig'));
    const keyCLoakRedirectURL = `${API_URL}/keycloakLogin`; // baseURL to be changed with API_URL when pushed to server
    const keyCloakRealm = storedConfig?.keycloak_realm; // to be read from settings data
    const keyCloakURL = storedConfig?.keycloak_url; // to be read from settings data
    const clientID = storedConfig?.keycloak_client_id; // to be read from settings data

    const tokenEndpoint = `${keyCloakURL}/realms/${keyCloakRealm}/protocol/openid-connect/token`;

    // Retrieve the stored code_verifier from localStorage
    const codeVerifier = localStorage.getItem('keycloak_code_verifier');

    if (!codeVerifier) {
      console.error('Code verifier not found');
      return;
    }

    const data = new URLSearchParams();
    data.append('grant_type', 'authorization_code');
    data.append('code', code);
    data.append('redirect_uri', keyCLoakRedirectURL);
    data.append('client_id', clientID); // Ensure this matches your client ID in Keycloak
    data.append('code_verifier', codeVerifier); // Send the code_verifier here

    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const responseData = await response.json();

      if (responseData.error) {
        console.error(
          'Error exchanging code for token:',
          responseData.error_description
        );
        return;
      }

      // Store the tokens (access token, refresh token, etc.)
      const { access_token, id_token, refresh_token } = responseData;
      localStorage.setItem('keycloak_access_token', access_token);
      localStorage.setItem('keycloak_id_token', id_token);
      localStorage.setItem('keycloak_refresh_token', refresh_token);
      dispatch(
        AuthenticationActions.ssoUserLogin({
          loginToken: access_token, // Send the token to the store
        })
      );
      // Redirect after successful login
    } catch (error) {
      console.error('Failed to exchange code for token:', error);
    }
  };

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'ssoUserLogin')
  );

  return <FullPageLoader loading={loading} />;
};

export default KeycloakRedirectPage;
