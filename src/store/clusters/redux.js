import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-CLUSTERS/';

/* ------------- ACTIONS ------------------ */
export const ClustersActions = {
  fetchClusterList: createAction(`${prefix}fetchClusterList`),
  fetchClusterListSuccess: createAction(`${prefix}fetchClusterListSuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const CLUSTERS_INITIAL_STATE = {
  list: [],
};

/* ------------- SELECTORS ------------------ */
export const ClustersSelectors = {
  getClusters: state => state.clusters.list,
};

/* ------------- REDUCERS ------------------- */
const fetchClusterListSuccess = (state, { payload }) => {
  const list = payload?.map(item => ({ label: item.name, value: item.id }));
  return {
    ...state,
    list,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const clustersReducer = createReducer(
  CLUSTERS_INITIAL_STATE,
  builder => {
    builder.addCase(
      ClustersActions.fetchClusterListSuccess,
      fetchClusterListSuccess
    );
  }
);
