import { createReducer, createAction } from '@reduxjs/toolkit';
import { ACCESS_OPTIONS } from '../../constants';

const prefix = '@@KDFM-ROLES/';

/* ------------- ACTIONS ------------------ */
export const RolesActions = {
  fetchRoles: createAction(`${prefix}fetchRoles`),
  fetchRolesSuccess: createAction(`${prefix}fetchRolesSuccess`),
  fetchRolesClusters: createAction(`${prefix}fetchRolesClusters`),
  fetchRolesClustersSuccess: createAction(`${prefix}fetchRolesClustersSuccess`),
  updateRolesClusters: createAction(`${prefix}updateRolesClusters`),
  setSelectedRole: createAction(`${prefix}setSelectedRole`),
  permissionModal: createAction(`${prefix}permissionModal`),
  setAccessType: createAction(`${prefix}setAccessType`),
  createNewRole: createAction(`${prefix}createNewRole`),
  roleModal: createAction(`${prefix}roleModal`),
};

/* ------------- INITIAL STATE ------------- */
export const ROLES_INITIAL_STATE = {
  selectedRole: '',
  data: [],
  rolesClusters: [],
  permissionModal: false,
  accessType: ACCESS_OPTIONS[0],
  roleModal: false,
};

/* ------------- SELECTORS ------------------ */
export const RolesSelectors = {
  getRoles: state => state.roles.data,
  getSelectedRole: state => state.roles.selectedRole,
  getRolesClusters: state => state.roles.rolesClusters,
  getPermissionModal: state => state.roles.permissionModal,
  getAccessType: state => state.roles.accessType,
  getRoleModal: state => state.roles.roleModal,
};

/* ------------- REDUCERS ------------------- */
const fetchRolesSuccess = (state, { payload }) => {
  return {
    ...state,
    data: payload.data,
    selectedRole: payload.data?.[0]?.id,
  };
};
const fetchRolesClustersSuccess = (state, { payload }) => {
  return {
    ...state,
    rolesClusters: payload.data?.map(item => ({
      ...item,
      clusters: item.clusters?.map(c => ({
        label: c.cluster_name,
        value: c.cluster_id,
      })),
    })),
  };
};
const setSelectedRole = (state, { payload }) => {
  return {
    ...state,
    selectedRole: payload,
  };
};
const permissionModal = state => {
  return {
    ...state,
    permissionModal: !state.permissionModal,
  };
};
const setAccessType = (state, { payload }) => {
  return {
    ...state,
    accessType: payload,
  };
};
const roleModal = state => {
  return {
    ...state,
    roleModal: !state.roleModal,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const rolesReducer = createReducer(ROLES_INITIAL_STATE, builder => {
  builder
    .addCase(RolesActions.fetchRolesSuccess, fetchRolesSuccess)
    .addCase(RolesActions.fetchRolesClustersSuccess, fetchRolesClustersSuccess)
    .addCase(RolesActions.setSelectedRole, setSelectedRole)
    .addCase(RolesActions.permissionModal, permissionModal)
    .addCase(RolesActions.setAccessType, setAccessType)
    .addCase(RolesActions.roleModal, roleModal);
  // .addCase(RolesActions.createNewRole, createNewRole);
});
