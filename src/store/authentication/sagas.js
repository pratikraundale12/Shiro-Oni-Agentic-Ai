import { toast } from 'react-toastify';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
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
  if (response.ok) yield call(history.push, '/success');
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
    if (!type) {
      const cluster = {
        id: response.data.cluster_id,
        name: response.data.cluster_name,
        token: response.data.cluster_token,
      };
      localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify([cluster]));
      localStorage.setItem(
        'selected_cluster',
        JSON.stringify({
          label: cluster.name,
          value: cluster.id,
        })
      );
      yield put(
        NamespacesActions.setSelectedCluster({
          label: cluster.name,
          value: cluster.id,
        })
      );
    }
    yield call(fetchCurrentUser, api);
    if (!token) {
      yield put(AuthenticationActions.setRoute(DEFAULT_ROUTE));
      window.location.pathname = DEFAULT_ROUTE;
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
  localStorage.clear();
  history.replace(url);
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
  ]);
}
