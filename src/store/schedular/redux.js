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
const setScheduleModal = state => {
  return {
    ...state,
    scheduleModal: !state.scheduleModal,
  };
};
const setCancelScheduleModal = state => {
  return {
    ...state,
    cancelScheduleModal: !state.cancelScheduleModal,
  };
};
const setRejectScheduleModal = state => {
  return {
    ...state,
    rejectScheduleModal: !state.rejectScheduleModal,
  };
};
const setApproveScheduleModal = state => {
  return {
    ...state,
    approveScheduleModal: !state.approveScheduleModal,
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
      .addCase(SchedularActions.setScheduleFromList, setScheduleFromList);
  }
);
