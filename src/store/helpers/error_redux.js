import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-ERROR/';

export const ErrorsActions = {
  showError: createAction(`${prefix}showError`),
  clearError: createAction(`${prefix}clearError`),
  clearAllErrors: createAction(`${prefix}clearAllErrors`),
};

/* ------------- Initial State ------------- */
export const INITIAL_STATE = {};

/* ------------- Selectors ----------------- */
export const ErrorsSelectors = {
  getError: (state, section) => state.errors[section],
  hasError: (state, section) => Boolean(state.errors[section]),
  getAllErrors: state => state.errors,
};

/* ------------- Reducers ------------------ */
const showError = (state, { payload }) => {
  const { section, error, problem } = payload;
  return {
    ...state,
    [section]: { error, problem },
  };
};

const clearError = (state, { payload }) => {
  // eslint-disable-next-line no-unused-vars
  const { [payload]: _, ...rest } = state;
  return rest;
};

const clearAllErrors = () => {
  return {};
};

/* ------------- Hookup Reducers To Types ------------- */
export const errorsReducer = createReducer(INITIAL_STATE, builder => {
  builder
    .addCase(ErrorsActions.showError, showError)
    .addCase(ErrorsActions.clearError, clearError)
    .addCase(ErrorsActions.clearAllErrors, clearAllErrors);
});
