import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-SCHEDULAR/';

/* ------------- ACTIONS ------------------ */
export const SchedularActions = {
  scheduleDeployment: createAction(`${prefix}scheduleDeployment`),
};

/* ------------- INITIAL STATE ------------- */
export const SCHEDULAR_INITIAL_STATE = {
  data: {},
};

/* ------------- SELECTORS ------------------ */

/* ------------- REDUCERS ------------------- */

/* ------------- Hookup Reducers To Types ------------- */
export const schedularReducer = createReducer(
  SCHEDULAR_INITIAL_STATE,
  builder => {
    builder.addCase(
      SchedularActions.fetchSchedularSuccess,
      fetchSchedularSuccess
    );
  }
);
