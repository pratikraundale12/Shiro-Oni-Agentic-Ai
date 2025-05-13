import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-CLUSTERS/';

/* ------------- ACTIONS ------------------ */
export const ClustersActions = {
  fetchClusterList: createAction(`${prefix}fetchClusterList`),
  fetchClusterListSuccess: createAction(`${prefix}fetchClusterListSuccess`),
  fetchClusterNodes: createAction(`${prefix}fetchClusterNodes`),
  fetchClusterNodesSuccess: createAction(`${prefix}fetchClusterNodesSuccess`),
  updateClusterSuccessModal: createAction(`${prefix}updateClusterSuccessModal`),
  fetchClusters: createAction(`${prefix}fetchClusters`),
  fetchClustersSuccess: createAction(`${prefix}fetchClustersSuccess`),
  addEditClusterData: createAction(`${prefix}addEditClusterData`),
  setClusterFormData: createAction(`${prefix}setClusterFormData`),
  getClusterToken: createAction(`${prefix}getClusterToken`),
  setIsclusterHardDeleteModalOpen: createAction(
    `${prefix}setIsclusterHardDeleteModalOpen`
  ),
  clusterLogout: createAction(`${prefix}clusterLogout`),
  // — Service-Account Credentials Check —
  checkServiceAccountCredentialsRequest: createAction(
    `${prefix}checkServiceAccountCredentialsRequest`
  ),
  checkServiceAccountCredentialsSuccess: createAction(
    `${prefix}checkServiceAccountCredentialsSuccess`
  ),
  checkServiceAccountCredentialsFailure: createAction(
    `${prefix}checkServiceAccountCredentialsFailure`
  ),

  // — Add Service-Account Host —
  addServiceAccountHostRequest: createAction(
    `${prefix}addServiceAccountHostRequest`
  ),
  addServiceAccountHostSuccess: createAction(
    `${prefix}addServiceAccountHostSuccess`
  ),
  addServiceAccountHostFailure: createAction(
    `${prefix}addServiceAccountHostFailure`
  ),

  // — Update Service-Account Host —
  updateServiceAccountHostRequest: createAction(
    `${prefix}updateServiceAccountHostRequest`
  ),
  updateServiceAccountHostSuccess: createAction(
    `${prefix}updateServiceAccountHostSuccess`
  ),
  updateServiceAccountHostFailure: createAction(
    `${prefix}updateServiceAccountHostFailure`
  ),
  setTestCredsButtonVisible: createAction(`${prefix}setTestCredsButtonVisible`),
};

/* ------------- INITIAL STATE ------------- */
export const CLUSTERS_INITIAL_STATE = {
  list: [],
  nodes: [],
  clusterSuccessModal: false,
  clusterList: [],
  addEditClusterData: {},
  clusterFormDataResponse: {},
  isclusterHardDeleteModalOpen: false,
  // Service-account credential check
  checkingServiceAccount: false,
  checkServiceAccountError: null,

  // Add-host
  addingServiceAccountHost: false,
  addServiceAccountHostError: null,

  // Update-host
  updatingServiceAccountHost: false,
  updateServiceAccountHostError: null,
  isTestCredsButtonVisible: true,
};

/* ------------- SELECTORS ------------------ */
export const ClustersSelectors = {
  getClusters: state => state.clusters.list,
  getClusterNodes: state => state.clusters.nodes,
  getClusterSuccessModal: state => state.clusters.clusterSuccessModal,
  getAllClustersList: state => state.clusters.clusterList,
  getAddEditClusterData: state => state.clusters.addEditClusterData,
  getClusterFormData: state => state.clusters.clusterFormDataResponse,
  getIsclusterHardDeleteModalOpen: state =>
    state.clusters.isclusterHardDeleteModalOpen,
  // service-account credential check
  isCheckingServiceAccount: state => state.clusters.checkingServiceAccount,
  getServiceAccountCheckError: state => state.clusters.checkServiceAccountError,

  // add-host
  isAddingServiceAccountHost: state => state.clusters.addingServiceAccountHost,
  getAddServiceAccountHostError: state =>
    state.clusters.addServiceAccountHostError,

  // update-host
  isUpdatingServiceAccountHost: state =>
    state.clusters.updatingServiceAccountHost,
  getUpdateServiceAccountHostError: state =>
    state.clusters.updateServiceAccountHostError,
  isTestCredsButtonVisible: state => state.clusters.isTestCredsButtonVisible,
};

