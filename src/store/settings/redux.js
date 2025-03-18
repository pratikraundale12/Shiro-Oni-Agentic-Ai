import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-SETTINGS/';

export const SettingsActions = {
  createSettings: createAction(`${prefix}createSettings`),
  fetchSettings: createAction(`${prefix}fetchSettings`),
  fetchSettingsSuccess: createAction(`${prefix}fetchSettingsSuccess`),
  refreshSetting: createAction(`${prefix}refreshSetting`),
  flowValidationModalOpen: createAction(`${prefix}flowValidationModalOpen`),
};

// /* ------------- INITIAL STATE ------------- */
export const SETTING_INITIAL_STATE = {
  data: {},
  flowValidationModalOpen: false,
};

// /* ------------- SELECTORS ------------------ */
export const SettingsSelectors = {
  getSettings: state => state.settings.data,
  getFlowValidationModal: state => state.settings.flowValidationModalOpen,
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

/* ------------- Hookup Reducers To Types ------------- */
export const settingsReducer = createReducer(SETTING_INITIAL_STATE, builder => {
  builder
    .addCase(SettingsActions.fetchSettingsSuccess, fetchSettingsSuccess)
    .addCase(
      SettingsActions.flowValidationModalOpen,
      handleFlowValidationModalOpen
    );
});
