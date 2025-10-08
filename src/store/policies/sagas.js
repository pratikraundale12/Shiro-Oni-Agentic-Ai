import { toast } from 'react-toastify';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { AuthenticationActions } from '../authentication';
import { requestSaga } from '../helpers/request_sagas';
import { PoliciesActions } from './redux';
// import { fetchGrid } from '../grid';

export function* fetchPolicies(api) {
  yield call(requestSaga, {
    errorSection: 'fetchPolicies',
    loadingSection: 'fetchPolicies',
    apiMethod: api.fetchPolicies,
    apiParams: [{ params: {} }],
    successAction: PoliciesActions.fetchPoliciesSuccess,
  });
}

export function* fetchPoliciesRoles(api, { payload: { roleId, params = {} } }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchPoliciesRoles',
    loadingSection: 'fetchPoliciesRoles',
    apiMethod: api.fetchPoliciesRoles,
    apiParams: [{ params, payload: { roleId } }],
    successAction: PoliciesActions.fetchPoliciesRolesSuccess,
  });

  if (!response?.ok) toast.error(response?.data?.message);
}

// export function* fetchRolesPolicies(api) {
//   yield call(requestSaga, {
//     errorSection: 'fetchRolesPolicies',
//     loadingSection: 'fetchRolesPolicies',
//     apiMethod: api.fetchRolesPolicies,
//     apiParams: [{ params: {} }],
//     successAction: PoliciesActions.fetchRolesPoliciesSuccess,
//   });
// }

export function* updateRolesPolicies(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'updateRolesPolicies',
    loadingSection: 'updateRolesPolicies',
    apiMethod: api.updateRolesPolicies,
    apiParams: [{ params: {}, payload }],
  });
  if (response.ok) {
    toast.success('Roles access updated.');
    yield call(fetchPoliciesRoles, api, {
      payload: { roleId: payload.roleId },
    });
    yield put(AuthenticationActions.fetchCurrentUser());
  }
  if (!response.ok) toast.error(response.data.message);
}

export function* policiesSagas(api) {
  yield all([
    takeLatest(PoliciesActions.fetchPolicies, fetchPolicies, api),
    takeLatest(PoliciesActions.fetchPoliciesRoles, fetchPoliciesRoles, api),
    // takeLatest(PoliciesActions.fetchRolesPolicies, fetchRolesPolicies, api),
    takeLatest(PoliciesActions.updateRolesPolicies, updateRolesPolicies, api),
  ]);
}
