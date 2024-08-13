import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-DASHDOARD/';

/* ------------- ACTIONS ------------------ */
export const DashboardActions = {
  fetchDashboard: createAction(`${prefix}fetchDashboard`),
  fetchDashboardSuccess: createAction(`${prefix}fetchDashboardSuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const DASHDOARD_INITIAL_STATE = {
  data: {},
};

/* ------------- SELECTORS ------------------ */
export const DashboardSelectors = {
  getDashboardData: state => state.dashboard.data,
};

/* ------------- REDUCERS ------------------- */
const fetchDashboardSuccess = (state, { payload }) => {
  return {
    ...state,
    data: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const dashboardReducer = createReducer(
  DASHDOARD_INITIAL_STATE,
  builder => {
    builder.addCase(
      DashboardActions.fetchDashboardSuccess,
      fetchDashboardSuccess
    );
  }
);
