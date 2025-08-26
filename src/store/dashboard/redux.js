import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-DASHDOARD/';

/* ------------- ACTIONS ------------------ */
export const DashboardActions = {
  fetchDashboard: createAction(`${prefix}fetchDashboard`),
  fetchDashboardSuccess: createAction(`${prefix}fetchDashboardSuccess`),
  fetchDeploymentMetrics: createAction(`${prefix}fetchDeploymentMetrics`),
  fetchDeploymentMetricsSuccess: createAction(
    `${prefix}fetchDeploymentMetricsSuccess`
  ),
  setResetNamespaceOption: createAction(`${prefix}setResetNamespaceOption`),
};

/* ------------- INITIAL STATE ------------- */
export const DASHDOARD_INITIAL_STATE = {
  data: {},
  deploymentMetrics: {}, // <-- Add this
  resetNamespaceOption: false,
};

/* ------------- SELECTORS ------------------ */
export const DashboardSelectors = {
  getDashboardData: state => state.dashboard.data,
  getDeploymentMetrics: state => state.dashboard.deploymentMetrics, // <-- Add this
  getResetNamespaceOption: state => state.dashboard.resetNamespaceOption,
};

/* ------------- REDUCERS ------------------- */
const fetchDashboardSuccess = (state, { payload }) => {
  return {
    ...state,
    data: payload,
  };
};

const fetchDeploymentMetricsSuccess = (state, { payload }) => {
  return {
    ...state,
    deploymentMetrics: payload,
  };
};

const setResetNamespaceOption = (state, { payload }) => {
  return {
    ...state,
    resetNamespaceOption: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const dashboardReducer = createReducer(
  DASHDOARD_INITIAL_STATE,
  builder => {
    builder
      .addCase(DashboardActions.fetchDashboardSuccess, fetchDashboardSuccess)
      .addCase(
        DashboardActions.fetchDeploymentMetricsSuccess,
        fetchDeploymentMetricsSuccess
      )
      .addCase(
        DashboardActions.setResetNamespaceOption,
        setResetNamespaceOption
      );
  }
);
