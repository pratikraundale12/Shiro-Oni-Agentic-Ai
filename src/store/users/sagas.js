import { toast } from 'react-toastify';
import { all, call, put, takeLatest, select } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { UsersActions } from './redux';
import { GridActions } from '../grid';
import { ClustersSelectors } from '../clusters';

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
export function* createUserByDFM(api, { payload }) {
  const itemPerPage = yield select(ClustersSelectors.getClusterListItems);
  const response = yield call(requestSaga, {
    errorSection: 'createUserByDFM',
    loadingSection: 'createUserByDFM',
    apiMethod: api.createUserByDFM,
    apiParams: [{ payload }],
  });
  if (response.ok) {
    toast.success(response?.data?.message || 'User created successfully');
    yield put(UsersActions.setUserModalOpen(false));
    yield put(UsersActions.setAddNewUser(false));
    yield put(
      GridActions.fetchGrid({
        module: 'users',
        params: { page: 1, limit: itemPerPage || 10 },
      })
    );
  } else {
    toast.error(response?.data?.error);
  }
}

export function* usersSagas(api) {
  yield all([
    takeLatest(UsersActions.fetchUsers, fetchUsers, api),
    takeLatest(UsersActions.createUserByDFM, createUserByDFM, api),
  ]);
}
