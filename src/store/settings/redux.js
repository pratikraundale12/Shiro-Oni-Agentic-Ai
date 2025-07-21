import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-SETTINGS/';

export const SettingsActions = {
  createSettings: createAction(`${prefix}createSettings`),
  fetchSettings: createAction(`${prefix}fetchSettings`),
  fetchSettingsSuccess: createAction(`${prefix}fetchSettingsSuccess`),
  refreshSetting: createAction(`${prefix}refreshSetting`),
  flowValidationModalOpen: createAction(`${prefix}flowValidationModalOpen`),
  addNewValidationModalOpen: createAction(`${prefix}addNewValidationModalOpen`),
  downloadLogsZip: createAction(`${prefix}downloadLogsZip`),
  downloadLogsRequest: createAction(`${prefix}downloadLogsRequest`),
  downloadLogsSuccess: createAction(`${prefix}downloadLogsSuccess`),
  downloadLogsFailure: createAction(`${prefix}downloadLogsFailure`),
  verifyEmail: createAction(`${prefix}verifyEmail`),
  verifyEmailSuccess: createAction(`${prefix}verifyEmailSuccess`),
  setIsEmailVerified: createAction(`${prefix}setIsEmailVerified`),
  fetchKeycloakUsers: createAction(`${prefix}fetchKeycloakUsers`),
  setkeycloakUserFetched: createAction(`${prefix}setkeycloakUserFetched`),
  setkeycloakUserListModalOpen: createAction(
    `${prefix}setkeycloakUserListModalOpen`
  ),
  assignKeycloakRolesToUsers: createAction(
    `${prefix}assignKeycloakRolesToUsers`
  ),
};

// /* ------------- INITIAL STATE ------------- */
export const SETTING_INITIAL_STATE = {
  data: {},
  flowValidationModalOpen: false,
  addNewValidationModalOpen: false,
  isDownloading: false,
  emailVerified: false,
  keycloakUserFetched: [],
  keycloakUserListModalOpen: false,
};

// /* ------------- SELECTORS ------------------ */
export const SettingsSelectors = {
  getSettings: state => state.settings.data,
  getFlowValidationModal: state => state.settings.flowValidationModalOpen,
  getAddNewValidationModalOpen: state =>
    state.settings.addNewValidationModalOpen,
  getIsDownloading: state => state.settings.isDownloading,
  getEmailVerified: state => state.settings.emailVerified,
  getKeycloakUserFetched: state => state.settings.keycloakUserFetched,
  getkeycloakUserListModalOpen: state =>
    state.settings.keycloakUserListModalOpen,
};

// /* ------------- REDUCERS ------------------- */
const fetchSettingsSuccess = (state, { payload }) => {
  return {
    ...state,
    data: payload, // Ensure that `payload.data` actually contains the settings data
  };
};
const handleFlowValidationModalOpen = (state, { payload }) => {
  return {
    ...state,
    flowValidationModalOpen: payload,
  };
};
const handleAddNewValidationModalOpen = (state, { payload }) => {
  return {
    ...state,
    addNewValidationModalOpen: payload,
  };
};

const verifyEmailSuccess = (state, { payload }) => {
  return {
    ...state,
    emailVerified: payload?.verified,
  };
};

const setIsEmailVerified = (state, { payload }) => {
  return {
    ...state,
    emailVerified: payload,
  };
};

const setkeycloakUserFetched = (state, { payload }) => {
  return {
    ...state,
    keycloakUserFetched: payload,
  };
};
const setkeycloakUserListModalOpen = (state, { payload }) => {
  return {
    ...state,
    keycloakUserListModalOpen: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const settingsReducer = createReducer(SETTING_INITIAL_STATE, builder => {
  builder
    .addCase(SettingsActions.fetchSettingsSuccess, fetchSettingsSuccess)
    .addCase(
      SettingsActions.flowValidationModalOpen,
      handleFlowValidationModalOpen
    )
    .addCase(
      SettingsActions.addNewValidationModalOpen,
      handleAddNewValidationModalOpen
    )
    .addCase(SettingsActions.downloadLogsRequest, state => {
      state.isDownloading = true;
    })
    .addCase(SettingsActions.downloadLogsSuccess, state => {
      state.isDownloading = false;
    })
    .addCase(SettingsActions.downloadLogsFailure, state => {
      state.isDownloading = false;
    })
    .addCase(SettingsActions.verifyEmailSuccess, verifyEmailSuccess)
    .addCase(SettingsActions.setIsEmailVerified, setIsEmailVerified)
    .addCase(SettingsActions.setkeycloakUserFetched, setkeycloakUserFetched)
    .addCase(
      SettingsActions.setkeycloakUserListModalOpen,
      setkeycloakUserListModalOpen
    );
});
