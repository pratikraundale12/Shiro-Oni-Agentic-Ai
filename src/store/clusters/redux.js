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
  setHostIpList: createAction(`${prefix}setHostIpList`),
  setActiveTabClusterSetup: createAction(`${prefix}setActiveTabClusterSetup`),
  fetchHostNodesList: createAction(`${prefix}fetchHostNodesList`),
  setAddHostBtnDisable: createAction(`${prefix}setAddHostBtnDisable`),
  setAddHostIndividualData: createAction(`${prefix}setAddHostIndividualData`),
  addIndividualHost: createAction(`${prefix}addIndividualHost`),
  deleteIndividualHost: createAction(`${prefix}deleteIndividualHost`),
  updateIndividualHost: createAction(`${prefix}updateIndividualHost`),
  getConfigList: createAction(`${prefix}getConfigList`),
  setConfigNameList: createAction(`${prefix}setConfigNameList`),
  addConfigClusterSetup: createAction(`${prefix}addConfigClusterSetup`),
  updateConfigClusterSetup: createAction(`${prefix}updateConfigClusterSetup`),
  deleteConfig: createAction(`${prefix}deleteConfig`),
  getConfigVersions: createAction(`${prefix}getConfigVersions`),
  setConfigVersionList: createAction(`${prefix}setConfigVersionList`),
  createCluster: createAction(`${prefix}createCluster`),
  getSingleConfigData: createAction(`${prefix}getSingleConfigData`),
  changeClusterActionState: createAction(`${prefix}changeClusterActionState`),
  fetchClusterRegistryNodes: createAction(`${prefix}fetchClusterRegistryNodes`),
  setRegistryNodesData: createAction(`${prefix}setRegistryNodesData`),
  fetchRunningStatusCluster: createAction(`${prefix}fetchRunningStatusCluster`),
  fetchClusterMetrics: createAction(`${prefix}fetchClusterMetrics`),
  setHealthMetricsData: createAction(`${prefix}setHealthMetricsData`),
  setRunningStatusData: createAction(`${prefix}setRunningStatusData`),
  setIsRegitryAssociationModalOpen: createAction(
    `${prefix}setIsRegitryAssociationModalOpen`
  ),
  associateClusterWithRegistry: createAction(
    `${prefix}associateClusterWithRegistry`
  ),
  setansibleClucterToEdit: createAction(`${prefix}setansibleClucterToEdit`),
  fetchAnsibleClusterData: createAction(`${prefix}fetchAnsibleClusterData`),
  setAnsibleClusterData: createAction(`${prefix}setAnsibleClusterData`),
  upgradeAnsibleCluster: createAction(`${prefix}upgradeAnsibleCluster`),
  setAnsibleClusterNodeUpdate: createAction(
    `${prefix}setAnsibleClusterNodeUpdate`
  ),
  updateNodesAnsibleCluster: createAction(`${prefix}updateNodesAnsibleCluster`),
  deleteAnsibleClusterHard: createAction(`${prefix}deleteAnsibleClusterHard`),
  setisAnsibleClusterDeleteFrimNiFiModalOpen: createAction(
    `${prefix}setisAnsibleClusterDeleteFrimNiFiModalOpen`
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
  hostIpList: [],
  activeTabClusterSetup: 'getting_started',
  addHostBtnDisable: true,
  addHostIndividualData: {},
  configNameList: [],
  configVersionList: [],
  updateConfigClusterSetupData: {},
  registryNodesData: {},
  healthMetricsData: {},
  runningStatusData: {},
  isRegitryAssociationModalOpen: false,
  ansibleClucterToEdit: '',
  ansibleClusterData: {},
  ansibleClusterNodeUpdate: '',
  isAnsibleClusterDeleteFrimNiFiModalOpen: false,
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
  getHostIpList: state => state.clusters.hostIpList,
  getActiveTabClusterSetup: state => state.clusters.activeTabClusterSetup,
  getAddHostBtnDisable: state => state.clusters.addHostBtnDisable,
  getAddHostIndividualData: state => state.clusters.addHostIndividualData,
  getConfigNameList: state => state.clusters.configNameList,
  getConfigVersionList: state => state.clusters.configVersionList,
  getUpdateConfigClusterSetupData: state =>
    state.clusters.updateConfigClusterSetupData,
  getRegistryNodesData: state => state.clusters.registryNodesData,
  getHealthMetricsData: state => state.clusters.healthMetricsData,
  getRunningStatusData: state => state.clusters.runningStatusData,
  getIsRegitryAssociationModalOpen: state =>
    state.clusters.isRegitryAssociationModalOpen,
  getAnsibleClusterData: state => state.clusters.ansibleClusterData,
  getansibleClucterToEdit: state => state.clusters.ansibleClucterToEdit,
  getAnsibleClusterNodeUpdate: state => state.clusters.ansibleClusterNodeUpdate,
  getisAnsibleClusterDeleteFrimNiFiModalOpen: state =>
    state.clusters.isAnsibleClusterDeleteFrimNiFiModalOpen,
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
const setHostIpList = (state, { payload }) => {
  return {
    ...state,
    hostIpList: payload,
  };
};
const setActiveTabClusterSetup = (state, { payload }) => {
  return {
    ...state,
    activeTabClusterSetup: payload,
  };
};
const setAddHostBtnDisable = (state, { payload }) => {
  return {
    ...state,
    addHostBtnDisable: payload,
  };
};
const setAddHostIndividualData = (state, { payload }) => {
  return {
    ...state,
    addHostIndividualData: payload,
  };
};
const setConfigNameList = (state, { payload }) => {
  return {
    ...state,
    configNameList: payload,
  };
};
const setConfigVersionList = (state, { payload }) => {
  return {
    ...state,
    configVersionList: payload,
  };
};

const updateConfigClusterSetupData = (state, { payload }) => {
  return {
    ...state,
    updateConfigClusterSetupData: payload,
  };
};

const setRegistryNodesData = (state, { payload }) => {
  return {
    ...state,
    registryNodesData: payload,
  };
};

const setHealthMetricsData = (state, { payload }) => {
  return {
    ...state,
    healthMetricsData: payload,
  };
};
const setRunningStatusData = (state, { payload }) => {
  return {
    ...state,
    runningStatusData: payload,
  };
};
const setIsRegitryAssociationModalOpen = (state, { payload }) => {
  return {
    ...state,
    isRegitryAssociationModalOpen: payload,
  };
};
const setansibleClucterToEdit = (state, { payload }) => {
  return {
    ...state,
    ansibleClucterToEdit: payload,
  };
};
const setAnsibleClusterData = (state, { payload }) => {
  return {
    ...state,
    ansibleClusterData: payload,
  };
};
const setAnsibleClusterNodeUpdate = (state, { payload }) => {
  return {
    ...state,
    ansibleClusterNodeUpdate: payload,
  };
};

const setisAnsibleClusterDeleteFrimNiFiModalOpen = (state, { payload }) => {
  return {
    ...state,
    isAnsibleClusterDeleteFrimNiFiModalOpen: payload,
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
      .addCase(ClustersActions.setNifiVersions, setNifiVersions)
      .addCase(ClustersActions.setHostIpList, setHostIpList)
      .addCase(
        ClustersActions.setActiveTabClusterSetup,
        setActiveTabClusterSetup
      )
      .addCase(ClustersActions.setAddHostBtnDisable, setAddHostBtnDisable)
      .addCase(
        ClustersActions.setAddHostIndividualData,
        setAddHostIndividualData
      )
      .addCase(ClustersActions.setConfigNameList, setConfigNameList)
      .addCase(ClustersActions.setConfigVersionList, setConfigVersionList)
      .addCase(
        ClustersActions.updateConfigClusterSetup,
        updateConfigClusterSetupData
      )
      .addCase(ClustersActions.setRegistryNodesData, setRegistryNodesData)
      .addCase(ClustersActions.setHealthMetricsData, setHealthMetricsData)
      .addCase(ClustersActions.setRunningStatusData, setRunningStatusData)
      .addCase(
        ClustersActions.setIsRegitryAssociationModalOpen,
        setIsRegitryAssociationModalOpen
      )
      .addCase(ClustersActions.setansibleClucterToEdit, setansibleClucterToEdit)
      .addCase(ClustersActions.setAnsibleClusterData, setAnsibleClusterData)
      .addCase(
        ClustersActions.setAnsibleClusterNodeUpdate,
        setAnsibleClusterNodeUpdate
      )
      .addCase(
        ClustersActions.setisAnsibleClusterDeleteFrimNiFiModalOpen,
        setisAnsibleClusterDeleteFrimNiFiModalOpen
      );
  }
);
