import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-SCHEDULAR/';

/* ------------- ACTIONS ------------------ */
export const SchedularActions = {
  scheduleDeployment: createAction(`${prefix}scheduleDeployment`),
  createScheduleDeployment: createAction(`${prefix}createScheduleDeployment`),
  fetchNamespaces: createAction(`${prefix}fetchNamespaces`),
  fetchNamespacesSuccess: createAction(`${prefix}fetchNamespacesSuccess`),
  editScheduleDeployment: createAction(`${prefix}editScheduleDeployment`),
};

/* ------------- INITIAL STATE ------------- */
export const SCHEDULAR_INITIAL_STATE = {
  data: {},
  createdScheduleData: {},
};

/* ------------- SELECTORS ------------------ */
export const SchedularSelectors = {
  createScheduleDeployment: state => state.schedular.schedularDeployment,
  fetchNamespaces: state => state.schedular.clusterNamespaces?.data,
  editScheduleDeployment: state => state.schedular.editSchedularDeployment,
};

/* ------------- REDUCERS ------------------- */
const createScheduleDeployment = (state, { payload }) => {
  return {
    ...state,
    schedularDeployment: payload,
  };
};
const fetchNamespacesSuccess = (state, { payload }) => {
  return {
    ...state,
    clusterNamespaces: payload,
  };
};

const editScheduleDeployment = (state, { payload }) => {
  return {
    ...state,
    editSchedularDeployment: payload,
  };
};
/* ------------- Hookup Reducers To Types ------------- */
export const schedularReducer = createReducer(
  SCHEDULAR_INITIAL_STATE,
  builder => {
    builder
      .addCase(
        SchedularActions.createScheduleDeployment,
        createScheduleDeployment
      )
      .addCase(SchedularActions.fetchNamespacesSuccess, fetchNamespacesSuccess)
      .addCase(SchedularActions.editScheduleDeployment, editScheduleDeployment);
  }
);
