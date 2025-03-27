import { toast } from 'react-toastify';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
// import keycloak from '../../Keycloak';
import Keycloak from 'keycloak-js';
import {
  ACCESS_TOKEN,
  CLUSTERS_TOKEN,
  DEFAULT_ROUTE,
  PREVIOUS_PATH,
} from '../../constants';
import { history } from '../../helpers/history';
import { LoadingActions } from '../helpers/loading_redux';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesActions } from '../namespaces';
import { AuthenticationActions, AuthenticationSelectors } from './redux';

export function* fetchCurrentUser(api) {
  const route = localStorage.getItem(PREVIOUS_PATH) || DEFAULT_ROUTE;
  yield put(AuthenticationActions.setRoute(route));
  const response = yield call(requestSaga, {
    errorSection: 'fetchCurrentUser',
    loadingSection: 'fetchCurrentUser',
    apiMethod: api.fetchCurrentUser,
    successAction: AuthenticationActions.fetchCurrentUserSuccess,
  });
  if (response.status === 401) window.location.pathname = '/login';
  else yield call(history.push, `/${route}`);
}

export function* updateTermsAndPolicies(api, { payload }) {
  const currentUser = yield select(AuthenticationSelectors.getCurrentUser);

  const queryParams = {
    userId: currentUser?.id || '',
  };

  yield call(requestSaga, {
    errorSection: 'updateTermsAndPolicies',
    loadingSection: 'updateTermsAndPolicies',
    apiMethod: api.updateTermsAndPolicies,
    apiParams: [{ userId: queryParams.userId, payload }],
    successAction: AuthenticationActions.updateTermsAndPoliciesSuccess,
  });
}

export function* fetchLicenseInfo(api) {
  yield put(LoadingActions.startLoading('fetchLicenseInfo'));
  const response = yield call(api.fetchLicenseInfo);
  if (response.ok)
    yield put(AuthenticationActions.fetchLicenseInfoSuccess(response.data));
  else
    yield put(
      AuthenticationActions.fetchLicenseInfoSuccess({ isLicenseValid: false })
    );
  yield put(LoadingActions.stopLoading('fetchLicenseInfo'));
}

export function* resetPasswordRequest(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'resetPasswordRequest',
    loadingSection: 'resetPasswordRequest',
    apiMethod: api.resetPasswordRequest,
    apiParams: [payload],
  });
  if (response.ok) {
    toast.success('Password reset request successful!');
    // yield put(AuthenticationActions.disableButton());
  } else {
    toast.error(response?.data?.message);
    // yield put(AuthenticationActions.enableButton());
  }
}

