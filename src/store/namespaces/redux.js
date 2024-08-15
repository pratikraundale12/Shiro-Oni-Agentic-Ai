import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-NAMESPACES/';

/* ------------- ACTIONS ------------------ */
export const NamespacesActions = {
  setSelectedCluster: createAction(`${prefix}setSelectedCluster`),
  setSelectedNamespace: createAction(`${prefix}setSelectedNamespace`),
  setFlowPath: createAction(`${prefix}setFlowPath`),
  fetchNamespaces: createAction(`${prefix}fetchNamespaces`),
  fetchNamespacesSuccess: createAction(`${prefix}fetchNamespacesSuccess`),
  setSelectedDestCluster: createAction(`${prefix}setSelectedDestCluster`),
  setSelectedDestNamespace: createAction(`${prefix}setSelectedDestNamespace`),
  fetchDestNamespaces: createAction(`${prefix}fetchDestNamespaces`),
  fetchDestNamespacesSuccess: createAction(
    `${prefix}fetchDestNamespacesSuccess`
  ),
  setDeployedModal: createAction(`${prefix}setDeployedModal`),
  checkDestCluster: createAction(`${prefix}checkDestCluster`),
  checkDestClusterSuccess: createAction(`${prefix}checkDestClusterSuccess`),
  setNamespaceId: createAction(`${prefix}setNamespaceId`),
  setVersion: createAction(`${prefix}setVersion`),
  setPosition: createAction(`${prefix}setPosition`),
  deployCluster: createAction(`${prefix}deployCluster`),
  deployClusterSuccess: createAction(`${prefix}deployClusterSuccess`),
  upgradeCluster: createAction(`${prefix}upgradeCluster`),
  clusterProgress: createAction(`${prefix}clusterProgress`),
  clusterProgressDelete: createAction(`${prefix}clusterProgressDelete`),
  getCountDetails: createAction(`${prefix}getCountDetails`),
  fetchParameterContext: createAction(`${prefix}fetchParameterContext`),
  setParameterDetails: createAction(`${prefix}setParameterDetails`),
  updateParameterContext: createAction(`${prefix}updateParameterContext`),
  getStatusAndDeleteParameterContext: createAction(
    `${prefix}getStatusAndDeleteParameterContext`
  ),
  resetDeployData: createAction(`${prefix}resetDeployData`),
  updateNamespaceStatus: createAction(`${prefix}updateNamespaceStatus`),
  fetchVariableList: createAction(`${prefix}fetchVariableList`),
  fetchVariableListSuccess: createAction(`${prefix}fetchVariableListSuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const NAMESPACES_INITIAL_STATE = {
  selectedCluster: null,
  selectedNamespace: null,
  flowPath: [],
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
  checkDestCluster: {},
  formData: {
    namespaceId: '',
    version: '',
    position: {
      x: 0,
      y: 0,
    },
  },
  deployOrUpgradeDetails: {},
  parameterDetails: {},
  isDeployedModal: false,
  variableList: [],
};

/* ------------- SELECTORS ------------------ */
export const NamespacesSelectors = {
  getSelectedCluster: state => state.namespaces.selectedCluster,
  getSelectedNamespace: state => state.namespaces.selectedNamespace,
  getNamespaces: state => state.namespaces.clusterNamespaces.data,
  getSelectedDestCluster: state => state.namespaces.selectedDestCluster,
  getSelectedDestNamespace: state => state.namespaces.selectedDestNamespace,
  getDestNamespaces: state => state.namespaces.destClusterNamespaces.data,
  getFlowPath: state => state.namespaces.flowPath,
  getCheckDestCluster: state => state.namespaces.checkDestCluster,
  getFormData: state => state.namespaces.formData,
  getDeployOrUpgradeDetails: state => state.namespaces.deployOrUpgradeDetails,
  getParameterDetails: state => state.namespaces.parameterDetails,
  getDeployedModal: state => state.namespaces.isDeployedModal,
  getVariableList: state => state.namespaces.variableList,
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
const setFlowPath = (state, { payload }) => {
  return {
    ...state,
    flowPath: [...state.flowPath, payload],
  };
};
const fetchNamespacesSuccess = (state, { payload }) => {
  return {
    ...state,
    clusterNamespaces: payload,
  };
};
const setSelectedDestCluster = (state, { payload }) => {
  return {
    ...state,
    selectedDestCluster: payload,
  };
};
const setSelectedDestNamespace = (state, { payload }) => {
  return {
    ...state,
    selectedDestNamespace: payload,
  };
};
const fetchDestNamespacesSuccess = (state, { payload }) => {
  return {
    ...state,
    destClusterNamespaces: payload,
  };
};
const checkDestClusterSuccess = (state, { payload }) => {
  return {
    ...state,
    checkDestCluster: payload,
    formData: {
      ...state.formData,
      position: payload.position,
    },
  };
};

const fetchVariableListSuccess = (state, { payload }) => {
  return {
    ...state,
    variableList: payload,
  };
};

const setNamespaceId = (state, { payload }) => {
  return {
    ...state,
    formData: {
      ...state.formData,
      namespaceId: payload,
    },
  };
};
const setVersion = (state, { payload }) => {
  return {
    ...state,
    formData: {
      ...state.formData,
      version: payload,
    },
  };
};
const setPosition = (state, { payload }) => {
  return {
    ...state,
    formData: {
      ...state.formData,
      position: {
        ...state.formData.position,
        ...payload,
      },
    },
  };
};
const setParameterDetails = (state, { payload }) => {
  return {
    ...state,
    parameterDetails: payload,
  };
};

const deployClusterSuccess = (state, { payload }) => {
  return {
    ...state,
    deployOrUpgradeDetails: {
      ...state.deployOrUpgradeDetails,
      ...payload,
    },
  };
};

const setDeployedModal = state => {
  return {
    ...state,
    isDeployedModal: !state.isDeployedModal,
  };
};
const resetDeployData = state => {
  return {
    ...NAMESPACES_INITIAL_STATE,
    selectedCluster: state.selectedCluster,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const namespacesReducer = createReducer(
  NAMESPACES_INITIAL_STATE,
  builder => {
    builder
      .addCase(NamespacesActions.setSelectedCluster, setSelectedCluster)
      .addCase(NamespacesActions.setSelectedNamespace, setSelectedNamespace)
      .addCase(NamespacesActions.setFlowPath, setFlowPath)
      .addCase(NamespacesActions.fetchNamespacesSuccess, fetchNamespacesSuccess)
      .addCase(NamespacesActions.setSelectedDestCluster, setSelectedDestCluster)
      .addCase(
        NamespacesActions.setSelectedDestNamespace,
        setSelectedDestNamespace
      )
      .addCase(
        NamespacesActions.fetchDestNamespacesSuccess,
        fetchDestNamespacesSuccess
      )
      .addCase(
        NamespacesActions.checkDestClusterSuccess,
        checkDestClusterSuccess
      )
      .addCase(NamespacesActions.setNamespaceId, setNamespaceId)
      .addCase(NamespacesActions.setPosition, setPosition)
      .addCase(NamespacesActions.setVersion, setVersion)
      .addCase(NamespacesActions.deployClusterSuccess, deployClusterSuccess)
      .addCase(NamespacesActions.setParameterDetails, setParameterDetails)
      .addCase(NamespacesActions.setDeployedModal, setDeployedModal)
      .addCase(NamespacesActions.resetDeployData, resetDeployData)
      .addCase(
        NamespacesActions.fetchVariableListSuccess,
        fetchVariableListSuccess
      );
  }
);
