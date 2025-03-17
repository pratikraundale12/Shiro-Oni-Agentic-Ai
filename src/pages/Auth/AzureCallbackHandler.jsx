import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ACCESS_TOKEN, API_URL, CLUSTERS_TOKEN } from '../../constants';
import { history } from '../../helpers/history';
import { AuthenticationActions } from '../../store/authentication';
import { SettingsActions } from '../../store/settings';

const AZURE_CALLBACK_ENDPOINT = `${API_URL}/api/auth/azure/callback`;

const AzureCallbackHandler = () => {
  const isMounted = useRef(false);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const sessionState = params.get('session_state');
    if (!code) {
      toast.error('Authorization code is missing.');
      history.push('/back-to-login');
    }

    const handleAzureCallback = async () => {
      if (sessionState) {
        try {
          const response = await fetch(AZURE_CALLBACK_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });
          const data = await response.json();
          if (response.ok) {
            const { token } = data;
            if (token) {
              window.localStorage.setItem(ACCESS_TOKEN, token);
              dispatch(AuthenticationActions.fetchCurrentUser({ token }));
              dispatch(SettingsActions.fetchSettings());
              localStorage.setItem(CLUSTERS_TOKEN, []);
            } else {
              throw new Error('No token received');
            }
          } else {
            toast.error(data?.message, {
              toastId: 'login-toast-error1',
            });
            history.push('/back-to-login');
          }
        } catch (error) {
          console.error('Azure Callback Error:', error);
          toast.error(error.message || 'Authentication failed.');
          history.push('/back-to-login');
        }
      }
    };

    handleAzureCallback();
  }, [dispatch, location.search]);

  return null;
};

export default AzureCallbackHandler;
