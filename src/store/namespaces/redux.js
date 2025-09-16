import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-NAMESPACES/';

/* ------------- ACTIONS ------------------ */
export const NamespacesActions = {
  setSelectedCluster: createAction(`${prefix}setSelectedCluster`),
  setDeployByRegistryFlow: createAction(`${prefix}setDeployByRegistryFlow`),
  setSelectedNamespace: createAction(`${prefix}setSelectedNamespace`),
  setFlowPath: createAction(`${prefix}setFlowPath`),
  fetchNamespaces: createAction(`${prefix}fetchNamespaces`),
  fetchNamespacesSuccess: createAction(`${prefix}fetchNamespacesSuccess`),
  fetchLocalChanges: createAction(`${prefix}fetchLocalChanges`),
  fetchLocalChangesSuccess: createAction(`${prefix}fetchLocalChangesSuccess`),
  deleteNamespace: createAction(`${prefix}deleteNamespace`),
  deleteNamespaceSuccess: createAction(`${prefix}deleteNamespaceSuccess`),
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
  getControllerServiceList: createAction(`${prefix}getControllerServiceList`),
  getRootControllerServiceNamespace: createAction(
    `${prefix}getRootControllerServiceNamespace`
  ),
  setIsAddControllerServiceModal: createAction(
    `${prefix}setIsAddControllerServiceModal`
  ),
  getAllControllerServiceListToAdd: createAction(
    `${prefix}getAllControllerServiceListToAdd`
  ),
  setAddControllerServiceList: createAction(
    `${prefix}setAddControllerServiceList`
  ),
  addControllerServiceRootLevel: createAction(
    `${prefix}addControllerServiceRootLevel`
  ),
  setIsControllerServicePropertyModel: createAction(
    `${prefix}setIsControllerServicePropertyModel`
  ),
  addPropertyControllerService: createAction(
    `${prefix}addPropertyControllerService`
  ),
  setIsAddPropertyDropdownModalOpen: createAction(
    `${prefix}setIsAddPropertyDropdownModalOpen`
  ),
  getNewPropertyControllerService: createAction(
    `${prefix}getNewPropertyControllerService`
  ),
  getNewPropertyControllerServiceUpdated: createAction(
    `${prefix}getNewPropertyControllerServiceUpdated`
  ),
  setNewProperToAddControllerService: createAction(
    `${prefix}setNewProperToAddControllerService`
  ),
  setPropertyOptionOnDeploy: createAction(`${prefix}setPropertyOptionOnDeploy`),
  addControllerServicePropertyByDropdown: createAction(
    `${prefix}addControllerServicePropertyByDropdown`
  ),
  setResponseNewAddedProprty: createAction(
    `${prefix}setResponseNewAddedProprty`
  ),
  setIsConfigurePropertyControllerServiceModalOpen: createAction(
    `${prefix}setIsConfigurePropertyControllerServiceModalOpen`
  ),
  changeStatusControllerService: createAction(
    `${prefix}changeStatusControllerService`
  ),
  deleteControllerService: createAction(`${prefix}deleteControllerService`),
  setScheduleNamespaceParameterContext: createAction(
    `${prefix}setScheduleNamespaceParameterContext`
  ),
  setScheduleNamespaceVariable: createAction(
    `${prefix}setScheduleNamespaceVariable`
  ),
  setNamespaceSummaryLoadingState: createAction(
    `${prefix}setNamespaceSummaryLoadingState`
  ),
  setParameterContextListAtDeploy: createAction(
    `${prefix}setParameterContextListAtDeploy`
  ),
  fetchNamespacesForDestiationCluster: createAction(
    `${prefix}fetchNamespacesForDestiationCluster`
  ),
  setChildLevelDeployProcessorData: createAction(
    `${prefix}setChildLevelDeployProcessorData`
  ),
  setVariableListLoading: createAction(`${prefix}setVariableListLoading`),
  setIsNewAddControllerServiceModal: createAction(
    `${prefix}setIsNewAddControllerServiceModal`
  ),
  fetchRegistryData: createAction(`${prefix}fetchRegistryData`),
  setBucketListDropDownData: createAction(`${prefix}setBucketListDropDownData`),
  fetchFlowNameList: createAction(`${prefix}fetchFlowNameList`),
  setFlowListRegistry: createAction(`${prefix}setFlowListRegistry`),
  fetchVersionData: createAction(`${prefix}fetchVersionData`),
  setVersionListData: createAction(`${prefix}setVersionListData`),
  setVersionSelect: createAction(`${prefix}setVersionSelect`),
  setDeployFormData: createAction(`${prefix}setDeployFormData`),
  fetchRegistryFlowDetails: createAction(`${prefix}fetchRegistryFlowDetails`),
  setRegistryAllDetails: createAction(`${prefix}setRegistryAllDetails`),
  setRegistryFlowXCord: createAction(`${prefix}setRegistryFlowXCord`),
  setRegistryFlowYCord: createAction(`${prefix}setRegistryFlowYCord`),
  setdeployRegistryFlow: createAction(`${prefix}setdeployRegistryFlow`),
  setRegistryDeployVariable: createAction(`${prefix}setRegistryDeployVariable`),
  setRegistryDeployParameterContext: createAction(
    `${prefix}setRegistryDeployParameterContext`
  ),
  deployNamespaceByRegistryFlow: createAction(
    `${prefix}deployNamespaceByRegistryFlow`
  ),
  setRegistryDeployResponseData: createAction(
    `${prefix}setRegistryDeployResponseData`
  ),
  setUpdatedRegistryRespones: createAction(
    `${prefix}setUpdatedRegistryRespones`
  ),
  setregistryDetailsFlow: createAction(`${prefix}setregistryDetailsFlow`),
  updateNamespaceStatusRegistry: createAction(
    `${prefix}updateNamespaceStatusRegistry`
  ),
  setRegistryDeployControllerService: createAction(
    `${prefix}setRegistryDeployControllerService`
  ),
  setUpdatedNamespaceResponse: createAction(
    `${prefix}setUpdatedNamespaceResponse`
  ),
  setFlowControlAfterUpgrade: createAction(
    `${prefix}setFlowControlAfterUpgrade`
  ),
  setFlowControlData: createAction(`${prefix}setFlowControlData`),
  setNewlyAddedExternalServiceCS: createAction(
    `${prefix}setNewlyAddedExternalServiceCS`
  ),
  setChangeStatusCSRespone: createAction(`${prefix}setChangeStatusCSRespone`),
  setRefreshmodalOpen: createAction(`${prefix}setRefreshmodalOpen`),
  setScheduleByRegistry: createAction(`${prefix}setScheduleByRegistry`),
  setScheduleTimeByRegistry: createAction(`${prefix}setScheduleTimeByRegistry`),
  setFlowControlStateAtScheduleDeploy: createAction(
    `${prefix}setFlowControlStateAtScheduleDeploy`
  ),
  setScheduleUpgradeByRegistry: createAction(
    `${prefix}setScheduleUpgradeByRegistry`
  ),
  setPropertyUpdateResponse: createAction(`${prefix}setPropertyUpdateResponse`),
  fetchDuplicateScheduleData: createAction(
    `${prefix}fetchDuplicateScheduleData`
  ),
  setDuplicateScheduleModalOpen: createAction(
    `${prefix}setDuplicateScheduleModalOpen`
  ),
  setDuplicateScheduleModalData: createAction(
    `${prefix}setDuplicateScheduleModalData`
  ),
  setFlowControlAfterDeploy: createAction(`${prefix}setFlowControlAfterDeploy`),
  setSelectedNameSpaceForDetail: createAction(
    `${prefix}setSelectedNameSpaceForDetail`
  ),
  setCsLocalData: createAction(`${prefix}setCsLocalData`),
  setIsLocalCsConfigured: createAction(`${prefix}setIsLocalCsConfigured`),
  setPcLocalData: createAction(`${prefix}setPcLocalData`),
  setIsLocalPcUpdated: createAction(`${prefix}setIsLocalPcUpdated`),
  setVariableLocalData: createAction(`${prefix}setVariableLocalData`),
  setIsLocalVariableUpdated: createAction(`${prefix}setIsLocalVariableUpdated`),
  setVersionListReduxData: createAction(`${prefix}setVersionListReduxData`),
  fetchAddPropertyToAdd: createAction(`${prefix}fetchAddPropertyToAdd`),
  setAddPropertyCSResponse: createAction(`${prefix}setAddPropertyCSResponse`),
  setAlreadyFetchedLsIdentifierForUpgrade: createAction(
    `${prefix}setAlreadyFetchedLsIdentifierForUpgrade`
  ),
  setLocalServiceInUpgrade: createAction(`${prefix}setLocalServiceInUpgrade`),
  setUserStory: createAction(`${prefix}setUserStory`),
  setChangeRequest: createAction(`${prefix}setChangeRequest`),
  setParameterEditingAction: createAction(`${prefix}setParameterEditingAction`),
  fetchSanityCheckSummaryData: createAction(
    `${prefix}fetchSanityCheckSummaryData`
  ),
  setSanityCheckDetailSectionData: createAction(
    `${prefix}setSanityCheckDetailSectionData`
  ),
  setSanityCheckAtDeploy: createAction(`${prefix}setSanityCheckAtDeploy`),
  setSanityCheckDeployModalOpen: createAction(
    `${prefix}setSanityCheckDeployModalOpen`
  ),
  revertLocalChanges: createAction(`${prefix}revertLocalChanges`),
  revertLocalChangesSuccess: createAction(`${prefix}revertLocalChangesSuccess`),
  setShouldRevertChanges: createAction(`${prefix}setShouldRevertChanges`),
  setLocalChangesModalOpen: createAction(`${prefix}setLocalChangesModalOpen`),
  setLocalChangesModalType: createAction(`${prefix}setLocalChangesModalType`),
  setRevertConfirmationModalOpen: createAction(
    `${prefix}setRevertConfirmationModalOpen`
  ),
  fetchInvalidProcessorDetails: createAction('FETCH_INVALID_PROCESSOR_DETAILS'),
  fetchInvalidProcessorDetailsSuccess: createAction(
    'FETCH_INVALID_PROCESSOR_DETAILS_SUCCESS'
  ),
  fetchSanityReportAuditLog: createAction(`${prefix}fetchSanityReportAuditLog`),
  setSanityReportAuditData: createAction(`${prefix}setSanityReportAuditData`),
  setDisplaySanityCheckCleanModal: createAction(
    `${prefix}setDisplaySanityCheckCleanModal`
  ),
  fetchDeleteNamespaceDetails: createAction('FETCH_DELETE_NAMESPACE_DETAILS'),
  fetchDeleteNamespaceDetailsSuccess: createAction(
    'FETCH_DELETE_NAMESPACE_DETAILS_SUCCESS'
  ),
  fetchNamespaceDetails: createAction('FETCH_NAMESPACE_DETAILS'),
  fetchLastSanityReport: createAction(`${prefix}fetchLastSanityReport`),
  fetchLastSanityReportSuccess: createAction(
    `${prefix}fetchLastSanityReportSuccess`
  ),
  setScheduleStartFlow: createAction(`${prefix}setScheduleStartFlow`),
  setScheduleFlowType: createAction(`${prefix}setScheduleFlowType`),
  refreshControllerService: createAction(`${prefix}refreshControllerService`),
  refreshControllerServiceSuccess: createAction(
    `${prefix}refreshControllerServiceSuccess`
  ),
  setCsPermissions: createAction(`${prefix}setCsPermissions`),
  setKeepParameters: createAction(`${prefix}setKeepParameters`),
  fetchServiceDefinition: createAction(`${prefix}fetchServiceDefinition`),
  fetchServiceDefinitionSuccess: createAction(
    `${prefix}fetchServiceDefinitionSuccess`
  ),
  fetchServiceDefinitionFailure: createAction(
    `${prefix}fetchServiceDefinitionFailure`
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
  localChanges: [],
  deployByRegistryFlow: true,
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
  rootControllerServiceNamespace: [],
  isAddControllerServiceModal: false,
  isNewAddControllerServiceModal: false,
  addControllerServiceList: [],
  isControllerServicePropertyModel: false,
  isAddPropertyDropdownModalOpen: false,
  newPropertyToAddControllerService: [],
  responseNewAddedProperty: {},
  isConfigurePropertyControllerServiceModalOpen: false,
  scheduleNamespaceParameterContext: [],
  scheduleNamespaceVariables: {},
  namespaceSummaryLoadingState: false,
  parameterContextListAtDeploy: {},
  childLevelDeployProcessorData: {},
  variableListLoading: false,
  bucketListDropDownData: {},
  flowListRegistry: {},
  versionListData: {},
  versionSelect: {},
  deployFormData: {},
  registryAllDetails: {},
  registryFlowXCord: null,
  registryFlowYCord: null,
  deployRegistryFlow: false,
  registryDeployVariable: [],
  registryDeployParameterContext: [],
  registryDeployResponseData: {},
  updatedRegistryRespones: {},
  registryDetailsFlow: false,
  registryDeployControllerService: {},
  updatedNamespaceResponse: {},
  flowControlAfterUpgrade: false,
  FlowControlData: {},
  newlyAddedExternalServiceCS: {},
  changeStatusCSRespone: {},
  isRefreshModalOpen: false,
  scheduleByRegistry: false,
  scheduleTimeByRegistry: null,
  flowControlStateAtScheduleDeploy: null,
  scheduleUpgradeByRegistry: false,
  propertyUpdateResponse: {},
  duplicateScheduleModalOpen: false,
  duplicateScheduleModalData: {},
  flowControlAfterDeploy: false,
  selectedNameSpaceForDetail: {},
  csLocalData: {},
  isLocalCsConfigured: false,
  pcLocalData: {},
  variableLocalData: [],
  isLocalPcUpdated: false,
  isLocalVariableUpdated: false,
  versionListReduxData: [],
  propertyOptionOnDeploy: [],
  addPropertyCSResponse: {},
  alreadyFetchedLsIdentifierForUpgrade: [],
  localServiceInUpgrade: [],
  userStory: '',
  changeRequest: null,
  parameterEditingAction: false,
  sanityCheckDetailSectionData: [],
  sanityCheckAtDeploy: false,
  sanityCheckDeployModalOpen: false,
  revertLocalChanges: [],
  shouldRevertChanges: false,
  localChangesModalOpen: false,
  localChangesModalType: null,
  revertConfirmationModalOpen: false,
  invalidProcessorDetails: [],
  sanityReportAuditData: {},
  displaySanityCheckCleanModal: false,
  deleteNamespaceDetails: {},
  scheduleStartFlow: false,
  scheduleFlowType: null,
  lastSanityReportData: {},
  csPermissions: {},
  keepParameterForDeploy: true,
  serviceDefinition: null,
  serviceDefinitionLoading: false,
  serviceDefinitionError: null,
};

/* ------------- SELECTORS ------------------ */
export const NamespacesSelectors = {
  getSelectedCluster: state => state.namespaces.selectedCluster,
  getSelectedNamespace: state => state.namespaces.selectedNamespace,
  getNamespaces: state => state.namespaces.clusterNamespaces.data,
  getLocalChanges: state => state.namespaces.localChanges,
  getSelectedDestCluster: state => state.namespaces.selectedDestCluster,
  getSelectedDestNamespace: state => state.namespaces.selectedDestNamespace,
  getDestNamespaces: state => state.namespaces.destClusterNamespaces.data,
  getFlowPath: state => state.namespaces.flowPath,
  getCheckDestCluster: state => state.namespaces.checkDestCluster,
  getFormData: state => state.namespaces.formData,
  getDeployOrUpgradeDetails: state => state.namespaces.deployOrUpgradeDetails,
  getParameterDetails: state => state.namespaces.parameterDetails,
  getDeployedModal: state => state.namespaces.isDeployedModal,
  getDeployRegistryFlow: state => state.namespaces.deployByRegistryFlow,
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
  getRootControllerServiceNamespace: state =>
    state.namespaces.rootControllerServiceNamespace,
  getIsAddControllerServiceMOdalOpen: state =>
    state.namespaces.isAddControllerServiceModal,
  getIsNewAddControllerServiceMOdalOpen: state =>
    state.namespaces.isNewAddControllerServiceModal,
  getAddControllerServiceList: state =>
    state.namespaces.addControllerServiceList,
  getControllerServicePropertyModel: state =>
    state.namespaces.isControllerServicePropertyModel,
  getAddPropertyDropdownModal: state =>
    state.namespaces.isAddPropertyDropdownModalOpen,
  getNewProprtyToAddControllerService: state =>
    state.namespaces.newPropertyToAddControllerService,
  getPropertyOptionOnDeploy: state => state.namespaces.propertyOptionOnDeploy,
  getResponseNewAddedProperty: state =>
    state.namespaces.responseNewAddedProperty,
  getIsConfigurePropertyControllerServiceModalOpen: state =>
    state.namespaces.isConfigurePropertyControllerServiceModalOpen,
  getScheduleNamespaceParameterContext: state =>
    state.namespaces.scheduleNamespaceParameterContext,
  getScheduleNamespaceVariables: state =>
    state.namespaces.scheduleNamespaceVariables,
  getNamespaceSummaryLoadingState: state =>
    state.namespaces.namespaceSummaryLoadingState,
  getParameterContextListAtDeploy: state =>
    state.namespaces.parameterContextListAtDeploy,
  getChildLevelDeployProcessorData: state =>
    state.namespaces.childLevelDeployProcessorData,
  getVariableListLoading: state => state.namespaces.variableListLoading,
  getBucketListDropDownData: state => state.namespaces.bucketListDropDownData,
  getFlowListRegistry: state => state.namespaces.flowListRegistry,
  getVersionListData: state => state.namespaces.versionListData,
  getVersionSelect: state => state.namespaces.versionSelect,
  getDeployFormData: state => state.namespaces.deployFormData,
  getRegistryAllDetails: state => state.namespaces.registryAllDetails,
  getregistryFlowXCord: state => state.namespaces.registryFlowXCord,
  getregistryFlowYCord: state => state.namespaces.registryFlowYCord,
  getdeployRegistryFlow: state => state.namespaces.deployRegistryFlow,
  getRegistryDeployVariable: state => state.namespaces.registryDeployVariable,
  getRegistryDeployParameterContext: state =>
    state.namespaces.registryDeployParameterContext,
  getRegistryDeployResponseData: state =>
    state.namespaces.registryDeployResponseData,
  getUpdatedRegistryRespones: state => state.namespaces.updatedRegistryRespones,
  getRegistryDetailsFlow: state => state.namespaces.registryDetailsFlow,
  getRegistryDeployControllerService: state =>
    state.namespaces.registryDeployControllerService,
  getUpdatedNamespaceResponse: state =>
    state.namespaces.updatedNamespaceResponse,
  getFlowControlAfterUpgrade: state => state.namespaces.flowControlAfterUpgrade,
  getFlowControlData: state => state.namespaces.flowControlData,
  getNewlyAddedExternalServiceCS: state =>
    state.namespaces.newlyAddedExternalServiceCS,
  getChangeStatusCSRespone: state => state.namespaces.changeStatusCSRespone,
  getRefreshmodalOpen: state => state.namespaces.isRefreshModalOpen,
  getScheduleByRegistry: state => state.namespaces.scheduleByRegistry,
  getScheduleTimeByRegistry: state => state.namespaces.scheduleTimeByRegistry,
  getflowControlStateAtScheduleDeploy: state =>
    state.namespaces.flowControlStateAtScheduleDeploy,
  getScheduleUpgradeByRegistry: state =>
    state.namespaces.scheduleUpgradeByRegistry,
  getPropertyUpdateResponse: state => state.namespaces.propertyUpdateResponse,
  getDuplicateScheduleModalOpen: state =>
    state.namespaces.duplicateScheduleModalOpen,
  getDuplicateScheduleModalData: state =>
    state.namespaces.duplicateScheduleModalData,
  getflowControlAfterDeploy: state => state.namespaces.flowControlAfterDeploy,
  getSelectedNameSpaceForDetail: state =>
    state.namespaces.selectedNameSpaceForDetail,
  getCsLocalData: state => state.namespaces.csLocalData,
  getIsLocalCsConfigured: state => state.namespaces.isLocalCsConfigured,
  getPcLocalData: state => state.namespaces.pcLocalData,
  getIsLocalPcUpdated: state => state.namespaces.isLocalPcUpdated,
  getVariableLocalData: state => state.namespaces.variableLocalData,
  getIsLocalVariableUpdated: state => state.namespaces.isLocalVariableUpdated,
  getVersionListReduxData: state => state.namespaces.versionListReduxData,
  getAddPropertyCSResponse: state => state.namespaces.addPropertyCSResponse,
  getAlreadyFetchedLsIdentifierForUpgrade: state =>
    state.namespaces.alreadyFetchedLsIdentifierForUpgrade,
  getLocalServiceInUpgrade: state => state.namespaces.localServiceInUpgrade,
  getUserStory: state => state.namespaces.userStory,
  getChangeRequest: state => state.namespaces.changeRequest,
  getParameterEditingAction: state => state.namespaces.parameterEditingAction,
  getSanityCheckDetailSectionData: state =>
    state.namespaces.sanityCheckDetailSectionData,
  getSanityCheckAtDeploy: state => state.namespaces.sanityCheckAtDeploy,
  getSanityCheckDeployModalOpen: state =>
    state.namespaces.sanityCheckDeployModalOpen,
  getRevertLoaclChanges: state => state.namespaces.revertLocalChanges,
  getShouldRevertChanges: state => state.namespaces.shouldRevertChanges,
  getLocalChangesModalOpen: state => state.namespaces.localChangesModalOpen,
  getLocalChangesModalType: state => state.namespaces.localChangesModalType,
  getRevertConfirmationModalOpen: state =>
    state.namespaces.revertConfirmationModalOpen,
  getInvalidProcessorDetails: state => state.namespaces.invalidProcessorDetails,
  getSanityReportAuditData: state => state.namespaces.sanityReportAuditData,
  getDisplaySanityCheckCleanModal: state =>
    state.namespaces.displaySanityCheckCleanModal,
  getDeleteNamespaceDetails: state => state.namespaces.deleteNamespaceDetails,
  getScheduleStartFlow: state => state.namespaces.scheduleStartFlow,
  getScheduleFlowType: state => state.namespaces.scheduleFlowType,
  getLastSanityReportData: state => state.namespaces.lastSanityReportData,
  getRefreshedControllerService: state =>
    state.namespaces.refreshedControllerService,
  getCsPermissions: state => state.namespaces.csPermissions,
  getKeepParameters: state => state.namespaces.keepParameterForDeploy,
  getServiceDefinition: state => state.namespaces.serviceDefinition,
  getServiceDefinitionLoading: state =>
    state.namespaces.serviceDefinitionLoading,
  getServiceDefinitionError: state => state.namespaces.serviceDefinitionError,
  getNamespacesAllData: state => state.namespaces.clusterNamespaces,
};

/* ------------- REDUCERS ------------------- */
const setSelectedCluster = (state, { payload }) => {
  return {
    ...state,
    selectedCluster: payload,
  };
};
const setDeployByRegistryFlow = (state, { payload }) => {
  return {
    ...state,
    deployByRegistryFlow: payload,
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

const setDeployedModal = (state, { payload }) => {
  return {
    ...state,
    isDeployedModal: payload,
  };
};
const resetDeployData = state => {
  return {
    ...NAMESPACES_INITIAL_STATE,
    selectedCluster: state.selectedCluster,
    selectedNamespace: state.selectedNamespace,
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

const getRootControllerServiceNamespace = (state, { payload }) => {
  return {
    ...state,
    rootControllerServiceNamespace: payload,
  };
};
//
const setIsAddControllerServiceModal = (state, { payload }) => {
  return {
    ...state,
    isAddControllerServiceModal: payload,
  };
};
const setIsNewAddControllerServiceModal = (state, { payload }) => {
  return {
    ...state,
    isNewAddControllerServiceModal: payload,
  };
};
const setAddControllerServiceList = (state, { payload }) => {
  return {
    ...state,
    addControllerServiceList: payload,
  };
};
const setIsControllerServicePropertyModel = (state, { payload }) => {
  return {
    ...state,
    isControllerServicePropertyModel: payload,
  };
};

const setIsAddPropertyDropdownModalOpen = (state, { payload }) => {
  return {
    ...state,
    isAddPropertyDropdownModalOpen: payload,
  };
};
const setNewProperToAddControllerService = (state, { payload }) => {
  return {
    ...state,
    newPropertyToAddControllerService: payload,
  };
};
const setPropertyOptionOnDeploy = (state, { payload }) => {
  return {
    ...state,
    propertyOptionOnDeploy: payload,
  };
};
const setResponseNewAddedProprty = (state, { payload }) => {
  return {
    ...state,
    responseNewAddedProperty: payload,
  };
};
const setIsConfigurePropertyControllerServiceModalOpen = (
  state,
  { payload }
) => {
  return {
    ...state,
    isConfigurePropertyControllerServiceModalOpen: payload,
  };
};

const setScheduleNamespaceParameterContext = (state, { payload }) => {
  return {
    ...state,
    scheduleNamespaceParameterContext: payload,
  };
};
const setScheduleNamespaceVariable = (state, { payload }) => {
  return {
    ...state,
    scheduleNamespaceVariables: payload,
  };
};

const setNamespaceSummaryLoadingState = (state, { payload }) => {
  return {
    ...state,
    namespaceSummaryLoadingState: payload,
  };
};

const setParameterContextListAtDeploy = (state, { payload }) => {
  return {
    ...state,
    parameterContextListAtDeploy: payload,
  };
};
const setChildLevelDeployProcessorData = (state, { payload }) => {
  return {
    ...state,
    childLevelDeployProcessorData: payload,
  };
};
const setVariableListLoading = (state, { payload }) => {
  return {
    ...state,
    variableListLoading: payload,
  };
};
const setBucketListDropDownData = (state, { payload }) => {
  return {
    ...state,
    bucketListDropDownData: payload,
  };
};
const setFlowListRegistry = (state, { payload }) => {
  return {
    ...state,
    flowListRegistry: payload,
  };
};
const setVersionListData = (state, { payload }) => {
  return {
    ...state,
    versionListData: payload,
  };
};

const setVersionSelect = (state, { payload }) => {
  return {
    ...state,
    versionSelect: payload,
  };
};
const setDeployFormData = (state, { payload }) => {
  return {
    ...state,
    deployFormData: payload,
  };
};

const setRegistryAllDetails = (state, { payload }) => {
  return {
    ...state,
    registryAllDetails: payload,
  };
};

const setRegistryFlowXCord = (state, { payload }) => {
  return {
    ...state,
    registryFlowXCord: payload,
  };
};

const setRegistryFlowYCord = (state, { payload }) => {
  return {
    ...state,
    registryFlowYCord: payload,
  };
};

const setdeployRegistryFlow = (state, { payload }) => {
  return {
    ...state,
    deployRegistryFlow: payload,
  };
};

const setRegistryDeployVariable = (state, { payload }) => {
  return {
    ...state,
    registryDeployVariable: payload,
  };
};
const setRegistryDeployParameterContext = (state, { payload }) => {
  return {
    ...state,
    registryDeployParameterContext: payload,
  };
};

const setRegistryDeployResponseData = (state, { payload }) => {
  return {
    ...state,
    registryDeployResponseData: payload,
  };
};

const setFlowControlData = (state, { payload }) => {
  return {
    ...state,
    flowControlData: payload,
  };
};

const setUpdatedRegistryRespones = (state, { payload }) => {
  return {
    ...state,
    updatedRegistryRespones: payload,
  };
};
const setregistryDetailsFlow = (state, { payload }) => {
  return {
    ...state,
    registryDetailsFlow: payload,
  };
};
const setUpdatedNamespaceResponse = (state, { payload }) => {
  return {
    ...state,
    updatedNamespaceResponse: payload,
  };
};

const setRegistryDeployControllerService = (state, { payload }) => {
  return {
    ...state,
    registryDeployControllerService: payload,
  };
};
const setFlowControlAfterUpgrade = (state, { payload }) => {
  return {
    ...state,
    flowControlAfterUpgrade: payload,
  };
};
const setNewlyAddedExternalServiceCS = (state, { payload }) => {
  return {
    ...state,
    newlyAddedExternalServiceCS: payload,
  };
};
const setChangeStatusCSRespone = (state, { payload }) => {
  return {
    ...state,
    changeStatusCSRespone: payload,
  };
};
const setRefreshmodalOpen = (state, { payload }) => {
  return {
    ...state,
    isRefreshModalOpen: payload,
  };
};
const setScheduleByRegistry = (state, { payload }) => {
  return {
    ...state,
    scheduleByRegistry: payload,
  };
};
const setScheduleTimeByRegistry = (state, { payload }) => {
  return {
    ...state,
    scheduleTimeByRegistry: payload,
  };
};
const setFlowControlStateAtScheduleDeploy = (state, { payload }) => {
  return {
    ...state,
    flowControlStateAtScheduleDeploy: payload,
  };
};

const setScheduleUpgradeByRegistry = (state, { payload }) => {
  return {
    ...state,
    scheduleUpgradeByRegistry: payload,
  };
};

const setPropertyUpdateResponse = (state, { payload }) => {
  return {
    ...state,
    propertyUpdateResponse: payload,
  };
};
const setDuplicateScheduleModalOpen = (state, { payload }) => {
  return {
    ...state,
    duplicateScheduleModalOpen: payload,
  };
};

const setDuplicateScheduleModalData = (state, { payload }) => {
  return {
    ...state,
    duplicateScheduleModalData: payload,
  };
};
const setFlowControlAfterDeploy = (state, { payload }) => {
  return {
    ...state,
    flowControlAfterDeploy: payload,
  };
};

const setSelectedNameSpaceForDetail = (state, { payload }) => {
  return {
    ...state,
    selectedNameSpaceForDetail: payload,
  };
};

const setCsLocalData = (state, { payload }) => {
  return {
    ...state,
    csLocalData: payload,
  };
};

const setIsLocalCsConfigured = (state, { payload }) => {
  return {
    ...state,
    isLocalCsConfigured: payload,
  };
};

const setPcLocalData = (state, { payload }) => {
  return {
    ...state,
    pcLocalData: payload,
  };
};

const setVariableLocalData = (state, { payload }) => {
  return {
    ...state,
    variableLocalData: payload,
  };
};

const setIsLocalPcUpdated = (state, { payload }) => {
  return {
    ...state,
    isLocalPcUpdated: payload,
  };
};

const setIsLocalVariableUpdated = (state, { payload }) => {
  return {
    ...state,
    isLocalVariableUpdated: payload,
  };
};

const setVersionListReduxData = (state, { payload }) => {
  return {
    ...state,
    versionListReduxData: payload,
  };
};
const setAddPropertyCSResponse = (state, { payload }) => {
  return {
    ...state,
    addPropertyCSResponse: payload,
  };
};

const setAlreadyFetchedLsIdentifierForUpgrade = (state, { payload }) => {
  return {
    ...state,
    alreadyFetchedLsIdentifierForUpgrade: payload,
  };
};

const setLocalServiceInUpgrade = (state, { payload }) => {
  return {
    ...state,
    localServiceInUpgrade: payload,
  };
};
const setUserStory = (state, { payload }) => {
  return {
    ...state,
    userStory: payload,
  };
};
const setChangeRequest = (state, { payload }) => {
  return {
    ...state,
    changeRequest: payload,
  };
};
const setParameterEditingAction = (state, { payload }) => {
  return {
    ...state,
    parameterEditingAction: payload,
  };
};
const setSanityCheckDetailSectionData = (state, { payload }) => {
  return {
    ...state,
    sanityCheckDetailSectionData: payload,
  };
};
const setSanityCheckAtDeploy = (state, { payload }) => {
  return {
    ...state,
    sanityCheckAtDeploy: payload,
  };
};
const setSanityCheckDeployModalOpen = (state, { payload }) => {
  return {
    ...state,
    sanityCheckDeployModalOpen: payload,
  };
};

const fetchLocalChangesSuccess = (state, { payload }) => {
  return {
    ...state,
    localChanges: payload,
  };
};

const revertLocalChangesSuccess = (state, { payload }) => {
  return {
    ...state,
    revertLocalChanges: payload,
  };
};

const setShouldRevertChanges = (state, { payload }) => {
  return {
    ...state,
    shouldRevertChanges: payload,
  };
};

const setLocalChangesModalOpen = (state, { payload }) => {
  return {
    ...state,
    localChangesModalOpen: payload,
  };
};

const setLocalChangesModalType = (state, { payload }) => {
  return {
    ...state,
    localChangesModalType: payload,
  };
};

const setRevertConfirmationModalOpen = (state, { payload }) => {
  return {
    ...state,
    revertConfirmationModalOpen: payload,
  };
};
const deleteNamespaceSuccess = (state, { payload }) => {
  return {
    ...state,
    deletedNamespace: payload,
  };
};

const fetchInvalidProcessorDetailsSuccess = (state, { payload }) => {
  return {
    ...state,
    invalidProcessorDetails: payload,
  };
};
const setSanityReportAuditData = (state, { payload }) => {
  return {
    ...state,
    sanityReportAuditData: payload,
  };
};
const setDisplaySanityCheckCleanModal = (state, { payload }) => {
  return {
    ...state,
    displaySanityCheckCleanModal: payload,
  };
};

const fetchDeleteNamespaceDetailsSuccess = (state, { payload }) => {
  state.deleteNamespaceDetails = payload;
};

const setScheduleStartFlow = (state, { payload }) => {
  return {
    ...state,
    scheduleStartFlow: payload,
  };
};

const setScheduleFlowType = (state, { payload }) => {
  state.scheduleFlowType = payload;
};

const fetchLastSanityReportSuccess = (state, { payload }) => {
  return {
    ...state,
    lastSanityReportData: payload,
  };
};

const refreshControllerServiceSuccess = (state, { payload }) => {
  const { data } = payload;
  return {
    ...state,
    refreshedControllerService: { data },
  };
};

const setCsPermissions = (state, { payload }) => {
  return {
    ...state,
    csPermissions: payload,
  };
};
const setKeepParameters = (state, { payload }) => {
  return {
    ...state,
    keepParameterForDeploy: payload,
  };
};

const fetchServiceDefinitionSuccess = (state, { payload }) => {
  return {
    ...state,
    serviceDefinition: payload,
    serviceDefinitionLoading: false,
    serviceDefinitionError: null,
  };
};

const fetchServiceDefinitionFailure = (state, { payload }) => {
  return {
    ...state,
    serviceDefinition: null,
    serviceDefinitionLoading: false,
    serviceDefinitionError: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const namespacesReducer = createReducer(
  NAMESPACES_INITIAL_STATE,
  builder => {
    builder
      .addCase(NamespacesActions.setSelectedCluster, setSelectedCluster)
      .addCase(
        NamespacesActions.setDeployByRegistryFlow,
        setDeployByRegistryFlow
      )
      .addCase(NamespacesActions.setSelectedNamespace, setSelectedNamespace)
      .addCase(NamespacesActions.setFlowPath, setFlowPath)
      .addCase(NamespacesActions.fetchNamespacesSuccess, fetchNamespacesSuccess)
      .addCase(
        NamespacesActions.fetchLocalChangesSuccess,
        fetchLocalChangesSuccess
      )
      .addCase(NamespacesActions.deleteNamespaceSuccess, deleteNamespaceSuccess)
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
      )
      .addCase(
        NamespacesActions.getRootControllerServiceNamespace,
        getRootControllerServiceNamespace
      )
      .addCase(
        NamespacesActions.setIsAddControllerServiceModal,
        setIsAddControllerServiceModal
      )
      .addCase(
        NamespacesActions.setIsNewAddControllerServiceModal,
        setIsNewAddControllerServiceModal
      )
      .addCase(
        NamespacesActions.setAddControllerServiceList,
        setAddControllerServiceList
      )
      .addCase(
        NamespacesActions.setIsControllerServicePropertyModel,
        setIsControllerServicePropertyModel
      )
      .addCase(
        NamespacesActions.setIsAddPropertyDropdownModalOpen,
        setIsAddPropertyDropdownModalOpen
      )
      .addCase(
        NamespacesActions.setNewProperToAddControllerService,
        setNewProperToAddControllerService
      )
      .addCase(
        NamespacesActions.setPropertyOptionOnDeploy,
        setPropertyOptionOnDeploy
      )
      .addCase(
        NamespacesActions.setResponseNewAddedProprty,
        setResponseNewAddedProprty
      )
      .addCase(
        NamespacesActions.setIsConfigurePropertyControllerServiceModalOpen,
        setIsConfigurePropertyControllerServiceModalOpen
      )
      .addCase(
        NamespacesActions.setScheduleNamespaceParameterContext,
        setScheduleNamespaceParameterContext
      )
      .addCase(
        NamespacesActions.setScheduleNamespaceVariable,
        setScheduleNamespaceVariable
      )
      .addCase(
        NamespacesActions.setNamespaceSummaryLoadingState,
        setNamespaceSummaryLoadingState
      )
      .addCase(
        NamespacesActions.setParameterContextListAtDeploy,
        setParameterContextListAtDeploy
      )
      .addCase(
        NamespacesActions.setChildLevelDeployProcessorData,
        setChildLevelDeployProcessorData
      )
      .addCase(NamespacesActions.setVariableListLoading, setVariableListLoading)
      .addCase(
        NamespacesActions.setBucketListDropDownData,
        setBucketListDropDownData
      )
      .addCase(NamespacesActions.setFlowListRegistry, setFlowListRegistry)
      .addCase(NamespacesActions.setVersionListData, setVersionListData)
      .addCase(NamespacesActions.setVersionSelect, setVersionSelect)
      .addCase(NamespacesActions.setDeployFormData, setDeployFormData)
      .addCase(NamespacesActions.setRegistryAllDetails, setRegistryAllDetails)
      .addCase(NamespacesActions.setRegistryFlowXCord, setRegistryFlowXCord)
      .addCase(NamespacesActions.setRegistryFlowYCord, setRegistryFlowYCord)
      .addCase(NamespacesActions.setdeployRegistryFlow, setdeployRegistryFlow)
      .addCase(
        NamespacesActions.setRegistryDeployVariable,
        setRegistryDeployVariable
      )
      .addCase(
        NamespacesActions.setRegistryDeployParameterContext,
        setRegistryDeployParameterContext
      )
      .addCase(
        NamespacesActions.setRegistryDeployResponseData,
        setRegistryDeployResponseData
      )
      .addCase(
        NamespacesActions.setUpdatedRegistryRespones,
        setUpdatedRegistryRespones
      )
      .addCase(NamespacesActions.setregistryDetailsFlow, setregistryDetailsFlow)
      .addCase(
        NamespacesActions.setRegistryDeployControllerService,
        setRegistryDeployControllerService
      )
      .addCase(
        NamespacesActions.setUpdatedNamespaceResponse,
        setUpdatedNamespaceResponse
      )
      .addCase(
        NamespacesActions.setFlowControlAfterUpgrade,
        setFlowControlAfterUpgrade
      )
      .addCase(NamespacesActions.setFlowControlData, setFlowControlData)
      .addCase(
        NamespacesActions.setNewlyAddedExternalServiceCS,
        setNewlyAddedExternalServiceCS
      )
      .addCase(
        NamespacesActions.setChangeStatusCSRespone,
        setChangeStatusCSRespone
      )
      .addCase(NamespacesActions.setRefreshmodalOpen, setRefreshmodalOpen)
      .addCase(NamespacesActions.setScheduleByRegistry, setScheduleByRegistry)
      .addCase(
        NamespacesActions.setScheduleTimeByRegistry,
        setScheduleTimeByRegistry
      )
      .addCase(
        NamespacesActions.setFlowControlStateAtScheduleDeploy,
        setFlowControlStateAtScheduleDeploy
      )
      .addCase(
        NamespacesActions.setScheduleUpgradeByRegistry,
        setScheduleUpgradeByRegistry
      )
      .addCase(
        NamespacesActions.setPropertyUpdateResponse,
        setPropertyUpdateResponse
      )
      .addCase(
        NamespacesActions.setDuplicateScheduleModalOpen,
        setDuplicateScheduleModalOpen
      )
      .addCase(
        NamespacesActions.setDuplicateScheduleModalData,
        setDuplicateScheduleModalData
      )
      .addCase(
        NamespacesActions.setFlowControlAfterDeploy,
        setFlowControlAfterDeploy
      )
      .addCase(
        NamespacesActions.setSelectedNameSpaceForDetail,
        setSelectedNameSpaceForDetail
      )
      .addCase(NamespacesActions.setCsLocalData, setCsLocalData)
      .addCase(NamespacesActions.setIsLocalCsConfigured, setIsLocalCsConfigured)
      .addCase(NamespacesActions.setPcLocalData, setPcLocalData)
      .addCase(NamespacesActions.setVariableLocalData, setVariableLocalData)
      .addCase(NamespacesActions.setIsLocalPcUpdated, setIsLocalPcUpdated)
      .addCase(
        NamespacesActions.setIsLocalVariableUpdated,
        setIsLocalVariableUpdated
      )
      .addCase(
        NamespacesActions.setVersionListReduxData,
        setVersionListReduxData
      )
      .addCase(
        NamespacesActions.setAddPropertyCSResponse,
        setAddPropertyCSResponse
      )
      .addCase(
        NamespacesActions.setAlreadyFetchedLsIdentifierForUpgrade,
        setAlreadyFetchedLsIdentifierForUpgrade
      )
      .addCase(NamespacesActions.setUserStory, setUserStory)
      .addCase(NamespacesActions.setChangeRequest, setChangeRequest)
      .addCase(
        NamespacesActions.setLocalServiceInUpgrade,
        setLocalServiceInUpgrade
      )
      .addCase(
        NamespacesActions.setParameterEditingAction,
        setParameterEditingAction
      )
      .addCase(
        NamespacesActions.setSanityCheckDetailSectionData,
        setSanityCheckDetailSectionData
      )
      .addCase(NamespacesActions.setSanityCheckAtDeploy, setSanityCheckAtDeploy)
      .addCase(
        NamespacesActions.setSanityCheckDeployModalOpen,
        setSanityCheckDeployModalOpen
      )
      .addCase(
        NamespacesActions.revertLocalChangesSuccess,
        revertLocalChangesSuccess
      )
      .addCase(NamespacesActions.setShouldRevertChanges, setShouldRevertChanges)
      .addCase(
        NamespacesActions.setLocalChangesModalOpen,
        setLocalChangesModalOpen
      )
      .addCase(
        NamespacesActions.setLocalChangesModalType,
        setLocalChangesModalType
      )
      .addCase(
        NamespacesActions.setRevertConfirmationModalOpen,
        setRevertConfirmationModalOpen
      )
      .addCase(
        NamespacesActions.fetchInvalidProcessorDetailsSuccess,
        fetchInvalidProcessorDetailsSuccess
      )
      .addCase(
        NamespacesActions.setSanityReportAuditData,
        setSanityReportAuditData
      )
      .addCase(
        NamespacesActions.setDisplaySanityCheckCleanModal,
        setDisplaySanityCheckCleanModal
      )
      .addCase(
        NamespacesActions.fetchDeleteNamespaceDetailsSuccess,
        fetchDeleteNamespaceDetailsSuccess
      )
      .addCase(
        NamespacesActions.fetchLastSanityReportSuccess,
        fetchLastSanityReportSuccess
      )
      .addCase(NamespacesActions.setScheduleStartFlow, setScheduleStartFlow)
      .addCase(NamespacesActions.setScheduleFlowType, setScheduleFlowType)
      .addCase(NamespacesActions.setCsPermissions, setCsPermissions)
      .addCase(
        NamespacesActions.refreshControllerServiceSuccess,
        refreshControllerServiceSuccess
      )
      .addCase(NamespacesActions.setKeepParameters, setKeepParameters)
      .addCase(
        NamespacesActions.fetchServiceDefinitionSuccess,
        fetchServiceDefinitionSuccess
      )
      .addCase(
        NamespacesActions.fetchServiceDefinitionFailure,
        fetchServiceDefinitionFailure
      );
  }
);
