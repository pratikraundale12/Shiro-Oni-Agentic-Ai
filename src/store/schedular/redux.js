import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-SCHEDULAR/';

/* ------------- ACTIONS ------------------ */
export const SchedularActions = {
  scheduleDeployment: createAction(`${prefix}scheduleDeployment`),
  createScheduleDeployment: createAction(`${prefix}createScheduleDeployment`),
  fetchNamespaces: createAction(`${prefix}fetchNamespaces`),
  fetchNamespacesSuccess: createAction(`${prefix}fetchNamespacesSuccess`),
  editScheduleDeployment: createAction(`${prefix}editScheduleDeployment`),
  setScheduleModal: createAction(`${prefix}setScheduleModal`),
  setRejectScheduleModal: createAction(`${prefix}setRejectScheduleModal`),
  setEditScheduleModel: createAction(`${prefix}setEditScheduleModel`),
  setConfirmRejectScheduleModel: createAction(
    `${prefix}setConfirmRejectScheduleModel`
  ),
  setScheduleConfirmModel: createAction(`${prefix}setScheduleConfirmModel`),
  checkApproverToken: createAction(`${prefix}checkApproverToken`),
};

/* ------------- INITIAL STATE ------------- */
export const SCHEDULAR_INITIAL_STATE = {
  data: {},
  createdScheduleData: {},
  isScheduleModel: false,
  isRejectScheduleModel: false,
  isEditScheduleModel: false,
  isRejectConfirmScheduleModel: false,
  isScheduleConfirmModel: false,
  isCheckApproverToken: {},
};

/* ------------- SELECTORS ------------------ */
export const SchedularSelectors = {
  createScheduleDeployment: state => state.schedular.schedularDeployment,
  fetchNamespaces: state => state.schedular.clusterNamespaces?.data,
  editScheduleDeployment: state => state.schedular.editSchedularDeployment,
  getScheduleModal: state => state.schedular.isScheduleModel,
  getRejectScheduleModel: state => state.schedular.isRejectScheduleModel,
  getEditScheduleModel: state => state.schedular.isEditScheduleModel,
  getRejectConfirmScheduleModel: state =>
    state.schedular.isRejectConfirmScheduleModel,
  getScheduleCofirmModel: state => state.schedular.isScheduleConfirmModel,
  checkApproverToken: state => state.schedular.isCheckApproverToken,
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

const setScheduleModal = state => {
  return {
    ...state,
    isScheduleModel: !state.isScheduleModel,
  };
};
const setRejectScheduleModal = state => {
  return {
    ...state,
    isRejectScheduleModel: !state.isRejectScheduleModel,
  };
};
const setEditScheduleModel = state => {
  return {
    ...state,
    isEditScheduleModel: !state.isEditScheduleModel,
  };
};
const setConfirmRejectScheduleModel = state => {
  return {
    ...state,
    isRejectConfirmScheduleModel: !state.isRejectConfirmScheduleModel,
  };
};
const setScheduleConfirmModel = state => {
  return {
    ...state,
    isScheduleConfirmModel: !state.isScheduleConfirmModel,
  };
};
const checkApproverToken = (state, { payload }) => {
  return {
    ...state,
    isCheckApproverToken: payload,
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
      .addCase(SchedularActions.editScheduleDeployment, editScheduleDeployment)
      .addCase(SchedularActions.setScheduleModal, setScheduleModal)
      .addCase(SchedularActions.setRejectScheduleModal, setRejectScheduleModal)
      .addCase(SchedularActions.setEditScheduleModel, setEditScheduleModel)
      .addCase(
        SchedularActions.setConfirmRejectScheduleModel,
        setConfirmRejectScheduleModel
      )
      .addCase(
        SchedularActions.setScheduleConfirmModel,
        setScheduleConfirmModel
      )
      .addCase(SchedularActions.checkApproverToken, checkApproverToken);
  }
);
