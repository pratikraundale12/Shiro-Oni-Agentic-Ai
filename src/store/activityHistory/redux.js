import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-ACTIVITY-HISTORY/';

/* ------------- ACTIONS ------------------ */
export const ActivityHistoryActions = {
  setSelectedEntity: createAction(`${prefix}setSelectedEntity`),
  fetchActivityHistory: createAction(`${prefix}fetchActivityHistory`),
  fetchActivityHistorySuccess: createAction(
    `${prefix}fetchActivityHistorySuccess`
  ),
  resetActivityHistory: createAction(`${prefix}resetActivityHistory`),
};

/* ------------- Initial State ------------------ */
export const ACTIVITY_HISTORY_INITIAL_STATE = {
  selectedEntity: null,
};

/* ------------- SELECTORS ------------------ */
export const ActivityHistorySelectors = {
  getSelectedEntity: state => state.activityHistory.selectedEntity,
};

/* ------------- Reducers ------------------ */
const setSelectedEntity = (state, { payload }) => {
  return {
    ...state,
    selectedEntity: payload,
  };
};

const resetActivityHistory = () => {
  return {
    ...ACTIVITY_HISTORY_INITIAL_STATE,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const activityHistoryReducer = createReducer(
  ACTIVITY_HISTORY_INITIAL_STATE,
  builder => {
    builder
      .addCase(ActivityHistoryActions.setSelectedEntity, setSelectedEntity)
      .addCase(
        ActivityHistoryActions.resetActivityHistory,
        resetActivityHistory
      );
  }
);
