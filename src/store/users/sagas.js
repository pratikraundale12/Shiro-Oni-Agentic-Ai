import { toast } from 'react-toastify';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { KDFM } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { UsersActions } from './redux';

export function* fetchUsers(api, { payload }) {
  const updatePayload = payload?.admin_role_id
    ? { admin_role_id: payload?.admin_role_id }
    : payload;
  const response = yield call(requestSaga, {
    errorSection: 'fetchUsers',
    loadingSection: 'fetchUsers',
    apiMethod: payload?.admin_role_id
      ? api.fetchUsersWithAdminId
      : api.fetchUsers,
    apiParams: [updatePayload],
  });

  if (response.ok) {
    yield put(UsersActions.fetchUsersSuccess(response.data));
  } else {
    toast.error(response.data?.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* usersSagas(api) {
  yield all([takeLatest(UsersActions.fetchUsers, fetchUsers, api)]);
}
