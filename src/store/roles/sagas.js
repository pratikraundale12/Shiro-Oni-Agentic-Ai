import { call, all, takeLatest, put } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { RolesActions } from './redux';
import { toast } from 'react-toastify';
import { fetchGrid } from '../grid';

export function* fetchRoles(api) {
  yield call(requestSaga, {
    errorSection: 'fetchRoles',
    loadingSection: 'fetchRoles',
    apiMethod: api.fetchRoles,
    apiParams: [{ params: {} }],
    successAction: RolesActions.fetchRolesSuccess,
  });
}

export function* fetchRolesClusters(api) {
  yield call(requestSaga, {
    errorSection: 'fetchRolesClusters',
    loadingSection: 'fetchRolesClusters',
    apiMethod: api.fetchRolesClusters,
    apiParams: [{ params: {} }],
    successAction: RolesActions.fetchRolesClustersSuccess,
  });
}

export function* updateRolesClusters(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'updateRolesClusters',
    loadingSection: 'updateRolesClusters',
    apiMethod: api.updateRolesClusters,
    apiParams: [{ params: {}, payload }],
  });
  if (response.ok) {
    toast.success('Clusters access updated.');
    yield put(RolesActions.permissionModal());
    yield call(fetchGrid, api, { payload: { module: 'clustersRolesAccess' } });
  }
  if (!response.ok) toast.error(response.data.message);
}

export function* createNewRole(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createNewRole',
    loadingSection: 'createNewRole',
    apiMethod: api.createNewRole,
    apiParams: [{ payload }],
  });

  if (response.ok) {
    toast.success('New role created successfully.');
    yield put(RolesActions.roleModal());
    yield call(fetchRoles, api);
  } else {
    toast.error(response.data.message || 'Something went wrong');
  }
}

export function* rolesSagas(api) {
  yield all([
    takeLatest(RolesActions.fetchRoles, fetchRoles, api),
    takeLatest(RolesActions.fetchRolesClusters, fetchRolesClusters, api),
    takeLatest(RolesActions.updateRolesClusters, updateRolesClusters, api),
    takeLatest(RolesActions.createNewRole, createNewRole, api),
  ]);
}
