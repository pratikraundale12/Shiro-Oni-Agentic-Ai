// import Keycloak from 'keycloak-js';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { keycloak } from '../Keycloak';
import { AuthenticationActions, LoadingSelectors } from '../store';
import { FullPageLoader } from './FullPageLoader';

const KeycloakRedirectPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const keyCLoakToken = localStorage.getItem('keyCloakToken');
    if (keyCLoakToken && keyCLoakToken !== '') {
      console.log('User is authenticated:', keycloak.token);
      dispatch(
        AuthenticationActions.ssoUserLogin({
          loginToken: keyCLoakToken,
        })
      );
      // Handle authentication (e.g., store token, update UI)
    } else {
      console.log('User is not authenticated');
      // Handle not authenticated case
    }
  }, [dispatch]);

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'ssoUserLogin')
  );

  return <FullPageLoader loading={loading} />;
};

export default KeycloakRedirectPage;
