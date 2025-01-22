import { toast } from 'react-toastify';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { KDFM } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { RolesActions, RolesSelectors } from './redux';

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
    yield put(RolesActions.setSelectedLdapGroup(response.data));
    yield put(RolesActions.displayGroup(false));
  } else {
    toast.error(response?.message || response?.data?.message);
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

export function* createNewRole(api, { payload }) {
  const ldap_group_name = payload.ldapGroupName;
  payload = { name: payload.name };

  const response = yield call(requestSaga, {
    errorSection: 'createNewRole',
    loadingSection: 'createNewRole',
    apiMethod: api.createNewRole,
    apiParams: [{ payload }],
  });

  if (response.ok) {
    if (response?.status === 201) {
      yield call(fetchRoles, api);
      const formData = yield select(RolesSelectors.getLdapGroup);

      const updatedFormData = formData.map(item =>
        item.ldap_group_name === ldap_group_name
          ? { ...item, role_id: response.data.id }
          : item
      );

      yield put(RolesActions.updateLdapGroup(updatedFormData));

      toast.success('New role created successfully.');
      yield put(RolesActions.roleModal(false));
      yield put(RolesActions.setIsRoleListModalOpen(true));
    } else if (response?.status === 200) {
      yield put(RolesActions.roleModal(false));
      yield put(RolesActions.setInactiveUserId(response?.data?.id));
      yield put(RolesActions.setInActiveUserIdModelOpen(true));
    }
  } else if (!response.ok) {
    toast.error(
      response.data.type === 'FieldError'
        ? response.data.fieldErrors[0]?.name
        : response?.message || response?.data?.message
    );
  }
}

export function* deleteRole(api) {
  const selectedrole = yield select(RolesSelectors.getRoleListSelectedItem);

  const response = yield call(requestSaga, {
    errorSection: 'deleteRole',
    loadingSection: 'deleteRole',
    apiMethod: api.deleteRole,
    apiParams: [
      {
        roleId: selectedrole?.role_id,
      },
    ],
  });

  if (response.ok) {
    yield put(RolesActions.fetchRoles());
    toast.success('Role deleted successfully');
  } else if (!response.ok)
    toast.error(response?.message || response?.data?.message);
}

export function* editRole(api, { payload }) {
  const selectedrole = yield select(RolesSelectors.getRoleListSelectedItem);
  const inActiveRoleId = yield select(RolesSelectors.getInActiveUserId);
  const response = yield call(requestSaga, {
    errorSection: 'editRole',
    loadingSection: 'editRole',
    apiMethod: api.editRole,
    apiParams: [
      {
        payload: payload,
        roleId: inActiveRoleId ? inActiveRoleId : selectedrole?.role_id,
      },
    ],
  });

  if (response.ok) {
    yield put(RolesActions.fetchRoles());
    toast.success('Role edited successfully');
    yield put(RolesActions.roleModal(false));
  } else if (!response.ok) {
    toast.error(
      response.data.type === 'FieldError'
        ? response.data.fieldErrors[0]?.name
        : response?.message || response?.data?.message
    );
    yield put(RolesActions.roleModal(false));
  }
  yield put(RolesActions.setInactiveUserId(''));
  yield put(RolesActions.setInActiveUserIdModelOpen(false));
}

export function* rolesSagas(api) {
  yield all([
    takeLatest(RolesActions.fetchRoles, fetchRoles, api),
    takeLatest(RolesActions.fetchRoleClusters, fetchRoleClusters, api),
    takeLatest(RolesActions.updateRoleClusters, updateRoleClusters, api),
    takeLatest(RolesActions.createNewRole, createNewRole, api),
    takeLatest(RolesActions.fetchLdap, fetchLdap, api),
    takeLatest(RolesActions.deleteRole, deleteRole, api),
    takeLatest(RolesActions.editRole, editRole, api),
  ]);
}
