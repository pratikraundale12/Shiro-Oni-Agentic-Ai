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
  getGridDataPermissions: (state, module) =>
    state.grid?.[module]?.permissions || {},
  getGridData: (state, module) => state.grid?.[module]?.data || [],
  getGridNodes: (state, module) => state.grid?.[module] || { nodes: [] },
  getGridCount: (state, module) => state.grid?.[module]?.count || 0,
  getGridPrev: (state, module) => state.grid?.[module]?.prev || null,
  getGridNext: (state, module) => state.grid?.[module]?.next || null,
  getGridBreadcrumb: (state, module) =>
    state.grid?.[module]?.breadcrumb?.map(item => ({
      label: item.name,
      value: item.id,
    })) || [],
  getNamespaceGridRegistry: (state, module) =>
    state.grid?.[module]?.registry || [],
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
