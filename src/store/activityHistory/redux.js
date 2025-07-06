import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-ACTIVITY-HISTORY/';

/* ------------- ACTIONS ------------------ */
export const ActivityHistoryActions = {
  setSelectedEntity: createAction(`${prefix}setSelectedEntity`),
  setSelectedEvent: createAction(`${prefix}setSelectedEvent`),
  fetchActivityHistory: createAction(`${prefix}fetchActivityHistory`),
  fetchActivityHistorySuccess: createAction(
    `${prefix}fetchActivityHistorySuccess`
  ),
  resetActivityHistory: createAction(`${prefix}resetActivityHistory`),
  setSelectedItem: createAction(`${prefix}setSelectedItem`),
  setIsInfoModalOpen: createAction(`${prefix}setIsInfoModalOpen`),
  fetchEmailReport: createAction(`${prefix}fetchEmailReport`),
  fetchEmailReportSuccess: createAction(`${prefix}fetchEmailReportSuccess`),
  fetchDownloadReport: createAction(`${prefix}fetchDownloadReport`),
  fetchDownloadReportSuccess: createAction(
    `${prefix}fetchDownloadReportSuccess`
  ),
};

/* ------------- Initial State ------------------ */
export const ACTIVITY_HISTORY_INITIAL_STATE = {
  selectedEntity: null,
  selectedEvent: null,
  selectedItem: null,
  isInfoModalOpen: false,
  emailReportData: [],
  downloadReportData: [],
};

/* ------------- SELECTORS ------------------ */
export const ActivityHistorySelectors = {
  getSelectedEntity: state => state.activityHistory.selectedEntity,
  getSelectedEvent: state => state.activityHistory.selectedEvent,
  getSelectedItem: state => state.activityHistory.selectedItem,
  getIsInfoModalOpen: state => state.activityHistory.isInfoModalOpen,
  getEmailReportData: state => state.activityHistory.emailReportData,
  getDownloadReportData: state => state.activityHistory.downloadReportData,
};

/* ------------- Reducers ------------------ */
const setSelectedEntity = (state, { payload }) => {
  return {
    ...state,
    selectedEntity: payload,
  };
};

const setSelectedEvent = (state, { payload }) => {
  return {
    ...state,
    selectedEvent: payload,
  };
};

const resetActivityHistory = () => {
  return {
    ...ACTIVITY_HISTORY_INITIAL_STATE,
  };
};
const setSelectedItem = (state, { payload }) => {
  return {
    ...state,
    selectedItem: payload,
  };
};
const setIsInfoModalOpen = (state, { payload }) => {
  return {
    ...state,
    isInfoModalOpen: payload,
  };
};

const fetchEmailReportSuccess = (state, { payload }) => {
  return {
    ...state,
    emailReportData: payload?.data || [],
  };
};

const fetchDownloadReportSuccess = (state, { payload }) => {
  return {
    ...state,
    downloadReportData: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const activityHistoryReducer = createReducer(
  ACTIVITY_HISTORY_INITIAL_STATE,
  builder => {
    builder
      .addCase(ActivityHistoryActions.setSelectedEntity, setSelectedEntity)
      .addCase(ActivityHistoryActions.setSelectedEvent, setSelectedEvent)
      .addCase(ActivityHistoryActions.setSelectedItem, setSelectedItem)
      .addCase(ActivityHistoryActions.setIsInfoModalOpen, setIsInfoModalOpen)
      .addCase(
        ActivityHistoryActions.resetActivityHistory,
        resetActivityHistory
      )
      .addCase(
        ActivityHistoryActions.fetchEmailReportSuccess,
        fetchEmailReportSuccess
      )
      .addCase(
        ActivityHistoryActions.fetchDownloadReportSuccess,
        fetchDownloadReportSuccess
      );
  }
);
