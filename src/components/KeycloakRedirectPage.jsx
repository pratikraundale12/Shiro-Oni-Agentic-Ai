import { useKeycloak } from '@react-keycloak/web';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthenticationActions, LoadingSelectors } from '../store';
import { FullPageLoader } from './FullPageLoader';

const KeycloakRedirectPage = () => {
  const { keycloak, initialized } = useKeycloak();
  const dispatch = useDispatch();
  useEffect(() => {
    if (initialized && keycloak.token) {
      dispatch(
        AuthenticationActions.ssoUserLogin({
          loginToken: keycloak.token,
        })
      );
    }
  }, [dispatch, keycloak, initialized]);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'ssoUserLogin')
  );

  return (
    <div>
      {' '}
      <FullPageLoader loading={loading} />
    </div>
  );
};

export default KeycloakRedirectPage;
