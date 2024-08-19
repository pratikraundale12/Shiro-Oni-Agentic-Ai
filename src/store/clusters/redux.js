import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-CLUSTERS/';

/* ------------- ACTIONS ------------------ */
export const ClustersActions = {
  fetchClusterList: createAction(`${prefix}fetchClusterList`),
  fetchClusterListSuccess: createAction(`${prefix}fetchClusterListSuccess`),
  fetchClusterNodes: createAction(`${prefix}fetchClusterNodes`),
  fetchClusterNodesSuccess: createAction(`${prefix}fetchClusterNodesSuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const CLUSTERS_INITIAL_STATE = {
  list: [],
  nodes: [],
};

/* ------------- SELECTORS ------------------ */
export const ClustersSelectors = {
  getClusters: state => state.clusters.list,
  getClusterNodes: state => state.clusters.nodes,
};

/* ------------- REDUCERS ------------------- */
const fetchClusterListSuccess = (state, { payload }) => {
  const list = payload?.map(item => ({ label: item.name, value: item.id }));
  return {
    ...state,
    list,
  };
};
const fetchClusterNodesSuccess = (state, { payload }) => {
  return {
    ...state,
    nodes: payload,
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
      );
  }
);
