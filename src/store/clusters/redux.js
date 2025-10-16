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
  setIsRegitryAssociationModalOpen: createAction(
    `${prefix}setIsRegitryAssociationModalOpen`
  ),
  associateClusterWithRegistry: createAction(
    `${prefix}associateClusterWithRegistry`
  ),
  setTestCredsButtonVisible: createAction(`${prefix}setTestCredsButtonVisible`),
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
  fetchAnsibleCLusterProcessData: createAction(
    `${prefix}fetchAnsibleCLusterProcessData`
  ),
  setansibleClusterProgressData: createAction(
    `${prefix}setansibleClusterProgressData`
  ),
  setIsFailedClusterDeleteModalOpen: createAction(
    `${prefix}setIsFailedClusterDeleteModalOpen`
  ),
  setAnsibleClusterCreationResponseData: createAction(
    `${prefix}setAnsibleClusterCreationResponseData`
  ),
  setProgressTrackingModalOpen: createAction(
    `${prefix}setProgressTrackingModalOpen`
  ),
  setLastVisitedTab: createAction(`${prefix}setLastVisitedTab`),
  setclusterListItems: createAction(`${prefix}setclusterListItems`),
  fetchAllConfigPropertiesWithValue: createAction(
    `${prefix}fetchAllConfigPropertiesWithValue`
  ),
  setAllConfigPropertiesAndValue: createAction(
    `${prefix}setAllConfigPropertiesAndValue`
  ),
  setClusterSetupSelectedNiFiVersion: createAction(
    `${prefix}setClusterSetupSelectedNiFiVersion`
  ),
  testMultipleNodes: createAction(`${prefix}testMultipleNodes`),
  updateMultipleNodeswithSSH: createAction(
    `${prefix}updateMultipleNodeswithSSH`
  ),
  setMultiNodesTestResults: createAction(`${prefix}setMultiNodesTestResults`),
  setTestCertificateNodes: createAction(`${prefix}setTestCertificateNodes`),
  fetchSSHstatus: createAction(`${prefix}fetchSSHstatus`),
  setSshAddedStatus: createAction(`${prefix}setSshAddedStatus`),
  addNarFile: createAction(`${prefix}addNarFile`),
  fetchNarList: createAction(`${prefix}fetchNarList`),
  setNarList: createAction(`${prefix}setNarList`),
  restartCluster: createAction(`${prefix}restartCluster`),
  uploadClusterDriver: createAction(`${prefix}uploadClusterDriver`),
  fetchDriversList: createAction(`${prefix}fetchDriversList`),
  setDriversList: createAction(`${prefix}setDriversList`),
  setCreateClusterMethod: createAction(`${prefix}setCreateClusterMethod`),
  fetchMasterHostNodesList: createAction(`${prefix}fetchMasterHostNodesList`),
  fetchConfigFieldsForKubernetes: createAction(
    `${prefix}fetchConfigFieldsForKubernetes`
  ),
  setKubernetesConfigFields: createAction(`${prefix}setKubernetesConfigFields`),
  createConfigForKubernetesCluster: createAction(
    `${prefix}createConfigForKubernetesCluster`
  ),
  fetchConfigListForKubernetes: createAction(
    `${prefix}fetchConfigListForKubernetes`
  ),
  setListConfigListKubernetes: createAction(
    `${prefix}setListConfigListKubernetes`
  ),
  setkubeCofigToEdit: createAction(`${prefix}setkubeCofigToEdit`),
  deleteKubeConfig: createAction(`${prefix}deleteKubeConfig`),
  createKubernetesCluster: createAction(`${prefix}createKubernetesCluster`),
  fetchConfigVersionsPerConfig: createAction(
    `${prefix}fetchConfigVersionsPerConfig`
  ),
  setkubConfigVersion: createAction(`${prefix}setkubConfigVersion`),
  setkubeHostModalOpen: createAction(`${prefix}setkubeHostModalOpen`),
  createKubernetesMasterNodeCluster: createAction(
    `${prefix}createKubernetesMasterNodeCluster`
  ),
  deleteMasterNodeConfig: createAction(`${prefix}deleteMasterNodeConfig`),
  fetchKubeClusterDataToUpgrade: createAction(
    `${prefix}fetchKubeClusterDataToUpgrade`
  ),
  setkubeClusterUpgradeData: createAction(`${prefix}setkubeClusterUpgradeData`),
  setIsOpenDeleteKubeClusterModal: createAction(
    `${prefix}setIsOpenDeleteKubeClusterModal`
  ),
  deleteClusterKube: createAction(`${prefix}deleteClusterKube`),
  setTourIndex: createAction(`${prefix}setTourIndex`),
  setTourStart: createAction(`${prefix}setTourStart`),
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
  // Service-account credential check
  checkingServiceAccount: false,
  checkServiceAccountError: null,

  // Add-host
  addingServiceAccountHost: false,
  addServiceAccountHostError: null,

  // Update-host
  updatingServiceAccountHost: false,
  updateServiceAccountHostError: null,
  isRegitryAssociationModalOpen: false,
  isTestCredsButtonVisible: true,
  ansibleClucterToEdit: '',
  ansibleClusterData: {},
  ansibleClusterNodeUpdate: '',
  isAnsibleClusterDeleteFrimNiFiModalOpen: false,
  ansibleClusterProgressData: {},
  isFailedClusterDeleteModalOpen: false,
  ansibleClusterCreationResponseData: {},
  progressTrackingModalOpen: false,
  lastVisitedTab: 'clusters',
  clusterListItems: 10,
  allConfigPropertiesAndValue: {},
  clusterSetupSelectedNiFiVersion: null,
  multiNodesTestResults: {},
  testCertificateNodes: [],
  sshAddedStatus: {},
  narList: [],
  driversList: [],
  createClusterMethod: 'vm',
  kubernetesConfigFields: {},
  listConfigListKubernetes: [],
  kubeCofigToEdit: {},
  kubConfigVersion: [],
  kubeHostModalOpen: false,
  kubeClusterUpgradeData: {},
  isOpenDeleteKubeClusterModal: false,
  tourIndex: 0,
  tourStart: false,
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
  getIsRegitryAssociationModalOpen: state =>
    state.clusters.isRegitryAssociationModalOpen,
  isTestCredsButtonVisible: state => state.clusters.isTestCredsButtonVisible,
  getAnsibleClusterData: state => state.clusters.ansibleClusterData,
  getansibleClucterToEdit: state => state.clusters.ansibleClucterToEdit,
  getAnsibleClusterNodeUpdate: state => state.clusters.ansibleClusterNodeUpdate,
  getisAnsibleClusterDeleteFrimNiFiModalOpen: state =>
    state.clusters.isAnsibleClusterDeleteFrimNiFiModalOpen,
  getAnsibleClusterProgressData: state =>
    state.clusters.ansibleClusterProgressData,
  getIsFailedClusterDeleteModalOpen: state =>
    state.clusters.isFailedClusterDeleteModalOpen,
  getansibleClusterCreationResponseData: state =>
    state.clusters.ansibleClusterCreationResponseData,
  getProgressTrackingModalOpen: state =>
    state.clusters.progressTrackingModalOpen,
  getlastVisitedTab: state => state.clusters.lastVisitedTab,
  getClusterListItems: state => state.clusters.clusterListItems,
  getAllConfigPropertiesAndValue: state =>
    state.clusters.allConfigPropertiesAndValue,
  getClusterSetupSelectedNiFiVersion: state =>
    state.clusters.clusterSetupSelectedNiFiVersion,
  getmultiNodesTestResults: state => state.clusters.multiNodesTestResults,
  getTestCertificateNodes: state => state.clusters.testCertificateNodes,
  getsshAddedStatus: state => state.clusters.sshAddedStatus,
  getnarList: state => state.clusters.narList,
  getDriversList: state => state.clusters.driversList,
  getCreateClusterMethod: state => state.clusters.createClusterMethod,
  getKubernetesConfigFields: state => state.clusters.kubernetesConfigFields,
  getlistConfigListKubernetes: state => state.clusters.listConfigListKubernetes,
  getkubeCofigToEdit: state => state.clusters.kubeCofigToEdit,
  getkubConfigVersion: state => state.clusters.kubConfigVersion,
  getkubeHostModalOpen: state => state.clusters.kubeHostModalOpen,
  getkubeClusterUpgradeData: state => state.clusters.kubeClusterUpgradeData,
  getisOpenDeleteKubeClusterModal: state =>
    state.clusters.isOpenDeleteKubeClusterModal,
  getTourIndex: state => state.clusters.tourIndex,
  getTourStart: state => state.clusters.tourStart,
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

