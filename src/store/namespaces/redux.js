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
  addVariableServices: createAction(`${prefix}addVariableServices`),
  getStatusAndDeleteVariables: createAction(
    `${prefix}getStatusAndDeleteVariables`
  ),
  fetchNamespaceAudit: createAction(`${prefix}fetchNamespaceAudit`),
  fetchNamespaceAuditSuccess: createAction(
    `${prefix}fetchNamespaceAuditSuccess`
  ),

  setVariableContextItem: createAction(`${prefix}setVariableContextItem`),
  setNewlyAddVariables: createAction(`${prefix}setNewlyAddVariables`),
  setParameterContextItem: createAction(`${prefix}setParameterContextItem`),
  setNewlyAddedParameterContext: createAction(
    `${prefix}setNewlyAddedParameterContext`
  ),
  setParentParameterList: createAction(`${prefix}setParentParameterList`),
  setParameterEditParent: createAction(`${prefix}setParameterEditParent`),
  setSourceNamespaceId: createAction(`${prefix}setSourceNamespaceId`),
  singleNamespaceData: createAction(`${prefix}singleNamespaceData`),
  singleNamespaceDataSuccess: createAction(
    `${prefix}singleNamespaceDataSuccess`
  ),
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
  namespaceAudit: {
    count: 0,
    breadcrumb: [],
    data: [],
  },
  variableContextItem: {},
  newlyAddVariables: [],
  parameterContextItem: {},
  newlyAddedParameterContext: [],
  parentParameterList: [],
  parameterEditParent: {
    parent: false,
    id: '',
  },
  sourceNamespaceId: '',
  singleNamespaceData: {},
  // parameterEditParent: false,
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
  getNamespaceAudit: state => state.namespaces.namespaceAudit,
  getVariableContextItem: state => state.namespaces.variableContextItem,
  getNewlyAddVariables: state => state.namespaces.newlyAddVariables,
  getParameterContextItem: state => state.namespaces.parameterContextItem,
  getNewlyAddedParameterContext: state =>
    state.namespaces.newlyAddedParameterContext,
  getParentListItems: state => state.namespaces.parentParameterList,
  getParameterEditParent: state => state.namespaces.parameterEditParent,
  getSelectedSourceNamespace: state => state.namespaces.sourceNamespaceId,
  getSingleNamespaceData: state => state.namespaces.singleNamespaceData,
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
  if (!payload) return state;

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
      version: payload.version,
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

const fetchNamespaceAuditSuccess = (state, { payload }) => {
  return {
    ...state,
    namespaceAudit: payload,
  };
};

const setVariableContextItem = (state, { payload }) => {
  return {
    ...state,
    variableContextItem: payload,
  };
};
const setParameterContextItem = (state, { payload }) => {
  return {
    ...state,
    parameterContextItem: payload,
  };
};
const setNewlyAddedParameterContext = (state, { payload }) => {
  return {
    ...state,
    newlyAddedParameterContext: payload,
  };
};

const setNewlyAddVariables = (state, { payload }) => {
  return {
    ...state,
    newlyAddVariables: payload,
  };
};

const setParentParameterList = (state, { payload }) => {
  return {
    ...state,
    parentParameterList: [...state.parentParameterList, ...payload],
  };
};

const setParameterEditParent = (state, { payload }) => {
  return {
    ...state,
    parameterEditParent: {
      parent: payload.parent,
      id: payload.id,
    },
  };
};
const setSourceNamespaceId = (state, { payload }) => {
  return {
    ...state,
    sourceNamespaceId: payload,
  };
};

const singleNamespaceDataSuccess = (state, { payload }) => {
  return {
    ...state,
    // deployOrUpgradeDetails: {
    //   ...state.deployOrUpgradeDetails,
    //   ...payload,
    // },
    singleNamespaceData: payload,
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
      )
      .addCase(
        NamespacesActions.fetchNamespaceAuditSuccess,
        fetchNamespaceAuditSuccess
      )
      .addCase(NamespacesActions.setVariableContextItem, setVariableContextItem)
      .addCase(NamespacesActions.setNewlyAddVariables, setNewlyAddVariables)
      .addCase(
        NamespacesActions.setParameterContextItem,
        setParameterContextItem
      )
      .addCase(
        NamespacesActions.setNewlyAddedParameterContext,
        setNewlyAddedParameterContext
      )
      .addCase(NamespacesActions.setParentParameterList, setParentParameterList)
      .addCase(NamespacesActions.setParameterEditParent, setParameterEditParent)
      .addCase(NamespacesActions.setSourceNamespaceId, setSourceNamespaceId)
      .addCase(
        NamespacesActions.singleNamespaceDataSuccess,
        singleNamespaceDataSuccess
      );
  }
);
