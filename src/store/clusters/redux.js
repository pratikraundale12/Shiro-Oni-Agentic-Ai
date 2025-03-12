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
  setIsAddorEditClusterModalOpen: createAction(
    `${prefix}setIsAddorEditClusterModalOpen`
  ),
  setIsAddHostIPModalOpen: createAction(`${prefix}setIsAddHostIPModalOpen`),
  getNiFiVersions: createAction(`${prefix}getNiFiVersions`),
  setNifiVersions: createAction(`${prefix}setNifiVersions`),
  checkCredentialsClusterSetup: createAction(
    `${prefix}checkCredentialsClusterSetup`
  ),
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
  isAddorEditClusterModalOpen: false,
  isAddHostIPModalOpen: false,
  nifiVersions: [],
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
  getIsAddorEditClusterModalOpen: state =>
    state.clusters.isAddorEditClusterModalOpen,
  getIsAddHostIPModalOpen: state => state.clusters.isAddHostIPModalOpen,
  getNifiVersions: state => state.clusters.nifiVersions,
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
const setIsAddorEditClusterModalOpen = (state, { payload }) => {
  return {
    ...state,
    isAddorEditClusterModalOpen: payload,
  };
};
const setIsAddHostIPModalOpen = (state, { payload }) => {
  return {
    ...state,
    isAddHostIPModalOpen: payload,
  };
};
const setNifiVersions = (state, { payload }) => {
  return {
    ...state,
    nifiVersions: payload,
  };
};

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
      )
      .addCase(
        ClustersActions.setIsAddorEditClusterModalOpen,
        setIsAddorEditClusterModalOpen
      )
      .addCase(ClustersActions.setIsAddHostIPModalOpen, setIsAddHostIPModalOpen)
      .addCase(ClustersActions.setNifiVersions, setNifiVersions);
  }
);
