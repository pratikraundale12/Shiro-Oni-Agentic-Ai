import { createAction, createReducer } from '@reduxjs/toolkit';

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
  setIsSanityCheckScheduleModalOpen: createAction(
    `${prefix}setIsSanityCheckScheduleModalOpen`
  ),
  setIsSuccessSanityCheckModalOpen: createAction(
    `${prefix}setIsSuccessSanityCheckModalOpen`
  ),
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
  setIsUserStoryModalOpen: createAction(`${prefix}setIsUserStoryModalOpen`),
  setIsGroupListModalOpen: createAction(`${prefix}setIsGroupListModalOpen`),
  fetchGroupUserData: createAction(`${prefix}fetchGroupUserData`),
  setListGroupMembers: createAction(`${prefix}setListGroupMembers`),
  fetchScheduleDeploymentDetails: createAction(
    `${prefix}fetchScheduleDeploymentDetails`
  ),
  setScheduleDeploymentDetails: createAction(
    `${prefix}setScheduleDeploymentDetails`
  ),
  scheduleSanityAndDeploy: createAction(`${prefix}scheduleSanityAndDeploy`),
  setSanityAndDeployStatus: createAction(`${prefix}setSanityAndDeployStatus`),
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
  isSanityCheckScheduleModalOpen: false,
  isSuccessSanityCheckModalOpen: false,
  scheduleFromList: false,
  scheduleSelectRange: [],
  isDiffModalOpen: false,
  diffAllData: {},
  statusFilterData: null,
  searchText: null,
  selectedClusterState: null,
  selectedStatusState: null,
  isUserStoryModalOpen: false,
  isGroupListModalOpen: false,
  listGroupMembers: [],
  scheduleDeploymentDetails: null,
  sanityAndDeployStatus: null,
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
  getIsSanityCheckModalOpen: state =>
    state.schedular.isSanityCheckScheduleModalOpen,
  getIsSuccessSanityCheckModalOpen: state =>
    state.schedular.isSuccessSanityCheckModalOpen,
  getScheduleFromList: state => state.schedular.scheduleFromList,
  getScheduleSelectRange: state => state.schedular.scheduleSelectRange,
  getIsDiffModalOpen: state => state.schedular.isDiffModalOpen,
  getDiffAllData: state => state.schedular.diffAllData,
  getStatusFilterData: state => state.schedular.statusFilterData,
  getSearchText: state => state.schedular.searchText,
  getSelectedClusterState: state => state.schedular.selectedClusterState,
  getSelectedStatusState: state => state.schedular.selectedStatusState,
  getIsUserStoryModalOpen: state => state.schedular.isUserStoryModalOpen,
  getisGroupListModalOpen: state => state.schedular.isGroupListModalOpen,
  getListGroupMembers: state => state.schedular.listGroupMembers,
  getScheduleDeploymentDetails: state =>
    state.schedular.scheduleDeploymentDetails,
  getSanityAndDeployStatus: state => state.schedular.sanityAndDeployStatus,
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
const setIsUserStoryModalOpen = (state, { payload }) => {
  return {
    ...state,
    isUserStoryModalOpen: payload,
  };
};
const setIsGroupListModalOpen = (state, { payload }) => {
  return {
    ...state,
    isGroupListModalOpen: payload,
  };
};
const setListGroupMembers = (state, { payload }) => {
  return {
    ...state,
    listGroupMembers: payload,
  };
};

const setScheduleDeploymentDetails = (state, { payload }) => {
  return {
    ...state,
    scheduleDeploymentDetails: payload,
  };
};

const setIsSanityCheckScheduleModalOpen = (state, { payload }) => {
  return {
    ...state,
    isSanityCheckScheduleModalOpen: payload,
  };
};

const setIsSuccessSanityCheckModalOpen = (state, { payload }) => {
  return {
    ...state,
    isSuccessSanityCheckModalOpen: payload,
  };
};

const setSanityAndDeployStatus = (state, { payload }) => {
  return {
    ...state,
    sanityAndDeployStatus: payload,
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
      .addCase(
        SchedularActions.setIsSanityCheckScheduleModalOpen,
        setIsSanityCheckScheduleModalOpen
      )
      .addCase(
        SchedularActions.setIsSuccessSanityCheckModalOpen,
        setIsSuccessSanityCheckModalOpen
      )
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
      .addCase(SchedularActions.setSelectedStatusState, setSelectedStatusState)
      .addCase(
        SchedularActions.setIsUserStoryModalOpen,
        setIsUserStoryModalOpen
      )
      .addCase(
        SchedularActions.setIsGroupListModalOpen,
        setIsGroupListModalOpen
      )
      .addCase(SchedularActions.setListGroupMembers, setListGroupMembers)
      .addCase(
        SchedularActions.setScheduleDeploymentDetails,
        setScheduleDeploymentDetails
      )
      .addCase(
        SchedularActions.setSanityAndDeployStatus,
        setSanityAndDeployStatus
      );
  }
);
