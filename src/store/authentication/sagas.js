import { put, call, all, takeLatest, select } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { AuthenticationActions, AuthenticationSelectors } from './redux';
import { ACCESS_TOKEN, CLUSTERS_TOKEN, DEFAULT_ROUTE } from '../../constants';
import { history } from '../../helpers/history';
import { toast } from 'react-toastify';

export function* fetchCurrentUser(api) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchCurrentUser',
    loadingSection: 'fetchCurrentUser',
    apiMethod: api.fetchCurrentUser,
    successAction: AuthenticationActions.fetchCurrentUserSuccess,
  });
  if (response.status === 401) window.location.pathname = '/login';
  else yield call(history.push, `/${DEFAULT_ROUTE}`);
}

export function* resetPasswordRequest(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'resetPasswordRequest',
    loadingSection: 'resetPasswordRequest',
    apiMethod: api.resetPasswordRequest,
    apiParams: [payload],
    successAction: AuthenticationActions.resetPasswordRequestSuccess,
  });
  if (response.ok) yield call(history.push, '/reset');
  if (!response.ok) toast.error(response.data.message);
}

export function* resetPassword(api, { payload: { password } }) {
  const resetToken = yield select(AuthenticationSelectors.getResetToken);
  const response = yield call(requestSaga, {
    errorSection: 'resetPassword',
    loadingSection: 'resetPassword',
    apiMethod: api.resetPassword,
    apiParams: [{ password, resetToken }],
  });
  if (response.ok) yield call(history.push, '/success');
  if (!response.ok) toast.error(response.data.message);
}

export function* login(api, { payload: { type, ...payload } }) {
  const response = yield call(requestSaga, {
    errorSection: 'login',
    loadingSection: 'login',
    apiMethod: type ? api.loginAdmin : api.loginUser,
    apiParams: [payload],
    successAction: AuthenticationActions.loginSuccess,
  });
  if (response.ok) {
    toast.success('Login successful');
    localStorage.setItem(ACCESS_TOKEN, response.data.token);
    if (!type) {
      const cluster = {
        id: response.data.cluster_id,
        name: response.data.cluster_name,
        token: response.data.cluster_token,
      };
      localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify([cluster]));
    }
    yield call(fetchCurrentUser, api);
    if (response.ok) {
      yield put(AuthenticationActions.setRoute(DEFAULT_ROUTE));
      window.location.pathname = DEFAULT_ROUTE;
    }
  } else {
    toast.error(response.data.message);
  }
}

export function* logout() {
  yield put(AuthenticationActions.logoutSuccess());
  yield put({ type: 'RESET' });
  localStorage.removeItem(ACCESS_TOKEN);
  history.replace('/login');
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
  ]);
}
