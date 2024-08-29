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
};

/* ------------- INITIAL STATE ------------- */
export const CLUSTERS_INITIAL_STATE = {
  list: [],
  nodes: [],
  clusterSuccessModal: false,
  clusterList: [],
};

/* ------------- SELECTORS ------------------ */
export const ClustersSelectors = {
  getClusters: state => state.clusters.list,
  getClusterNodes: state => state.clusters.nodes,
  getClusterSuccessModal: state => state.clusters.clusterSuccessModal,
  getAllClustersList: state => state.clusters.clusterList,
};

/* ------------- REDUCERS ------------------- */
const fetchClusterListSuccess = (state, { payload }) => {
  const list = payload?.map(item => ({ label: item.name, value: item.id }));
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
      .addCase(ClustersActions.fetchClustersSuccess, fetchClustersSuccess);
  }
);