/* ------------- REDUCERS ------------------- */
const fetchClusterListSuccess = (state, { payload }) => {
  const list = payload?.map(item => ({
    label: item.name,
    value: item.id,
    status: item.status,
  }));
  return {
    ...state,
    list,
  };
};
const fetchClustersSuccess = (state, { payload }) => {
  const list = payload?.data?.map(item => ({
    ...item,
    label: item.name,
    value: item.id,
  }));
  return {
    ...state,
    clusterList: list,
  };
};
const fetchClusterNodesSuccess = (state, { payload }) => {
  return {
    ...state,
    nodes: payload,
  };
};

const updateClusterSuccessModal = (state, { payload }) => {
  return {
    ...state,
    clusterSuccessModal: payload,
  };
};

const addEditClusterData = (state, { payload }) => {
  return {
    ...state,
    addEditClusterData: payload,
  };
};
const setClusterFormData = (state, { payload }) => {
  return {
    ...state,
    clusterFormDataResponse: payload,
  };
};

const setIsclusterHardDeleteModalOpen = (state, { payload }) => {
  return {
    ...state,
    isclusterHardDeleteModalOpen: payload,
  };
};
const checkServiceAccountCredentialsRequest = state => {
  return {
    ...state,
    checkingServiceAccount: true,
    checkServiceAccountError: null,
  };
};

const checkServiceAccountCredentialsSuccess = state => {
  return {
    ...state,
    checkingServiceAccount: false,
  };
};

const checkServiceAccountCredentialsFailure = (state, { payload }) => {
  return {
    ...state,
    checkingServiceAccount: false,
    checkServiceAccountError: payload,
  };
};

const addServiceAccountHostRequest = state => {
  return {
    ...state,
    addingServiceAccountHost: true,
    addServiceAccountHostError: null,
  };
};

const addServiceAccountHostSuccess = state => {
  return {
    ...state,
    addingServiceAccountHost: false,
  };
};

const addServiceAccountHostFailure = (state, { payload }) => {
  return {
    ...state,
    addingServiceAccountHost: false,
    addServiceAccountHostError: payload,
  };
};

const updateServiceAccountHostRequest = state => {
  return {
    ...state,
    updatingServiceAccountHost: true,
    updateServiceAccountHostError: null,
  };
};

const updateServiceAccountHostSuccess = state => {
  return {
    ...state,
    updatingServiceAccountHost: false,
  };
};

const updateServiceAccountHostFailure = (state, { payload }) => {
  return {
    ...state,
    updatingServiceAccountHost: false,
    updateServiceAccountHostError: payload,
  };
};

const setTestCredsButtonVisible = (state, { payload }) => ({
  ...state,
  isTestCredsButtonVisible: payload, // true or false
});

/* ------------- Hookup Reducers To Types ------------- */
export const clustersReducer = createReducer(
  CLUSTERS_INITIAL_STATE,
  builder => {
    builder
      .addCase(ClustersActions.fetchClusterListSuccess, fetchClusterListSuccess)
      .addCase(
        ClustersActions.fetchClusterNodesSuccess,
        fetchClusterNodesSuccess
      )
      .addCase(
        ClustersActions.updateClusterSuccessModal,
        updateClusterSuccessModal
      )
      .addCase(ClustersActions.fetchClustersSuccess, fetchClustersSuccess)
      .addCase(ClustersActions.addEditClusterData, addEditClusterData)
      .addCase(ClustersActions.setClusterFormData, setClusterFormData)
      .addCase(
        ClustersActions.setIsclusterHardDeleteModalOpen,
        setIsclusterHardDeleteModalOpen
      ) // Check service-account credentials
      .addCase(
        ClustersActions.checkServiceAccountCredentialsRequest,
        checkServiceAccountCredentialsRequest
      )
      .addCase(
        ClustersActions.checkServiceAccountCredentialsSuccess,
        checkServiceAccountCredentialsSuccess
      )
      .addCase(
        ClustersActions.checkServiceAccountCredentialsFailure,
        checkServiceAccountCredentialsFailure
      )

      // Add service-account host
      .addCase(
        ClustersActions.addServiceAccountHostRequest,
        addServiceAccountHostRequest
      )
      .addCase(
        ClustersActions.addServiceAccountHostSuccess,
        addServiceAccountHostSuccess
      )
      .addCase(
        ClustersActions.addServiceAccountHostFailure,
        addServiceAccountHostFailure
      )

      // Update service-account host
      .addCase(
        ClustersActions.updateServiceAccountHostRequest,
        updateServiceAccountHostRequest
      )
      .addCase(
        ClustersActions.updateServiceAccountHostSuccess,
        updateServiceAccountHostSuccess
      )
      .addCase(
        ClustersActions.updateServiceAccountHostFailure,
        updateServiceAccountHostFailure
      )
      .addCase(
        ClustersActions.setTestCredsButtonVisible,
        setTestCredsButtonVisible
      );
  }
);
