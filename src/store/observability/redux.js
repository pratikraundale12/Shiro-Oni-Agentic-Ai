import { createAction, createReducer } from '@reduxjs/toolkit';
const prefix = '@@KDFM-OBSERVABILITY/';

/* ------------- ACTIONS ------------------ */
export const ObservabilityActions = {
  fetchLabels: createAction(`${prefix}fetchLabels`),
  fetchLogs: createAction(`${prefix}fetchLogs`),
  setLabels: createAction(`${prefix}setLabels`),
  setLogs: createAction(`${prefix}setLogs`),
};

/* ------------- INITIAL STATE ------------- */
export const OBSERVABILITY_INITIAL_STATE = {
  labels: {},
  logs: {},
};

/* ------------- SELECTORS ------------------ */
export const ObservabilitySelectors = {
  getLabels: state => state.observability.labels,
  getLogs: state => state.observability.logs,
};

const setLabels = (state, { payload }) => {
  return {
    ...state,
    labels: payload,
  };
};

const setLogs = (state, { payload }) => {
  return {
    ...state,
    logs: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const observabilityReducer = createReducer(
  OBSERVABILITY_INITIAL_STATE,
  builder => {
    builder
      .addCase(ObservabilityActions.setLabels, setLabels)
      .addCase(ObservabilityActions.setLogs, setLogs);
  }
);
