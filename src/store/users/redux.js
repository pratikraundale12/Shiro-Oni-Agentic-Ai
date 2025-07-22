import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-USERS/';

/* ------------- ACTIONS ------------------ */
export const UsersActions = {
  fetchUsers: createAction(`${prefix}fetchUsers`),
  fetchUsersSuccess: createAction(`${prefix}fetchUsersSuccess`),
  setUserModalOpen: createAction(`${prefix}setUserModalOpen`),
  setuserRoleEditModalOpen: createAction(`${prefix}setuserRoleEditModalOpen`),
  setSingleUserForEdit: createAction(`${prefix}setSingleUserForEdit`),
};

/* ------------- INITIAL STATE ------------- */
export const USERS_INITIAL_STATE = {
  count: null,
  data: [],
  prev: null,
  next: null,
  isUserModalOpen: false,
  userRoleEditModalOpen: false,
  singleUserForEdit: {},
};

/* ------------- SELECTORS ------------------ */
export const UsersSelectors = {
  getCount: state => state.users.count,
  getUsers: state => state.users.data,
  getUserModalOpen: state => state.users.isUserModalOpen,
  getUserRoleEditModalOpen: state => state.users.userRoleEditModalOpen,
  getSingleUserForEdit: state => state.users.singleUserForEdit,
};

/* ------------- REDUCERS ------------------- */
const fetchUsersSuccess = (state, { payload }) => {
  return {
    count: payload.count,
    data: payload.data,
    prev: payload.prev,
    next: payload.next,
  };
};
const setUserModalOpen = (state, { payload }) => {
  return {
    ...state,
    isUserModalOpen: payload,
  };
};
const setuserRoleEditModalOpen = (state, { payload }) => {
  return {
    ...state,
    userRoleEditModalOpen: payload,
  };
};
const setSingleUserForEdit = (state, { payload }) => {
  return {
    ...state,
    singleUserForEdit: payload,
  };
};
/* ------------- Hookup Reducers To Types ------------- */
export const usersReducer = createReducer(USERS_INITIAL_STATE, builder => {
  builder
    .addCase(UsersActions.fetchUsersSuccess, fetchUsersSuccess)
    .addCase(UsersActions.setUserModalOpen, setUserModalOpen)
    .addCase(UsersActions.setuserRoleEditModalOpen, setuserRoleEditModalOpen)
    .addCase(UsersActions.setSingleUserForEdit, setSingleUserForEdit);
});