const setisAnsibleClusterDeleteFrimNiFiModalOpen = (state, { payload }) => {
  return {
    ...state,
    isAnsibleClusterDeleteFrimNiFiModalOpen: payload,
  };
};
const setansibleClusterProgressData = (state, { payload }) => {
  return {
    ...state,
    ansibleClusterProgressData: payload,
  };
};
const setIsFailedClusterDeleteModalOpen = (state, { payload }) => {
  return {
    ...state,
    isFailedClusterDeleteModalOpen: payload,
  };
};
const setAnsibleClusterCreationResponseData = (state, { payload }) => {
  return {
    ...state,
    ansibleClusterCreationResponseData: payload,
  };
};

const setProgressTrackingModalOpen = (state, { payload }) => {
  return {
    ...state,
    progressTrackingModalOpen: payload,
  };
};
const setLastVisitedTab = (state, { payload }) => {
  return {
    ...state,
    lastVisitedTab: payload,
  };
};
const setclusterListItems = (state, { payload }) => {
  return {
    ...state,
    clusterListItems: payload,
  };
};

const setAllConfigPropertiesAndValue = (state, { payload }) => {
  return {
    ...state,
    allConfigPropertiesAndValue: payload,
  };
};
const setClusterSetupSelectedNiFiVersion = (state, { payload }) => {
  return {
    ...state,
    clusterSetupSelectedNiFiVersion: payload,
  };
};
const setMultiNodesTestResults = (state, { payload }) => {
  return {
    ...state,
    multiNodesTestResults: payload,
  };
};
const setTestCertificateNodes = (state, { payload }) => {
  return {
    ...state,
    testCertificateNodes: payload,
  };
};
const setSshAddedStatus = (state, { payload }) => {
  return {
    ...state,
    sshAddedStatus: payload,
  };
};
const setNarList = (state, { payload }) => {
  return {
    ...state,
    narList: payload,
  };
};
const setDriversList = (state, { payload }) => {
  return {
    ...state,
    driversList: payload,
  };
};
const setCreateClusterMethod = (state, { payload }) => {
  return {
    ...state,
    createClusterMethod: payload,
  };
};
const setKubernetesConfigFields = (state, { payload }) => {
  return {
    ...state,
    kubernetesConfigFields: payload,
  };
};
const setListConfigListKubernetes = (state, { payload }) => {
  return {
    ...state,
    listConfigListKubernetes: payload,
  };
};
const setkubeCofigToEdit = (state, { payload }) => {
  return {
    ...state,
    kubeCofigToEdit: payload,
  };
};
const setkubConfigVersion = (state, { payload }) => {
  return {
    ...state,
    kubConfigVersion: payload,
  };
};
const setkubeHostModalOpen = (state, { payload }) => {
  return {
    ...state,
    kubeHostModalOpen: payload,
  };
};
const setkubeClusterUpgradeData = (state, { payload }) => {
  return {
    ...state,
    kubeClusterUpgradeData: payload,
  };
};
const setIsOpenDeleteKubeClusterModal = (state, { payload }) => {
  return {
    ...state,
    isOpenDeleteKubeClusterModal: payload,
  };
};
const setTourIndex = (state, { payload }) => {
  return {
    ...state,
    tourIndex: payload,
  };
};
const setTourStart = (state, { payload }) => {
  return {
    ...state,
    tourStart: payload,
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
      // Check service-account credentials
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
      )
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
      )
      .addCase(
        ClustersActions.setansibleClusterProgressData,
        setansibleClusterProgressData
      )
      .addCase(
        ClustersActions.setIsFailedClusterDeleteModalOpen,
        setIsFailedClusterDeleteModalOpen
      )
      .addCase(
        ClustersActions.setAnsibleClusterCreationResponseData,
        setAnsibleClusterCreationResponseData
      )
      .addCase(
        ClustersActions.setProgressTrackingModalOpen,
        setProgressTrackingModalOpen
      )
      .addCase(ClustersActions.setLastVisitedTab, setLastVisitedTab)
      .addCase(ClustersActions.setclusterListItems, setclusterListItems)
      .addCase(
        ClustersActions.setAllConfigPropertiesAndValue,
        setAllConfigPropertiesAndValue
      )
      .addCase(
        ClustersActions.setClusterSetupSelectedNiFiVersion,
        setClusterSetupSelectedNiFiVersion
      )
      .addCase(
        ClustersActions.setMultiNodesTestResults,
        setMultiNodesTestResults
      )
      .addCase(ClustersActions.setTestCertificateNodes, setTestCertificateNodes)
      .addCase(ClustersActions.setSshAddedStatus, setSshAddedStatus)
      .addCase(ClustersActions.setNarList, setNarList)
      .addCase(ClustersActions.setDriversList, setDriversList)
      .addCase(ClustersActions.setCreateClusterMethod, setCreateClusterMethod)
      .addCase(
        ClustersActions.setKubernetesConfigFields,
        setKubernetesConfigFields
      )
      .addCase(
        ClustersActions.setListConfigListKubernetes,
        setListConfigListKubernetes
      )
      .addCase(ClustersActions.setkubeCofigToEdit, setkubeCofigToEdit)
      .addCase(ClustersActions.setkubConfigVersion, setkubConfigVersion)
      .addCase(ClustersActions.setkubeHostModalOpen, setkubeHostModalOpen)
      .addCase(
        ClustersActions.setkubeClusterUpgradeData,
        setkubeClusterUpgradeData
      )
      .addCase(
        ClustersActions.setIsOpenDeleteKubeClusterModal,
        setIsOpenDeleteKubeClusterModal
      )
      .addCase(ClustersActions.setTourIndex, setTourIndex)
      .addCase(ClustersActions.setTourStart, setTourStart);
  }
);
