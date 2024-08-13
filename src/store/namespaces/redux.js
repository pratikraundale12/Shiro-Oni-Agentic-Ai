import { createReducer, createAction } from '@reduxjs/toolkit';

const prefix = '@@KDFM-NAMESPACES/';

/* ------------- ACTIONS ------------------ */
export const NamespacesActions = {
  setSelectedCluster: createAction(`${prefix}setSelectedCluster`),
  setSelectedNamespace: createAction(`${prefix}setSelectedNamespace`),
  fetchNamespaces: createAction(`${prefix}fetchNamespaces`),
  fetchNamespacesSuccess: createAction(`${prefix}fetchNamespacesSuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const NAMESPACES_INITIAL_STATE = {
  selectedCluster: null,
  selectedNamespace: null,
  clusterNamespaces: {
    count: 0,
    breadcrumb: [],
    data: [],
  },
  selectedDestCluster: null,
  selectedDestNamespace: null,
  destClusterNamespaces: {
    count: 0,
    breadcrumb: [],
    data: [],
  },
};

/* ------------- SELECTORS ------------------ */
export const NamespacesSelectors = {
  getSelectedCluster: state => state.namespaces.selectedCluster,
  getSelectedNamespace: state => state.namespaces.selectedNamespace,
  getNamespaces: state => state.namespaces.clusterNamespaces.data,
};

/* ------------- REDUCERS ------------------- */
const setSelectedCluster = (state, { payload }) => {
  return {
    ...state,
    selectedCluster: payload,
  };
};
const setSelectedNamespace = (state, { payload }) => {
  return {
    ...state,
    selectedNamespace: payload,
  };
};
const fetchNamespacesSuccess = (state, { payload }) => {
  return {
    ...state,
    clusterNamespaces: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const namespacesReducer = createReducer(
  NAMESPACES_INITIAL_STATE,
  builder => {
    builder
      .addCase(NamespacesActions.setSelectedCluster, setSelectedCluster)
      .addCase(NamespacesActions.setSelectedNamespace, setSelectedNamespace)
      .addCase(
        NamespacesActions.fetchNamespacesSuccess,
        fetchNamespacesSuccess
      );
  }
);
