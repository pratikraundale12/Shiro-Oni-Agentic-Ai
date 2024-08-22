import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-POLICIES/';

/* ------------- ACTIONS ------------------ */
export const PoliciesActions = {
  fetchPolicies: createAction(`${prefix}fetchPolicies`),
  fetchPoliciesSuccess: createAction(`${prefix}fetchPoliciesSuccess`),
  fetchPoliciesRoles: createAction(`${prefix}fetchPoliciesRoles`),
  fetchPoliciesRolesSuccess: createAction(`${prefix}fetchPoliciesRolesSuccess`),
  // fetchRolesPolicies: createAction(`${prefix}fetchRolesPolicies`),
  // fetchRolesPoliciesSuccess: createAction(`${prefix}fetchRolesPoliciesSuccess`),
  updateRolesPolicies: createAction(`${prefix}updateRolesPolicies`),
  // permissionModal: createAction(`${prefix}permissionModal`),
};

/* ------------- INITIAL STATE ------------- */
export const POLICIES_INITIAL_STATE = {
  data: [],
  // policiesRoles: {
  //   data: [],
  // },
  rolePolicies: [],
  // permissionModal: false,
};

/* ------------- SELECTORS ------------------ */
export const PoliciesSelectors = {
  getPolicies: state => state.policies.data,
  getPoliciesRoles: state => state.policies.rolePolicies,
  // getRolesPolicies: state => state.policies.rolesPolicies,
  // getPermissionModal: state => state.policies.permissionModal,
};

/* ------------- REDUCERS ------------------- */
const fetchPoliciesSuccess = (state, { payload }) => {
  return {
    ...state,
    data: payload?.data,
  };
};
const fetchPoliciesRolesSuccess = (state, { payload }) => {
  return {
    ...state,
    rolePolicies: payload?.policies,
  };
};
// const fetchRolesPoliciesSuccess = (state, { payload }) => {
//   return {
//     ...state,
//     rolesPolicies: payload.data?.map(item => ({
//       ...item,
//       policies: item.policies?.map(c => ({
//         label: c.policy_name,
//         value: c.policy_id,
//       })),
//     })),
//   };
// };
// const permissionModal = state => {
//   return {
//     ...state,
//     permissionModal: !state.permissionModal,
//   };
// };

/* ------------- Hookup Reducers To Types ------------- */
export const policiesReducer = createReducer(
  POLICIES_INITIAL_STATE,
  builder => {
    builder
      // .addCase(
      //   PoliciesActions.fetchRolesPoliciesSuccess,
      //   fetchRolesPoliciesSuccess
      // )
      .addCase(
        PoliciesActions.fetchPoliciesRolesSuccess,
        fetchPoliciesRolesSuccess
      )
      // .addCase(PoliciesActions.permissionModal, permissionModal)
      .addCase(PoliciesActions.fetchPoliciesSuccess, fetchPoliciesSuccess);
  }
);
