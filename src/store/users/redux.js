import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-USERS/';

/* ------------- ACTIONS ------------------ */
export const UsersActions = {
  fetchUsers: createAction(`${prefix}fetchUsers`),
  fetchUsersSuccess: createAction(`${prefix}fetchUsersSuccess`),
  setUserModalOpen: createAction(`${prefix}setUserModalOpen`),
  setAddNewUser: createAction(`${prefix}setAddNewUser`),
  createUserByDFM: createAction(`${prefix}createUserByDFM`),
};

/* ------------- INITIAL STATE ------------- */
export const USERS_INITIAL_STATE = {
  count: null,
  data: [],
  prev: null,
  next: null,
  isUserModalOpen: false,
  addNewUser: false,
};

/* ------------- SELECTORS ------------------ */
export const UsersSelectors = {
  getCount: state => state.users.count,
  getUsers: state => state.users.data,
  getUserModalOpen: state => state.users.isUserModalOpen,
  getAddNewUser: state => state.users.addNewUser,
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

const setAddNewUser = (state, { payload }) => {
  return {
    ...state,
    addNewUser: payload,
  };
};
/* ------------- Hookup Reducers To Types ------------- */
export const usersReducer = createReducer(USERS_INITIAL_STATE, builder => {
  builder
    .addCase(UsersActions.fetchUsersSuccess, fetchUsersSuccess)
    .addCase(UsersActions.setUserModalOpen, setUserModalOpen)
    .addCase(UsersActions.setAddNewUser, setAddNewUser);
});
