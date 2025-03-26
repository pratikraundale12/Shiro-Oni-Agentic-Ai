import { createAction, createReducer } from '@reduxjs/toolkit';
import { DEFAULT_ROUTE, PREVIOUS_PATH } from '../../constants';
import { formatDateStringToLocal } from '../../helpers';

const prefix = '@@KDFM-AUTHENTICATION/';

/* ------------- ACTIONS ------------------ */
export const AuthenticationActions = {
  setRoute: createAction(`${prefix}setRoute`),
  fetchCurrentUser: createAction(`${prefix}fetchCurrentUser`),
  fetchCurrentUserSuccess: createAction(`${prefix}fetchCurrentUserSuccess`),
  fetchLicenseInfo: createAction(`${prefix}fetchLicenseInfo`),
  fetchLicenseInfoSuccess: createAction(`${prefix}fetchLicenseInfoSuccess`),
  login: createAction(`${prefix}login`),
  loginSuccess: createAction(`${prefix}loginSuccess`),
  logout: createAction(`${prefix}logout`),
  logoutSuccess: createAction(`${prefix}logoutSuccess`),
  resetPasswordRequest: createAction(`${prefix}resetPasswordRequest`),
  resetPassword: createAction(`${prefix}resetPassword`),
  setClusterLogin: createAction(`${prefix}setClusterLogin`),
  setDestinationFlag: createAction(`${prefix}setDestinationFlag`),
  disableButton: createAction(`${prefix}disableButton`),
  updateTermsAndPolicies: createAction(`${prefix}updateTermsAndPolicies`),
  updateTermsAndPoliciesSuccess: createAction(
    `${prefix}updateTermsAndPoliciesSuccess`
  ),
  setCurrentUser: createAction(`${prefix}setCurrentUser`),
  fetchSettingLogo: createAction(`${prefix}fetchSettingLogo`),
  fetchSettingLogoSuccess: createAction(`${prefix}fetchSettingLogoSuccess`),
  fetchKeycloakConfig: createAction(`${prefix}fetchKeycloakConfig`),
  fetchKeycloakConfigSuccess: createAction(
    `${prefix}fetchKeycloakConfigSuccess`
  ),
  ssoUserLogin: createAction(`${prefix}ssoUserLogin`),
};

/* ------------- INITIAL STATE ------------- */
export const AUTHENTICATION_INITIAL_STATE = {
  user: {},
  route: DEFAULT_ROUTE,
  license: '',
  isLicenseValid: true,
  isLoggedIn: false,
  resetToken: '',
  clusterLogin: false,
  destinationFlag: false,
  permissions: [],
  isButtonDisabled: false,
  hasTermsAndPoliciesAccepted: false,
  data: {},
  keycloakConfig: {},
};

/* ------------- SELECTORS ------------------ */
export const AuthenticationSelectors = {
  getCurrentUser: state => state.auth.user,
  getIsLoggedIn: state => state.auth.isLoggedIn,
  getRoute: state => state.auth.route,
  getLicense: state => state.auth.license,
  getIsLicenseValid: state => state.auth.isLicenseValid,
  getResetToken: state => state.auth.resetToken,
  getClusterLogin: state => state.auth.clusterLogin,
  getDestinationFlag: state => state.auth.destinationFlag,
  getPermissions: state => state.auth.permissions,
  getIsButtonDisabled: state => state.auth.isButtonDisabled,
  getHasTermsAndPoliciesAccepted: state =>
    state.auth.hasTermsAndPoliciesAccepted,
  getSettingLogo: state => state.auth.data,
  getKeycloakConfig: state => state.auth.keycloakConfig,
  getLicenseInfo: state => state.auth.data,
};

/* ------------- REDUCERS ------------------- */
const fetchCurrentUserSuccess = (state, { payload }) => {
  return {
    ...state,
    user: payload,
    license: {
      licenseExpireDate: formatDateStringToLocal(payload.license),
      licenseType: payload.licenseType,
    },
    isLoggedIn: true,
    permissions: payload.permissions,
    hasTermsAndPoliciesAccepted:
      typeof payload.has_accepted_terms == 'boolean'
        ? payload.has_accepted_terms
        : JSON.parse(payload.has_accepted_terms || ''),
  };
};
const fetchLicenseInfoSuccess = (state, { payload }) => {
  return {
    ...state,
    isLicenseValid: payload?.isLicenseValid,
    data: payload,
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
const setDestinationFlag = state => {
  return {
    ...state,
    destinationFlag: !state.destinationFlag,
  };
};

const setCurrentUser = (state, { payload }) => {
  return {
    ...state,
    user: { ...state.user, ...payload },
  };
};

const disableButton = state => {
  return {
    ...state,
    isButtonDisabled: true,
  };
};

const updateTermsAndPoliciesSuccess = (state, { payload }) => {
  return {
    ...state,
    hasTermsAndPoliciesAccepted:
      typeof payload.has_accepted_terms == 'boolean'
        ? payload.has_accepted_terms
        : JSON.parse(payload.has_accepted_terms || ''),
  };
};
const fetchSettingLogoSuccess = (state, { payload }) => {
  return {
    ...state,
    data: payload,
  };
};

const fetchKeycloakConfigSuccess = (state, { payload }) => {
  return {
    ...state,
    keycloakConfig: payload,
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
      .addCase(
        AuthenticationActions.fetchLicenseInfoSuccess,
        fetchLicenseInfoSuccess
      )
      .addCase(AuthenticationActions.loginSuccess, loginSuccess)
      .addCase(AuthenticationActions.logoutSuccess, logoutSuccess)
      .addCase(AuthenticationActions.setRoute, setRoute)
      .addCase(AuthenticationActions.setClusterLogin, setClusterLogin)
      .addCase(AuthenticationActions.setDestinationFlag, setDestinationFlag)
      .addCase(AuthenticationActions.disableButton, disableButton)
      .addCase(
        AuthenticationActions.updateTermsAndPoliciesSuccess,
        updateTermsAndPoliciesSuccess
      )
      .addCase(AuthenticationActions.setCurrentUser, setCurrentUser)
      .addCase(
        AuthenticationActions.fetchSettingLogoSuccess,
        fetchSettingLogoSuccess
      )
      .addCase(
        AuthenticationActions.fetchKeycloakConfigSuccess,
        fetchKeycloakConfigSuccess
      );
  }
);
