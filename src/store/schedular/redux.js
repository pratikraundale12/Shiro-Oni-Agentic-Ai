import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-SCHEDULAR/';

/* ------------- ACTIONS ------------------ */
export const SchedularActions = {
  scheduleDeployment: createAction(`${prefix}scheduleDeployment`),
  createScheduleDeployment: createAction(`${prefix}createScheduleDeployment`),
};

/* ------------- INITIAL STATE ------------- */
export const SCHEDULAR_INITIAL_STATE = {
  data: {},
  createdScheduleData: {},
};

/* ------------- SELECTORS ------------------ */
export const SchedularSelectors = {
  createScheduleDeployment: state => state.schedular.schedularDeployment,
};

/* ------------- REDUCERS ------------------- */
const createScheduleDeployment = (state, { payload }) => {
  return {
    ...state,
    schedularDeployment: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const schedularReducer = createReducer(
  SCHEDULAR_INITIAL_STATE,
  builder => {
    builder.addCase(
      SchedularActions.createScheduleDeployment,
      createScheduleDeployment
    );
  }
);
