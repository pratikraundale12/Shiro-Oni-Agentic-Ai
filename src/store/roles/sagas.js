import { call, all, takeLatest, put, select } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { RolesActions, RolesSelectors } from './redux';
import { toast } from 'react-toastify';

export function* fetchRoles(api) {
  yield call(requestSaga, {
    errorSection: 'fetchRoles',
    loadingSection: 'fetchRoles',
    apiMethod: api.fetchRoles,
    apiParams: [{ params: {} }],
    successAction: RolesActions.fetchRolesSuccess,
  });
}

export function* fetchLdap(api, payload) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchLdap',
    loadingSection: 'ldapGroups',
    apiMethod: api.fetchLdap,
    apiParams: [{ ...payload, params: {} }],
    successAction: RolesActions.fetchLdapSuccess,
  });

  if (response.ok) {
    console.log(response, 'sagaApi');
    yield put(RolesActions.displayGroup());
    // yield call(fetchRoles, api);
  } else {
    toast.error(response.data.message || 'Something went wrong');
  }
}

export function* fetchRoleClusters(api, { payload: { roleId, params = {} } }) {
  yield call(requestSaga, {
    errorSection: 'fetchRoleClusters',
    loadingSection: 'fetchRoleClusters',
    apiMethod: api.fetchRoleClusters,
    apiParams: [{ params, payload: { roleId } }],
    successAction: RolesActions.fetchRoleClustersSuccess,
  });
}

export function* updateRoleClusters(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'updateRoleClusters',
    loadingSection: 'updateRoleClusters',
    apiMethod: api.updateRoleClusters,
    apiParams: [{ params: {}, payload }],
  });
  if (response.ok) {
    toast.success('Clusters access updated.');
    yield call(fetchRoleClusters, api, {
      payload: { roleId: payload.roleId },
    });
  }
  if (!response.ok) toast.error(response.data.message);
}

// export function* createNewRole(api, { payload }) {
//   const ldap_group_name = payload.ldapGroupName;
//   payload = { name: payload.name };
//   const response = yield call(requestSaga, {
//     errorSection: 'createNewRole',
//     loadingSection: 'createNewRole',
//     apiMethod: api.createNewRole,
//     apiParams: [{ payload }],
//   });

//   if (response.ok) {
//     const roles = yield select(RolesSelectors.getRoles);
//     const formData = yield select(RolesSelectors.getLdapGroup);
//     console.log(roles, formData, response.data.id, '>>>>>>>>');

//     toast.success('New role created successfully.');
//     yield put(RolesActions.roleModal());
//     yield call(fetchRoles, fetchLdap, api);
//   } else {
//     toast.error(response.data.message || 'Something went wrong');
//   }
// }

export function* createNewRole(api, { payload }) {
  // Extract ldapGroupName from the payload
  const ldap_group_name = payload.ldapGroupName;
  // Modify the payload for the API request
  payload = { name: payload.name };

  // Make the API call to create a new role
  const response = yield call(requestSaga, {
    errorSection: 'createNewRole',
    loadingSection: 'createNewRole',
    apiMethod: api.createNewRole,
    apiParams: [{ payload }],
  });

  if (response.ok) {
    yield call(fetchRoles, api);
    // const roles = yield select(RolesSelectors.getRoles);
    const formData = yield select(RolesSelectors.getLdapGroup);

    const updatedFormData = formData.map(item =>
      item.ldap_group_name === ldap_group_name
        ? { ...item, role_id: response.data.id }
        : item
    );

    yield put(RolesActions.updateLdapGroup(updatedFormData));

    toast.success('New role created successfully.');
    yield put(RolesActions.roleModal());
  } else {
    toast.error(response.data.message || 'Something went wrong');
  }
}

export function* rolesSagas(api) {
  yield all([
    takeLatest(RolesActions.fetchRoles, fetchRoles, api),
    takeLatest(RolesActions.fetchRoleClusters, fetchRoleClusters, api),
    takeLatest(RolesActions.updateRoleClusters, updateRoleClusters, api),
    takeLatest(RolesActions.createNewRole, createNewRole, api),
    takeLatest(RolesActions.fetchLdap, fetchLdap, api),
  ]);
}
