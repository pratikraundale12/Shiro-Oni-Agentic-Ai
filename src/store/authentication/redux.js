import { createReducer, createAction } from '@reduxjs/toolkit';
import { formatDateStringToLocal } from '../../helpers';
import { DEFAULT_ROUTE, PREVIOUS_PATH } from '../../constants';

const prefix = '@@KDFM-AUTHENTICATION/';

/* ------------- ACTIONS ------------------ */
export const AuthenticationActions = {
  setRoute: createAction(`${prefix}setRoute`),
  fetchCurrentUser: createAction(`${prefix}fetchCurrentUser`),
  fetchCurrentUserSuccess: createAction(`${prefix}fetchCurrentUserSuccess`),
  login: createAction(`${prefix}login`),
  loginSuccess: createAction(`${prefix}loginSuccess`),
  logout: createAction(`${prefix}logout`),
  logoutSuccess: createAction(`${prefix}logoutSuccess`),
  resetPasswordRequest: createAction(`${prefix}resetPasswordRequest`),
  resetPasswordRequestSuccess: createAction(
    `${prefix}resetPasswordRequestSuccess`
  ),
  resetPassword: createAction(`${prefix}resetPassword`),
  setClusterLogin: createAction(`${prefix}setClusterLogin`),
};

/* ------------- INITIAL STATE ------------- */
export const AUTHENTICATION_INITIAL_STATE = {
  user: {},
  route: DEFAULT_ROUTE,
  license: '',
  isLoggedIn: false,
  resetToken: '',
  clusterLogin: false,
};

/* ------------- SELECTORS ------------------ */
export const AuthenticationSelectors = {
  getCurrentUser: state => state.auth.user,
  getIsLoggedIn: state => state.auth.isLoggedIn,
  getRoute: state => state.auth.route,
  getLicense: state => state.auth.license,
  getResetToken: state => state.auth.resetToken,
  getClusterLogin: state => state.auth.clusterLogin,
};

/* ------------- REDUCERS ------------------- */
const fetchCurrentUserSuccess = (state, { payload }) => {
  return {
    ...state,
    user: payload,
    license: formatDateStringToLocal(payload.license),
    isLoggedIn: true,
  };
};
const loginSuccess = state => {
  return {
    ...state,
    isLoggedIn: true,
  };
};
const logoutSuccess = () => {
  return {
    user: {},
    isLoggedIn: false,
  };
};
const resetPasswordRequestSuccess = (state, { payload: { resetToken } }) => {
  return {
    ...state,
    resetToken,
  };
};
const setRoute = (state, { payload }) => {
  localStorage.setItem(PREVIOUS_PATH, payload);
  return {
    ...state,
    route: payload,
  };
};
const setClusterLogin = (state, { payload }) => {
  return {
    ...state,
    clusterLogin: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const authenticationReducer = createReducer(
  AUTHENTICATION_INITIAL_STATE,
  builder => {
    builder
      .addCase(
        AuthenticationActions.fetchCurrentUserSuccess,
        fetchCurrentUserSuccess
      )
      .addCase(AuthenticationActions.loginSuccess, loginSuccess)
      .addCase(AuthenticationActions.logoutSuccess, logoutSuccess)
      .addCase(
        AuthenticationActions.resetPasswordRequestSuccess,
        resetPasswordRequestSuccess
      )
      .addCase(AuthenticationActions.setRoute, setRoute)
      .addCase(AuthenticationActions.setClusterLogin, setClusterLogin);
  }
);
