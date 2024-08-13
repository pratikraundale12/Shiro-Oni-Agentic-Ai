import { call, all, put, takeLatest } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { UsersActions } from './redux';

export function* fetchUsers(api, { payload }) {
  console.log('payload', payload);
  const response = yield call(requestSaga, {
    errorSection: 'fetchUsers',
    loadingSection: 'fetchUsers',
    apiMethod: api.fetchUsers,
    apiParams: [payload],
  });

  if (response.ok) {
    yield put(
      UsersActions.fetchUsersSuccess({ ...response.data, test: 'test' })
    );
  }
}

export function* usersSagas(api) {
  yield all([takeLatest(UsersActions.fetchUsers, fetchUsers, api)]);
}
