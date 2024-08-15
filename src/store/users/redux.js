import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-USERS/';

/* ------------- ACTIONS ------------------ */
export const UsersActions = {
  fetchUsers: createAction(`${prefix}fetchUsers`),
  fetchUsersSuccess: createAction(`${prefix}fetchUsersSuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const USERS_INITIAL_STATE = {
  count: null,
  data: [],
  prev: null,
  next: null,
};

/* ------------- SELECTORS ------------------ */
export const UsersSelectors = {
  getCount: state => state.users.count,
  getUsers: state => state.users.data,
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

/* ------------- Hookup Reducers To Types ------------- */
export const usersReducer = createReducer(USERS_INITIAL_STATE, builder => {
  builder.addCase(UsersActions.fetchUsersSuccess, fetchUsersSuccess);
});
