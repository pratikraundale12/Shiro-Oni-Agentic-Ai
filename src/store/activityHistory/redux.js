import { createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-ACTIVITY-HISTORY/';

/* ------------- ACTIONS ------------------ */
export const ActivityHistoryActions = {
  fetchActivityHistory: createAction(`${prefix}fetchActivityHistory`),
  fetchActivityHistorySuccess: createAction(
    `${prefix}fetchActivityHistorySuccess`
  ),
};

/* ------------- Hookup Reducers To Types ------------- */
export const ActivityHistoryTypes = {};
