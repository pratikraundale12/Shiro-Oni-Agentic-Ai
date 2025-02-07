import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-SCHEDULAR/';

/* ------------- ACTIONS ------------------ */
export const SchedularActions = {
  setFormData: createAction(`${prefix}setFormData`),
  setSelectedSchedule: createAction(`${prefix}setSelectedSchedule`),
  setScheduleDeployModal: createAction(`${prefix}setScheduleDeployModal`),
  setScheduleModal: createAction(`${prefix}setScheduleModal`),
  setCancelScheduleModal: createAction(`${prefix}setCancelScheduleModal`),
  setRejectScheduleModal: createAction(`${prefix}setRejectScheduleModal`),
  setApproveScheduleModal: createAction(`${prefix}setApproveScheduleModal`),
  setTokenScheduleModal: createAction(`${prefix}setTokenScheduleModal`),
  createScheduleDeployment: createAction(`${prefix}createScheduleDeployment`),
  editScheduleDeployment: createAction(`${prefix}editScheduleDeployment`),
  checkApproverToken: createAction(`${prefix}checkApproverToken`),
  setScheduleFromList: createAction(`${prefix}setScheduleFromList`),
  editScheduleByRegistry: createAction(`${prefix}editScheduleByRegistry`),
  rejectScheduleDeployment: createAction(`${prefix}rejectScheduleDeployment`),
  setScheduleSelectRange: createAction(`${prefix}setScheduleSelectRange`),
  fetchDiffScheduleData: createAction(`${prefix}fetchDiffScheduleData`),
  setIsDiffModalOpen: createAction(`${prefix}setIsDiffModalOpen`),
  setDiffAllData: createAction(`${prefix}setDiffAllData`),
  setStatusFilterData: createAction(`${prefix}setStatusFilterData`),
  setSearchText: createAction(`${prefix}setSearchText`),
  setSelectedClusterState: createAction(`${prefix}setSelectedClusterState`),
  setSelectedStatusState: createAction(`${prefix}setSelectedStatusState`),
};
/* ------------- INITIAL STATE ------------- */
export const SCHEDULAR_INITIAL_STATE = {
  formData: {},
  selectedSchedule: {},
  scheduleDeployModal: false,
  scheduleModal: false,
  cancelScheduleModal: false,
  rejectScheduleModal: false,
  approveScheduleModal: false,
  tokenScheduleModal: false,
  scheduleFromList: false,
  scheduleSelectRange: [],
  isDiffModalOpen: false,
  diffAllData: {},
  statusFilterData: null,
  searchText: null,
  selectedClusterState: null,
  selectedStatusState: null,
};

/* ------------- SELECTORS ------------------ */
export const SchedularSelectors = {
  getFormData: state => state.schedular.formData,
  getSelectedSchedule: state => state.schedular.selectedSchedule,
  getScheduleDeployModal: state => state.schedular.scheduleDeployModal,
  getScheduleModal: state => state.schedular.scheduleModal,
  getCancelScheduleModal: state => state.schedular.cancelScheduleModal,
  getRejectScheduleModal: state => state.schedular.rejectScheduleModal,
  getApproveScheduleModal: state => state.schedular.approveScheduleModal,
  getTokenScheduleModal: state => state.schedular.tokenScheduleModal,
  getScheduleFromList: state => state.schedular.scheduleFromList,
  getScheduleSelectRange: state => state.schedular.scheduleSelectRange,
  getIsDiffModalOpen: state => state.schedular.isDiffModalOpen,
  getDiffAllData: state => state.schedular.diffAllData,
  getStatusFilterData: state => state.schedular.statusFilterData,
  getSearchText: state => state.schedular.searchText,
  getSelectedClusterState: state => state.schedular.selectedClusterState,
  getSelectedStatusState: state => state.schedular.selectedStatusState,
};

/* ------------- REDUCERS ------------------- */
const setFormData = (state, { payload }) => {
  return {
    ...state,
    formData: payload,
  };
};
const setSelectedSchedule = (state, { payload }) => {
  return {
    ...state,
    selectedSchedule: payload,
  };
};
const setScheduleDeployModal = state => {
  return {
    ...state,
    scheduleDeployModal: !state.scheduleDeployModal,
  };
};
const setScheduleModal = (state, { payload }) => {
  return {
    ...state,
    scheduleModal: payload,
  };
};
const setCancelScheduleModal = (state, { payload }) => {
  return {
    ...state,
    cancelScheduleModal: payload,
  };
};
const setRejectScheduleModal = (state, { payload }) => {
  return {
    ...state,
    rejectScheduleModal: payload,
  };
};
const setApproveScheduleModal = (state, { payload }) => {
  return {
    ...state,
    approveScheduleModal: payload,
  };
};
const setTokenScheduleModal = (state, { payload }) => {
  return {
    ...state,
    tokenScheduleModal: payload,
  };
};

const setScheduleFromList = (state, { payload }) => {
  return {
    ...state,
    scheduleFromList: payload,
  };
};
const setScheduleSelectRange = (state, { payload }) => {
  return {
    ...state,
    scheduleSelectRange: payload,
  };
};
const setIsDiffModalOpen = (state, { payload }) => {
  return {
    ...state,
    isDiffModalOpen: payload,
  };
};
const setDiffAllData = (state, { payload }) => {
  return {
    ...state,
    diffAllData: payload,
  };
};
const setStatusFilterData = (state, { payload }) => {
  return {
    ...state,
    statusFilterData: payload,
  };
};
const setSearchText = (state, { payload }) => {
  return {
    ...state,
    searchText: payload,
  };
};
const setSelectedClusterState = (state, { payload }) => {
  return {
    ...state,
    selectedClusterState: payload,
  };
};
const setSelectedStatusState = (state, { payload }) => {
  return {
    ...state,
    selectedStatusState: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const schedularReducer = createReducer(
  SCHEDULAR_INITIAL_STATE,
  builder => {
    builder
      .addCase(SchedularActions.setFormData, setFormData)
      .addCase(SchedularActions.setSelectedSchedule, setSelectedSchedule)
      .addCase(SchedularActions.setScheduleDeployModal, setScheduleDeployModal)
      .addCase(SchedularActions.setScheduleModal, setScheduleModal)
      .addCase(SchedularActions.setCancelScheduleModal, setCancelScheduleModal)
      .addCase(SchedularActions.setRejectScheduleModal, setRejectScheduleModal)
      .addCase(
        SchedularActions.setApproveScheduleModal,
        setApproveScheduleModal
      )
      .addCase(SchedularActions.setTokenScheduleModal, setTokenScheduleModal)
      .addCase(SchedularActions.setScheduleFromList, setScheduleFromList)
      .addCase(SchedularActions.setScheduleSelectRange, setScheduleSelectRange)
      .addCase(SchedularActions.setIsDiffModalOpen, setIsDiffModalOpen)
      .addCase(SchedularActions.setDiffAllData, setDiffAllData)
      .addCase(SchedularActions.setStatusFilterData, setStatusFilterData)
      .addCase(SchedularActions.setSearchText, setSearchText)
      .addCase(
        SchedularActions.setSelectedClusterState,
        setSelectedClusterState
      )
      .addCase(SchedularActions.setSelectedStatusState, setSelectedStatusState);
  }
);
