import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-LOADING/';

export const LoadingActions = {
  startLoading: createAction(`${prefix}startLoading`),
  stopLoading: createAction(`${prefix}stopLoading`),
};

/* ------------- Initial state ------------- */
export const INITIAL_STATE = {};

/* ------------- SELECTORS ------------------ */
export const LoadingSelectors = {
  getLoading: (state, section) => state.loaders[section],
};

/* ------------- REDUCERS -------------------- */

const startLoading = (state, { payload }) => {
  return {
    ...state,
    [payload]: true,
  };
};

const stopLoading = (state, { payload }) => {
  return {
    ...state,
    [payload]: false,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const loadingReducer = createReducer(INITIAL_STATE, builder => {
  builder
    .addCase(LoadingActions.startLoading, startLoading)
    .addCase(LoadingActions.stopLoading, stopLoading);
});
