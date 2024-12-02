import { createAction, createReducer } from '@reduxjs/toolkit';
import { ACCESS_OPTIONS } from '../../constants';

const prefix = '@@KDFM-ROLES/';

/* ------------- ACTIONS ------------------ */
export const RolesActions = {
  fetchRoles: createAction(`${prefix}fetchRoles`),
  fetchRolesSuccess: createAction(`${prefix}fetchRolesSuccess`),
  fetchRoleClusters: createAction(`${prefix}fetchRoleClusters`),
  fetchRoleClustersSuccess: createAction(`${prefix}fetchRoleClustersSuccess`),
  updateRoleClusters: createAction(`${prefix}updateRoleClusters`),
  setSelectedRole: createAction(`${prefix}setSelectedRole`),
  permissionModal: createAction(`${prefix}permissionModal`),
  setAccessType: createAction(`${prefix}setAccessType`),
  createNewRole: createAction(`${prefix}createNewRole`),
  roleModal: createAction(`${prefix}roleModal`),
  fetchLdap: createAction(`${prefix}fetchLdap`),
  fetchLdapSuccess: createAction(`${prefix}fetchLdapSuccess`),
  displayGroup: createAction(`${prefix}displayGroup`),
  updateLdapGroup: createAction(`${prefix}updateLdapGroup`),
  setIsRoleListModalOpen: createAction(`${prefix}setIsRoleListModalOpen`),
  setRoleListSelectedItem: createAction(`${prefix}setRoleListSelectedItem`),
  setIsDeleteConfirmationModelOpen: createAction(
    `${prefix}setIsDeleteConfirmationModelOpen`
  ),
  deleteRole: createAction(`${prefix}deleteRole`),
  editRole: createAction(`${prefix}editRole`),
  setInactiveUserId: createAction(`${prefix}setInactiveUserId`),
  setInActiveUserIdModelOpen: createAction(
    `${prefix}setInActiveUserIdModelOpen`
  ),
};

/* ------------- INITIAL STATE ------------- */
export const ROLES_INITIAL_STATE = {
  selectedRole: {},
  data: [],
  roleClusters: [],
  permissionModal: false,
  accessType: ACCESS_OPTIONS[0],
  roleModal: false,
  formData: [],
  displayGroup: true,
  isRoleListModalOpen: false,
  roleListSelectedItem: {},
  isDeleteConfirmationModelOpen: false,
  inactiveUserId: '',
  inActiveUserIdModelOpen: false,
};

/* ------------- SELECTORS ------------------ */
export const RolesSelectors = {
  getRoles: state => state.roles.data,
  getSelectedRole: state => state.roles.selectedRole,
  getRoleClusters: state => state.roles.roleClusters,
  getPermissionModal: state => state.roles.permissionModal,
  getAccessType: state => state.roles.accessType,
  getRoleModal: state => state.roles.roleModal,
  getLdapGroup: state => state.roles.formData,
  getDiplayData: state => state.roles.displayGroup,
  getupdatedData: state => state.roles.formData,
  getIsRoleListModalOpen: state => state.roles.isRoleListModalOpen,
  getRoleListSelectedItem: state => state.roles.roleListSelectedItem,
  getIsDeleteConfirmationModelOpen: state =>
    state.roles.isDeleteConfirmationModelOpen,
  getInActiveUserId: state => state.roles.inactiveUserId,
  getInActiveUserIdModelOpen: state => state.roles.inActiveUserIdModelOpen,
};

/* ------------- REDUCERS ------------------- */
const fetchRolesSuccess = (state, { payload }) => {
  return {
    ...state,
    data: payload.data,
    selectedRole:
      state.selectedRole?.label || state.selectedRole?.value
        ? state.selectedRole
        : {
            label: payload.data[0]?.name,
            value: payload.data[0]?.role_id,
          },
  };
};

const fetchLdapSuccess = (state, { payload }) => {
  const { groups } = payload;
  const { data: roles } = state;

  const formData = groups.map(item => ({
    ldap_group_name: item.name,
    role_id: roles.find(role => role.ldap.includes(item.name))?.role_id,
  }));

  return {
    ...state,
    formData,
  };
};

const fetchRoleClustersSuccess = (state, { payload }) => {
  return {
    ...state,
    roleClusters: payload.clusters,
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
const roleModal = (state, { payload }) => {
  return {
    ...state,
    roleModal: payload,
  };
};
const displayGroup = (state, { payload }) => {
  return {
    ...state,
    displayGroup: payload,
  };
};
const updateLdapGroup = (state, { payload }) => {
  return {
    ...state,
    formData: payload,
  };
};
const setIsRoleListModalOpen = (state, { payload }) => {
  return {
    ...state,
    isRoleListModalOpen: payload,
  };
};
const setRoleListSelectedItem = (state, { payload }) => {
  return {
    ...state,
    roleListSelectedItem: payload,
  };
};

const setIsDeleteConfirmationModelOpen = (state, { payload }) => {
  return {
    ...state,
    isDeleteConfirmationModelOpen: payload,
  };
};
const setInactiveUserId = (state, { payload }) => {
  return {
    ...state,
    inactiveUserId: payload,
  };
};

const setInActiveUserIdModelOpen = (state, { payload }) => {
  return {
    ...state,
    inActiveUserIdModelOpen: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const rolesReducer = createReducer(ROLES_INITIAL_STATE, builder => {
  builder
    .addCase(RolesActions.fetchRolesSuccess, fetchRolesSuccess)
    .addCase(RolesActions.fetchRoleClustersSuccess, fetchRoleClustersSuccess)
    .addCase(RolesActions.setSelectedRole, setSelectedRole)
    .addCase(RolesActions.permissionModal, permissionModal)
    .addCase(RolesActions.setAccessType, setAccessType)
    .addCase(RolesActions.roleModal, roleModal)
    .addCase(RolesActions.fetchLdapSuccess, fetchLdapSuccess)
    .addCase(RolesActions.displayGroup, displayGroup)
    .addCase(RolesActions.updateLdapGroup, updateLdapGroup)
    .addCase(RolesActions.setIsRoleListModalOpen, setIsRoleListModalOpen)
    .addCase(RolesActions.setRoleListSelectedItem, setRoleListSelectedItem)
    .addCase(
      RolesActions.setIsDeleteConfirmationModelOpen,
      setIsDeleteConfirmationModelOpen
    )
    .addCase(RolesActions.setInactiveUserId, setInactiveUserId)
    .addCase(
      RolesActions.setInActiveUserIdModelOpen,
      setInActiveUserIdModelOpen
    );
});
