import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-GRID/';

/* ------------- ACTIONS ------------------ */
export const GridActions = {
  fetchGrid: createAction(`${prefix}fetchGrid`),
  fetchGridSuccess: createAction(`${prefix}fetchGridSuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const GRID_INITIAL_STATE = {};

/* ------------- SELECTORS ------------------ */
export const GridSelectors = {
  getGridData: (state, module) => state.grid?.[module]?.data || [],
};

/* ------------- REDUCERS ------------------- */
const fetchGridSuccess = (state, { payload: { module, data } }) => {
  return {
    ...state,
    [module]: {
      ...data,
    },
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const gridReducer = createReducer(GRID_INITIAL_STATE, builder => {
  builder.addCase(GridActions.fetchGridSuccess, fetchGridSuccess);
});
