import { toast } from 'react-toastify';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { UsersActions } from './redux';

export function* fetchUsers(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchUsers',
    loadingSection: 'fetchUsers',
    apiMethod: api.fetchUsers,
    apiParams: [payload],
  });

  if (response.ok) {
    yield put(UsersActions.fetchUsersSuccess(response.data));
  } else {
    toast.error(response?.message || response?.data?.message);
  }
}

export function* usersSagas(api) {
  yield all([takeLatest(UsersActions.fetchUsers, fetchUsers, api)]);
}
