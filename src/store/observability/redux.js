import { createAction, createReducer } from '@reduxjs/toolkit';
const prefix = '@@KDFM-OBSERVABILITY/';

/* ------------- ACTIONS ------------------ */
export const ObservabilityActions = {
  fetchLabels: createAction(`${prefix}fetchLabels`),
  fetchLogs: createAction(`${prefix}fetchLogs`),
  setLabels: createAction(`${prefix}setLabels`),
  setLogs: createAction(`${prefix}setLogs`),
  fetchMetrics: createAction(`${prefix}fetchMetrics`),
  setMetrics: createAction(`${prefix}setMetrics`),
  fetchMetricsList: createAction(`${prefix}fetchMetricsList`),
  setMetricsList: createAction(`${prefix}setMetricsList`),
};

/* ------------- INITIAL STATE ------------- */
export const OBSERVABILITY_INITIAL_STATE = {
  labels: {},
  logs: {},
  metrics: {},
  metricsList: {},
};

/* ------------- SELECTORS ------------------ */
export const ObservabilitySelectors = {
  getLabels: state => state.observability.labels,
  getLogs: state => state.observability.logs,
  getMetrics: state => state.observability.metrics,
  getMetricsList: state => state.observability.metricsList,
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

const setMetrics = (state, { payload }) => {
  return {
    ...state,
    logs: payload,
  };
};

const setMetricsList = (state, { payload }) => {
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
      .addCase(ObservabilityActions.setLogs, setLogs)
      .addCase(ObservabilityActions.setMetrics, setMetrics)
      .addCase(ObservabilityActions.setMetricsList, setMetricsList);
  }
);
