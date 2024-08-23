import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-SETTINGS/';

export const SettingsActions = {
  createSettings: createAction(`${prefix}createSettings`),
  fetchSettings: createAction(`${prefix}fetchSettings`),
  fetchSettingsSuccess: createAction(`${prefix}fetchSettingsSuccess`),
};

// /* ------------- INITIAL STATE ------------- */
export const SETTING_INITIAL_STATE = {
  data: {},
};

// /* ------------- SELECTORS ------------------ */
export const SettingsSelectors = {
  getSettings: state => state.data,
};

// /* ------------- REDUCERS ------------------- */
const fetchSettingsSuccess = (state, { payload }) => {
  console.log(payload, 'ppp'); // Check what is being logged here
  return {
    ...state,
    data: payload.data, // Ensure that `payload.data` actually contains the settings data
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const settingsReducer = createReducer(SETTING_INITIAL_STATE, builder => {
  builder.addCase(SettingsActions.fetchSettingsSuccess, fetchSettingsSuccess);
});