export function* resetPassword(api, { payload: { password, resetToken } }) {
  const response = yield call(requestSaga, {
    errorSection: 'resetPassword',
    loadingSection: 'resetPassword',
    apiMethod: api.resetPassword,
    apiParams: [{ password, resetToken }],
  });
  if (response.ok) yield call(history.push, '/admin/login');
  if (!response.ok) toast.error(response.data.message);
}
export function* login(api, { payload: { type, token, ...payload } }) {
  const response = yield call(requestSaga, {
    errorSection: 'login',
    loadingSection: 'login',
    apiMethod: type ? api.loginAdmin : api.loginUser,
    apiParams: [payload],
    successAction: AuthenticationActions.loginSuccess,
  });
  if (response.ok) {
    toast.success('Welcome! You’ve successfully logged in. ');
    localStorage.setItem(ACCESS_TOKEN, response.data.token);
    localStorage.setItem(CLUSTERS_TOKEN, []);
    localStorage.setItem(
      'selected_cluster',
      JSON.stringify({
        label: '',
        value: '',
      })
    );
    yield put(
      NamespacesActions.setSelectedCluster({
        label: '',
        value: '',
      })
    );
    const cluster = {
      id: response.data.cluster_id,
      name: response.data.cluster_name,
      token: response.data.cluster_token,
    };
    localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify([cluster]));
    if (!type) {
      localStorage.setItem(
        'selected_cluster',
        JSON.stringify({
          label: '',
          value: '',
        })
      );
      yield put(
        NamespacesActions.setSelectedCluster({
          label: '',
          value: '',
        })
      );
    }
    const scheduledId = window.localStorage.getItem('scheduleTokenid');
    yield call(fetchCurrentUser, api);
    if (scheduledId) {
      yield call(history.push, `/schedule-deployment`);
    }

    if (!token) {
      yield put(AuthenticationActions.setRoute(DEFAULT_ROUTE));
      window.location.pathname = '/dashboard';
    } else {
      yield put(AuthenticationActions.setRoute('schedule-deployment'));
      yield call(history.push, `schedule-deployment?token=${token}`);
    }
  } else {
    toast.error(response.data.message, { toastId: 'login-toast-error1' });
  }
}
export function* logout(api, { payload: { url } }) {
  yield put(AuthenticationActions.logoutSuccess());
  yield put({ type: 'RESET' });
  localStorage.removeItem('access_token');
  localStorage.removeItem('previous_path');
  localStorage.removeItem('selected_cluster');
  localStorage.removeItem(CLUSTERS_TOKEN);
<<<<<<< Updated upstream
  yield keycloak.logout();
  history.replace(url); // Example: '/login'
=======
  const storedConfig = localStorage.getItem('keycloakConfig');
  if (!storedConfig) {
    throw new Error('Keycloak config not found in localStorage');
  }

  // yield keycloak.logout({ redirectUri: `${API_URL}/login` });
>>>>>>> Stashed changes
}
export function* fetchSettingLogo(api) {
  yield call(requestSaga, {
    errorSection: 'fetchSettingLogo',
    loadingSection: 'fetchSettingLogo',
    apiMethod: api.fetchSettingLogo,
    apiParams: [{ params: {} }],
    successAction: AuthenticationActions.fetchSettingLogoSuccess,
  });
}

export function* fetchKeycloakConfig(api) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchKeycloakConfig',
    loadingSection: 'fetchKeycloakConfig',
    apiMethod: api.fetchKeycloakConfig,
    apiParams: [{ params: {} }],
  });

  if (response.ok) {
    yield call(
      [localStorage, 'setItem'],
      'keycloakConfig',
      JSON.stringify(response?.data)
    );
    yield put(AuthenticationActions.fetchKeycloakConfigSuccess(response.data));
  } else {
    toast.error('Failed to fetch Keycloak config:', response.data.message);
  }
}
export function* ssoUserLogin(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'ssoUserLogin',
    loadingSection: 'ssoUserLogin',
    apiMethod: api.ssoUserLogin,
    apiParams: [payload],
  });
  if (response.ok) {
    const token = response?.data?.token;
    localStorage.setItem(ACCESS_TOKEN, token);
    if (token) {
      yield call(fetchCurrentUser, api);
      toast.success('Welcome! You’ve successfully logged in.');
      history.push('/dashboard');
    }
  } else {
    toast.error(response.data.message, { toastId: 'login-toast-error1' });
<<<<<<< Updated upstream
=======
    history.push('/login');
    // yield keycloak.logout({ redirectUri: `${API_URL}/login` });
>>>>>>> Stashed changes
  }
}

export function* authenticationSagas(api) {
  yield all([
    takeLatest(AuthenticationActions.login, login, api),
    takeLatest(AuthenticationActions.logout, logout, api),
    takeLatest(
      AuthenticationActions.resetPasswordRequest,
      resetPasswordRequest,
      api
    ),
    takeLatest(AuthenticationActions.resetPassword, resetPassword, api),
    takeLatest(AuthenticationActions.fetchCurrentUser, fetchCurrentUser, api),
    takeLatest(AuthenticationActions.fetchLicenseInfo, fetchLicenseInfo, api),
    takeLatest(
      AuthenticationActions.updateTermsAndPolicies,
      updateTermsAndPolicies,
      api
    ),
    takeLatest(AuthenticationActions.fetchSettingLogo, fetchSettingLogo, api),
    takeLatest(
      AuthenticationActions.fetchKeycloakConfig,
      fetchKeycloakConfig,
      api
    ),
    takeLatest(AuthenticationActions.ssoUserLogin, ssoUserLogin, api),
  ]);
}
