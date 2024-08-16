import { call, all, takeLatest, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { requestSaga } from '../helpers/request_sagas';
import { PoliciesActions } from './redux';
import { fetchGrid } from '../grid';

export function* fetchPolicies(api) {
  yield call(requestSaga, {
    errorSection: 'fetchPolicies',
    loadingSection: 'fetchPolicies',
    apiMethod: api.fetchPolicies,
    apiParams: [{ params: {} }],
    successAction: PoliciesActions.fetchPoliciesSuccess,
  });
}

export function* fetchRolesPolicies(api) {
  yield call(requestSaga, {
    errorSection: 'fetchRolesPolicies',
    loadingSection: 'fetchRolesPolicies',
    apiMethod: api.fetchRolesPolicies,
    apiParams: [{ params: {} }],
    successAction: PoliciesActions.fetchRolesPoliciesSuccess,
  });
}

export function* updateRolesPolicies(api, { payload }) {
  console.log('payload', payload);
  const response = yield call(requestSaga, {
    errorSection: 'updateRolesPolicies',
    loadingSection: 'updateRolesPolicies',
    apiMethod: api.updateRolesPolicies,
    apiParams: [{ params: {}, payload }],
  });
  if (response.ok) {
    toast.success('Roles access updated.');
    yield put(PoliciesActions.permissionModal());
    yield call(fetchGrid, api, { payload: { module: 'policiesRolesAccess' } });
  }
  if (!response.ok) toast.error(response.data.message);
}

export function* policiesSagas(api) {
  yield all([
    takeLatest(PoliciesActions.fetchPolicies, fetchPolicies, api),
    takeLatest(PoliciesActions.fetchRolesPolicies, fetchRolesPolicies, api),
    takeLatest(PoliciesActions.updateRolesPolicies, updateRolesPolicies, api),
  ]);
}
