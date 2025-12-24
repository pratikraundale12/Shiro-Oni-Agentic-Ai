import { isEmpty } from 'lodash';
import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesActions, NamespacesSelectors } from '../namespaces';
import { ClustersActions, ClustersSelectors } from './redux';
import { toast } from 'react-toastify';
import { history } from '../../helpers/history';
import { GridActions } from '../grid';
import { showErrorToast } from '../../utils/toastControl';

export function* fetchClusterList(api, { payload: { params } = {} }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);

  yield call(requestSaga, {
    errorSection: 'fetchClusterList',
    loadingSection: 'fetchClusterList',
    apiMethod: api.fetchClusterList,
    apiParams: [{ params }],
    successAction: ClustersActions.fetchClusterListSuccess,
  });
  const clusterData = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN)) || [];

  if (!isEmpty(clusterData[0]) && isEmpty(selectedCluster)) {
    yield put(
      NamespacesActions.setSelectedCluster({
        label: clusterData[0]?.name,
        value: clusterData[0]?.id,
      })
    );
  }
}
export function* fetchClusters(api, { params }) {
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');

  const response = yield call(requestSaga, {
    errorSection: 'fetchClusters',
    loadingSection: 'fetchClusters',
    apiMethod: api.fetchClusters,
    apiParams: [{ params, payload: clusters }],
    successAction: ClustersActions.fetchClustersSuccess,
  });
  if (!response?.ok) {
    const message = response?.data?.message;
    if (message) {
      showErrorToast(message);
    }
  }
}

export function* fetchClusterNodes(api, { payload }) {
  yield call(requestSaga, {
    errorSection: 'fetchClusterNodes',
    loadingSection: 'fetchClusterNodes',
    apiMethod: api.fetchClusterNodes,
    apiParams: [payload],
    successAction: ClustersActions.fetchClusterNodesSuccess,
  });
}

export function* clusterLogout(api, { payload }) {
  if (payload?.id) {
    yield call(requestSaga, {
      errorSection: 'clusterLogout',
      loadingSection: 'clusterLogout',
      apiMethod: api.clusterLogout,
      apiParams: [
        { clusterId: payload?.id, payload: { token: payload?.token } },
      ],
      successAction: ClustersActions.clusterLogout,
    });
  }
}
export function* checkServiceAccountCredentials(api, { payload }) {
  const { clusterId, formData } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'checkServiceAccountCredentials',
    loadingSection: 'checkServiceAccountCredentials',
    apiMethod: api.createClusterServiceAcc,
    apiParams: [{ clusterId, payload: formData }],
  });

  if (response?.ok) {
    yield put(ClustersActions.checkServiceAccountCredentialsSuccess());
    toast.success('Credentials validated');
  } else {
    yield put(
      ClustersActions.checkServiceAccountCredentialsFailure(
        response?.data?.message
      )
    );
    toast.error(response?.data?.message);
  }
}

export function* addServiceAccountHost(api, { payload }) {
  try {
    const { clusterId, formData } = payload;

    if (!clusterId || !formData) {
      console.error('Invalid clusterId or formData');
      toast.error('Invalid cluster ID or form data');
      return;
    }

    const response = yield call(requestSaga, {
      errorSection: 'addServiceAccountHost',
      loadingSection: 'addServiceAccountHost',
      apiMethod: api.createClusterServiceAcc,
      apiParams: [{ clusterId, payload: formData }],
    });

    if (response.ok) {
      yield put(ClustersActions.addServiceAccountHostSuccess(response.data));
      toast.success('Saved successfully');
    } else {
      console.error('addServiceAccountHost: API error:', response.data.message);
      yield put(
        ClustersActions.addServiceAccountHostFailure(response.data.message)
      );
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error('addServiceAccountHost: Saga error:', error);
    toast.error('An error occurred while adding the host');
  }
}

export function* updateServiceAccountHost(api, { payload }) {
  const { clusterId, formData } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'updateServiceAccountHost',
    loadingSection: 'updateServiceAccountHost',
    apiMethod: api.updateClusterServiceAcc,
    apiParams: [{ clusterId, payload: formData }],
  });

  if (response?.ok) {
    yield put(
      ClustersActions.updateServiceAccountHostSuccess(response?.data?.message)
    );
    toast.success('Saved successfully');
  } else {
    yield put(
      ClustersActions.updateServiceAccountHostFailure(response?.data?.message)
    );
    toast.error(response?.data?.message);
  }
}

export function* getNiFiVersions(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'getNiFiVersions',
    loadingSection: 'getNiFiVersions',
    apiMethod: api.getNiFiVersions,
    apiParams: [payload],
  });
  if (response?.ok) {
    yield put(ClustersActions.setNifiVersions(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}
export function* checkCredentialsClusterSetup(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'checkCredentialsClusterSetup',
    loadingSection: 'checkCredentialsClusterSetup',
    apiMethod: api.checkCredentialsClusterSetup,
    apiParams: [{ payload: payload?.payload }],
  });
  if (response.ok) {
    toast.success(
      'Connection established successfully. The credentials are valid and the host is reachable.'
    );
    yield put(ClustersActions.setAddHostBtnDisable(false));
    yield put(ClustersActions.setAddHostIndividualData(payload?.data));
  } else {
    toast.error(
      'Unable to establish a connection with the host. Please check your credentials.'
    );
  }
}

export function* fetchHostNodesList(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchHostNodesList',
    loadingSection: 'fetchHostNodesList',
    apiMethod: api.fetchHostNodesList,
    apiParams: [
      {
        clusterId: payload?.clusterId,
        update_node: payload?.update_node,
        payload: payload?.selected,
      },
    ],
  });
  if (response.ok) {
    yield put(ClustersActions.setHostIpList(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}
export function* fetchMasterHostNodesList(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchMasterHostNodesList',
    loadingSection: 'fetchMasterHostNodesList',
    apiMethod: api.fetchMasterHostNodesList,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    yield put(ClustersActions.setHostIpList(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}

export function* addIndividualHost(api, { payload }) {
  const createClusterVisKubernetes = yield select(
    ClustersSelectors.getCreateClusterMethod
  );
  const response = yield call(requestSaga, {
    errorSection: 'addIndividualHost',
    loadingSection: 'addIndividualHost',
    apiMethod: api.addIndividualHost,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    toast.success('Node Added Successfully');
    yield put(ClustersActions.setIsAddHostIPModalOpen(false));
    if (createClusterVisKubernetes === 'VM') {
      yield put(
        ClustersActions.fetchHostNodesList({
          selected: true,
          clusterId: null,
          update_node: false,
        })
      );
    } else {
      yield put(ClustersActions.fetchMasterHostNodesList());
    }
  } else {
    toast.error(response?.data?.message);
    yield put(ClustersActions.setIsAddHostIPModalOpen(false));
  }
}
export function* deleteIndividualHost(api, { payload }) {
  const createClusterVisKubernetes = yield select(
    ClustersSelectors.getCreateClusterMethod
  );
  const response = yield call(requestSaga, {
    errorSection: 'deleteIndividualHost',
    loadingSection: 'deleteIndividualHost',
    apiMethod: api.deleteIndividualHost,
    apiParams: [{ hostId: payload?.hostId }],
  });
  if (response.ok) {
    toast.success('Deleted Successfully');
    if (createClusterVisKubernetes === 'VM') {
      yield put(
        ClustersActions.fetchHostNodesList({
          selected: true,
          clusterId: null,
          update_node: false,
        })
      );
    } else {
      yield put(ClustersActions.fetchMasterHostNodesList());
    }
  } else {
    toast.error(response?.data?.message);
  }
}
export function* updateIndividualHost(api, { payload }) {
  const createClusterVisKubernetes = yield select(
    ClustersSelectors.getCreateClusterMethod
  );
  const response = yield call(requestSaga, {
    errorSection: 'updateIndividualHost',
    loadingSection: 'updateIndividualHost',
    apiMethod: api.updateIndividualHost,
    apiParams: [{ hostId: payload?.hostId, payload: payload?.payload }],
  });
  if (response.ok) {
    toast.success('Node Updated Successfully');
    yield put(ClustersActions.setIsAddHostIPModalOpen(false));
    if (payload?.callForSSH) {
      yield put(
        ClustersActions.fetchHostNodesList({
          selected: false,
          clusterId: payload?.clusterId,
          update_node: false,
        })
      );
      yield put(ClustersActions.fetchSSHstatus(payload?.clusterId));
    } else if (createClusterVisKubernetes === 'VM') {
      yield put(
        ClustersActions.fetchHostNodesList({
          selected: true,
          clusterId: null,
          update_node: false,
        })
      );
    } else {
      yield put(ClustersActions.fetchMasterHostNodesList());
    }
  } else {
    toast.error(response?.data?.message);
    yield put(ClustersActions.setIsAddHostIPModalOpen(false));
  }
}
export function* getConfigList(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'getConfigList',
    loadingSection: 'getConfigList',
    apiMethod: api.getConfigList,
    apiParams: [{ nifiVersion: payload }],
  });
  if (response?.ok) {
    yield put(ClustersActions.setConfigNameList(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}

export function* addConfigClusterSetup(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'addConfigClusterSetup',
    loadingSection: 'addConfigClusterSetup',
    apiMethod: api.addConfigClusterSetup,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    toast.success('Config Added Successfully');
    yield put(ClustersActions.updateConfigClusterSetup({}));
    yield call(history.push, '/clusters/setup-cluster');
  } else {
    toast.error(response?.data?.message);
  }
}

export function* deleteConfig(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteConfig',
    loadingSection: 'deleteConfig',
    apiMethod: api.deleteConfig,
    apiParams: [{ configId: payload?.configId }],
  });
  if (response.ok) {
    toast.success('Deleted Successfully');
    yield put(ClustersActions.getConfigList());
  } else {
    toast.error(response?.data?.message);
  }
}
export function* getConfigVersions(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'getConfigVersions',
    loadingSection: 'getConfigVersions',
    apiMethod: api.getConfigVersions,
    apiParams: [{ configName: payload }],
  });
  if (response?.ok) {
    yield put(ClustersActions.setConfigVersionList(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}

export function* createCluster(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createCluster',
    loadingSection: 'createCluster',
    apiMethod: api.createCluster,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    toast.success(response?.data?.message);
    yield call(history.push, '/clusters');
    yield put(ClustersActions.setProgressTrackingModalOpen(true));
    yield put(
      ClustersActions.setAnsibleClusterCreationResponseData(response?.data)
    );
  } else {
    toast.error(response?.data?.message);
    yield call(history.push, '/clusters');
  }
}
export function* getSingleConfigData(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'getSingleConfigData',
    loadingSection: 'getSingleConfigData',
    apiMethod: api.getSingleConfigData,
    apiParams: [{ configId: payload }],
  });
  if (response?.ok) {
    yield put(ClustersActions.updateConfigClusterSetup(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}

export function* changeClusterActionState(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'changeClusterActionState',
    loadingSection: 'changeClusterActionState',
    apiMethod: api.changeClusterActionState,
    apiParams: [{ clusterId: payload?.clusterId, payload: payload?.data }],
  });
  if (response.ok) {
    toast.success(response?.data?.message);
  } else {
    toast.error(response?.data?.message);
  }
}

export function* fetchClusterRegistryNodes(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchClusterRegistryNodes',
    loadingSection: 'fetchClusterRegistryNodes',
    apiMethod: api.fetchClusterRegistryNodes,
    apiParams: [{ clusterId: payload }],
  });
  if (response?.ok) {
    yield put(ClustersActions.setRegistryNodesData(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}

export function* fetchRunningStatusCluster(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchRunningStatusCluster',
    loadingSection: 'fetchRunningStatusCluster',
    apiMethod: api.fetchRunningStatusCluster,
    apiParams: [{ clusterId: payload }],
  });
  if (response?.ok) {
    yield put(ClustersActions.setRunningStatusData(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}

export function* fetchClusterMetrics(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchClusterMetrics',
    loadingSection: 'fetchClusterMetrics',
    apiMethod: api.fetchClusterMetrics,
    apiParams: [{ clusterId: payload }],
  });
  if (response?.ok) {
    yield put(ClustersActions.setHealthMetricsData(response?.data));
  } else {
    toast.error(response?.data?.message);
  }
}
export function* associateClusterWithRegistry(api, { payload }) {
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item?.id === payload?.clusterId
  );
  const loggedInCluster = yield select(NamespacesSelectors.getSelectedCluster);
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'associateClusterWithRegistry',
    loadingSection: 'associateClusterWithRegistry',
    apiMethod: api.associateClusterWithRegistry,
    apiParams: [{ clusterId: payload?.clusterId, payload: payload?.payload }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message);
    yield put(ClustersActions.setIsRegitryAssociationModalOpen(false));
    yield put(
      GridActions.fetchGrid({
        module: 'clusters',
        params: {},
      })
    );

    yield put(ClustersActions.setProgressTrackingModalOpen(true));
    yield put(
      ClustersActions.setAnsibleClusterCreationResponseData(response?.data)
    );
    if (
      loggedInCluster?.value == payload?.clusterId &&
      payload?.created_by_ansible
    ) {
      yield put(
        NamespacesActions.setSelectedCluster({
          label: '',
          value: '',
        })
      );
      localStorage.removeItem('selected_cluster');
    }
  } else {
    toast.error(response?.data?.message);
  }
}

export function* fetchAnsibleClusterData(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchAnsibleClusterData',
    loadingSection: 'fetchAnsibleClusterData',
    apiMethod: api.fetchAnsibleClusterData,
    apiParams: [{ clusterId: payload }],
  });
  if (response?.ok) {
    yield put(ClustersActions.setAnsibleClusterData(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}
export function* upgradeAnsibleCluster(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'upgradeAnsibleCluster',
    loadingSection: 'upgradeAnsibleCluster',
    apiMethod: api.upgradeAnsibleCluster,
    apiParams: [{ clusterId: payload?.clusterId, payload: payload?.payload }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message);
    yield call(history.push, '/clusters');
    yield put(ClustersActions.setProgressTrackingModalOpen(true));
    yield put(
      ClustersActions.setAnsibleClusterCreationResponseData(response?.data)
    );
  } else {
    toast.error(response?.data?.error);
  }
}
export function* updateNodesAnsibleCluster(api, { payload }) {
  const loggedInCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const response = yield call(requestSaga, {
    errorSection: 'updateNodesAnsibleCluster',
    loadingSection: 'updateNodesAnsibleCluster',
    apiMethod: api.updateNodesAnsibleCluster,
    apiParams: [{ clusterId: payload?.clusterId, payload: payload?.payload }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message);
    yield call(history.push, '/clusters');
    yield put(ClustersActions.setProgressTrackingModalOpen(true));
    yield put(
      ClustersActions.setAnsibleClusterCreationResponseData(response?.data)
    );
    if (loggedInCluster?.value == payload?.clusterId) {
      yield put(
        NamespacesActions.setSelectedCluster({
          label: '',
          value: '',
        })
      );
      localStorage.removeItem('selected_cluster');
    }
  } else {
    toast.error(response?.data?.error);
  }
}

export function* deleteAnsibleClusterHard(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteAnsibleClusterHard',
    loadingSection: 'deleteAnsibleClusterHard',
    apiMethod: api.deleteAnsibleClusterHard,
    apiParams: [{ clusterId: payload?.clusterId }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message);
    yield put(
      ClustersActions.setisAnsibleClusterDeleteFrimNiFiModalOpen(false)
    );
    yield put(ClustersActions.setIsFailedClusterDeleteModalOpen(false));
    yield put(
      GridActions.fetchGrid({
        module: 'clusters',
        params: {},
      })
    );
    yield put(ClustersActions.setProgressTrackingModalOpen(true));
    yield put(
      ClustersActions.setAnsibleClusterCreationResponseData(response?.data)
    );
  } else {
    toast.error(response?.data?.error);
  }
}

export function* fetchAnsibleCLusterProcessData(api, { payload }) {
  const { cluster_type } = payload || {};
  const response = yield call(requestSaga, {
    errorSection: 'fetchAnsibleCLusterProcessData',
    loadingSection: 'fetchAnsibleCLusterProcessData',
    apiMethod: api.fetchAnsibleCLusterProcessData,
    apiParams: [
      {
        clusterId: payload?.clusterId,
        process_id: payload?.process_id,
        process_name: payload?.process_name,
        ...(cluster_type && { cluster_type }),
      },
    ],
  });
  if (response?.ok) {
    yield put(ClustersActions.setansibleClusterProgressData(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}
export function* fetchAllConfigPropertiesWithValue(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchAllConfigPropertiesWithValue',
    loadingSection: 'fetchAllConfigPropertiesWithValue',
    apiMethod: api.fetchAllConfigPropertiesWithValue,
    apiParams: [
      {
        version: payload?.version,
      },
    ],
  });
  if (response?.ok) {
    yield put(ClustersActions.setAllConfigPropertiesAndValue(response?.data));
  } else {
    toast.error(response?.data?.message);
  }
}
export function* testMultipleNodes(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'testMultipleNodes',
    loadingSection: 'testMultipleNodes',
    apiMethod: api.testMultipleNodes,
    apiParams: [{ payload: payload?.payload }],
  });
  if (response?.ok) {
    //
    toast.success(response?.data?.message || 'Tested Successfully');
    yield put(ClustersActions.setAddHostBtnDisable(false));
    yield put(ClustersActions.setMultiNodesTestResults(response?.data));
  } else {
    toast.error(response?.data?.message);
  }
}
export function* fetchConfigFieldsForKubernetes(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchConfigFieldsForKubernetes',
    loadingSection: 'fetchConfigFieldsForKubernetes',
    apiMethod: api.fetchConfigFieldsForKubernetes,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    yield put(ClustersActions.setKubernetesConfigFields(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}
export function* createConfigForKubernetesCluster(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createConfigForKubernetesCluster',
    loadingSection: 'createConfigForKubernetesCluster',
    apiMethod: api.createConfigForKubernetesCluster,
    apiParams: [{ payload: payload }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message);
    yield call(history.push, '/clusters/setup-cluster');
  } else {
    toast.error(response?.data?.message);
  }
}
export function* fetchConfigListForKubernetes(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchConfigListForKubernetes',
    loadingSection: 'fetchConfigListForKubernetes',
    apiMethod: api.fetchConfigListForKubernetes,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    yield put(ClustersActions.setListConfigListKubernetes(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}
export function* deleteKubeConfig(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteKubeConfig',
    loadingSection: 'deleteKubeConfig',
    apiMethod: api.deleteKubeConfig,
    apiParams: [{ id: payload?.id }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message);
    yield put(ClustersActions.fetchConfigListForKubernetes());
  } else {
    toast.error(response?.data?.error);
  }
}
export function* createKubernetesCluster(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createKubernetesCluster',
    loadingSection: 'createKubernetesCluster',
    apiMethod: api.createKubernetesCluster,
    apiParams: [{ payload: payload }],
  });
  if (response?.ok) {
    yield put(ClustersActions.setCreateLoadingState(false));
    toast.success(response?.data?.message);
    yield call(history.push, '/clusters');
    yield put(ClustersActions.setProgressTrackingModalOpen(true));
    yield put(
      ClustersActions.setAnsibleClusterCreationResponseData(response?.data)
    );
  } else {
    toast.error(response?.data?.message);
  }
  yield put(ClustersActions.setCreateLoadingState(false));
}
export function* fetchConfigVersionsPerConfig(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchConfigVersionsPerConfig',
    loadingSection: 'fetchConfigVersionsPerConfig',
    apiMethod: api.fetchConfigVersionsPerConfig,
    apiParams: [{ config_name: payload?.config_name }],
  });
  if (response?.ok) {
    yield put(ClustersActions.setkubConfigVersion(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}
export function* createKubernetesMasterNodeCluster(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createKubernetesMasterNodeCluster',
    loadingSection: 'createKubernetesMasterNodeCluster',
    apiMethod: api.createKubernetesMasterNodeCluster,
    apiParams: [{ payload: payload }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message);
    yield put(ClustersActions.setkubeHostModalOpen(false));
    yield put(ClustersActions.fetchMasterHostNodesList());
  } else {
    toast.error(response?.data?.message);
  }
}
export function* deleteMasterNodeConfig(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteMasterNodeConfig',
    loadingSection: 'deleteMasterNodeConfig',
    apiMethod: api.deleteMasterNodeConfig,
    apiParams: [{ id: payload?.hostId }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message);
    yield put(ClustersActions.fetchMasterHostNodesList());
  } else {
    toast.error(response?.data?.error);
  }
}
export function* fetchKubeClusterDataToUpgrade(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchKubeClusterDataToUpgrade',
    loadingSection: 'fetchKubeClusterDataToUpgrade',
    apiMethod: api.fetchKubeClusterDataToUpgrade,
    apiParams: [{ id: payload?.id }],
  });
  if (response?.ok) {
    yield put(ClustersActions.setkubeClusterUpgradeData(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}

export function* updateMultipleNodeswithSSH(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'updateMultipleNodeswithSSH',
    loadingSection: 'updateMultipleNodeswithSSH',
    apiMethod: api.updateMultipleNodeswithSSH,
    apiParams: [{ id: payload?.id, payload: payload?.payload }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message || 'Tested Successfully');
    yield put(
      ClustersActions.fetchHostNodesList({
        selected: false,
        clusterId: payload?.id,
        update_node: false,
      })
    );
    yield put(ClustersActions.fetchSSHstatus(payload?.id));
  } else {
    toast.error(response?.data?.error);
  }
}
export function* fetchSSHstatus(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchSSHstatus',
    loadingSection: 'fetchSSHstatus',
    apiMethod: api.fetchSSHstatus,
    apiParams: [
      {
        clusterId: payload,
      },
    ],
  });
  if (response?.ok) {
    yield put(ClustersActions.setSshAddedStatus(response?.data));
  } else {
    toast.error(response?.data?.message);
  }
}
export function* addNarFile(api, { payload }) {
  const restartAfterUpload = yield select(
    ClustersSelectors.getrestartClusterAfterAction
  );

  const loggedInCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const response = yield call(requestSaga, {
    errorSection: 'addNarFile',
    loadingSection: 'addNarFile',
    apiMethod: api.addNarFile,
    apiParams: [
      {
        clusterId: payload?.id,
        payload: payload?.payload,
        restart: restartAfterUpload,
      },
    ],
  });

  if (response?.ok) {
    toast.success(response?.data?.message || 'Added Successfully');

    if (restartAfterUpload) {
      yield put(
        ClustersActions.restartCluster({
          id: payload?.id,
          payload: {},
        })
      );
      if (loggedInCluster?.value == payload?.id) {
        yield put(
          NamespacesActions.setSelectedCluster({
            label: '',
            value: '',
          })
        );
        localStorage.removeItem('selected_cluster');
      }
    } else {
      yield put(ClustersActions.fetchNarList(payload?.id));
    }
  } else {
    toast.error(response?.data?.message);
  }
}

export function* fetchNarList(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchNarList',
    loadingSection: 'fetchNarList',
    apiMethod: api.fetchNarList,
    apiParams: [
      {
        clusterId: payload,
      },
    ],
  });
  if (response?.ok) {
    yield put(ClustersActions.setNarList(response?.data));
  } else {
    toast.error(response?.data?.message);
  }
}

export function* restartCluster(api, { payload }) {
  yield put(ClustersActions.setRestartDelayLoadingState(true));
  const restartAfterUpload = yield select(
    ClustersSelectors.getrestartClusterAfterAction
  );
  const response = yield call(requestSaga, {
    errorSection: 'restartCluster',
    loadingSection: 'restartCluster',
    apiMethod: api.restartCluster,
    apiParams: [{ clusterId: payload?.id, payload: payload?.payload }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message || 'Added Successfully');
    if (restartAfterUpload) {
      yield delay(10000);
      yield put(ClustersActions.fetchNarList(payload?.id));
      yield put(ClustersActions.setRestartDelayLoadingState(false));
    }
    // yield put(ClustersActions.fetchNarList(payload?.id));
  } else {
    toast.error(response?.data?.error);
  }
}
export function* uploadClusterDriver(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'uploadClusterDriver',
    loadingSection: 'uploadClusterDriver',
    apiMethod: api.uploadClusterDriver,
    apiParams: [{ clusterId: payload?.id, payload: payload?.payload }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message || 'Added Successfully');
    yield put(ClustersActions.fetchDriversList(payload?.id));
  } else {
    toast.error(response?.data?.message);
  }
}
export function* fetchDriversList(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchDriversList',
    loadingSection: 'fetchDriversList',
    apiMethod: api.fetchDriversList,
    apiParams: [
      {
        clusterId: payload,
      },
    ],
  });
  if (response?.ok) {
    yield put(ClustersActions.setDriversList(response?.data));
  } else {
    toast.error(response?.data?.message);
  }
}
export function* deleteClusterKube(api, { payload }) {
  const deleteType = payload?.deleteType || 'db_only';

  const response = yield call(requestSaga, {
    errorSection: 'deleteClusterKube',
    loadingSection: 'deleteClusterKube',
    apiMethod: api.deleteClusterKube,
    apiParams: [
      {
        clusterIdToDelete: payload?.clusterIdToDelete,
        deleteType,
        payload: payload?.payloadData,
      },
    ],
  });
  if (response.ok) {
    toast.success('Cluster deleted Successfully');
    yield put(
      GridActions.fetchGrid({
        module: 'clusters',
        params: { page: 1, sort: 'name', limit: 10 },
      })
    );
    yield put(ClustersActions.setIsOpenDeleteKubeClusterModal(false));
    if (deleteType === 'nifi_uninstall') {
      yield put(ClustersActions.setProgressTrackingModalOpen(true));
    }
    yield put(
      ClustersActions.setAnsibleClusterCreationResponseData(response?.data)
    );
  } else {
    toast.error(response?.message || response?.data?.message);
  }
}

export function* deleteClusterNarFile(api, { payload }) {
  const restartAfterUpload = yield select(
    ClustersSelectors.getrestartClusterAfterAction
  );

  const loggedInCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const response = yield call(requestSaga, {
    errorSection: 'deleteClusterNarFile',
    loadingSection: 'deleteClusterNarFile',
    apiMethod: api.deleteClusterNarFile,
    apiParams: [
      {
        id: payload?.id,
        narId: payload?.narId,
        restart: restartAfterUpload,
      },
    ],
  });
  if (response?.ok) {
    toast.success(response?.data?.message || 'Deleted Successfully');
    if (restartAfterUpload) {
      yield put(
        ClustersActions.restartCluster({
          id: payload?.id,
          payload: {},
        })
      );
      if (loggedInCluster?.value == payload?.id) {
        yield put(
          NamespacesActions.setSelectedCluster({
            label: '',
            value: '',
          })
        );
        localStorage.removeItem('selected_cluster');
      }
    } else {
      yield put(ClustersActions.fetchNarList(payload?.id));
    }
  } else {
    toast.error(response?.data?.message);
  }
}

export function* deleteClusterDriverFile(api, { payload }) {
  const restartAfterUpload = yield select(
    ClustersSelectors.getrestartClusterAfterAction
  );
  const loggedInCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const response = yield call(requestSaga, {
    errorSection: 'deleteClusterDriverFile',
    loadingSection: 'deleteClusterDriverFile',
    apiMethod: api.deleteClusterDriverFile,
    apiParams: [
      {
        id: payload?.id,
        driverId: payload?.driverId,
        restart: payload?.restart,
      },
    ],
  });
  if (response?.ok) {
    toast.success(response?.data?.message || 'Deleted Successfully');
    if (restartAfterUpload) {
      yield put(
        ClustersActions.restartCluster({
          id: payload?.id,
          payload: {},
        })
      );
      if (loggedInCluster?.value == payload?.id) {
        yield put(
          NamespacesActions.setSelectedCluster({
            label: '',
            value: '',
          })
        );
        localStorage.removeItem('selected_cluster');
      }
    }
    yield put(ClustersActions.fetchDriversList(payload?.id));
  } else {
    toast.error(response?.data?.message);
  }
}

export function* fetchKubePodStatus(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchKubePodStatus',
    loadingSection: 'fetchKubePodStatus',
    apiMethod: api.fetchKubePodStatus,
    apiParams: [
      {
        id: payload,
      },
    ],
  });
  if (response?.ok) {
    yield put(ClustersActions.setKubePods(response?.data));
  } else {
    toast.error(response?.data?.message);
  }
}
export function* fetchKubeHealth(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchKubeHealth',
    loadingSection: 'fetchKubeHealth',
    apiMethod: api.fetchKubeHealth,
    apiParams: [
      {
        id: payload?.id,
        pod: payload?.pod,
      },
    ],
  });
  if (response?.ok) {
    yield put(ClustersActions.setKubePodHealth(response?.data));
  } else {
    toast.error(response?.data?.message);
  }
}
export function* updateKubeConfigQuickEdit(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'updateKubeConfigQuickEdit',
    loadingSection: 'updateKubeConfigQuickEdit',
    apiMethod: api.updateKubeConfigQuickEdit,
    apiParams: [{ payload: payload }],
  });
  if (response?.ok) {
    yield put(ClustersActions.setUpdatedKubeConfig(response?.data));
  } else {
    toast.error(response?.data?.message);
  }
}

export function* addScript(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'addScript',
    loadingSection: 'addScript',
    apiMethod: api.addScript,
    apiParams: [{ clusterId: payload?.id, payload: payload?.payload }],
  });
  if (response?.ok) {
    toast.success(response?.data?.message || 'Added Successfully');
    yield put(ClustersActions.fetchScriptList(payload?.id));
  } else {
    toast.error(response?.data?.message);
  }
}

export function* fetchScriptList(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchScriptList',
    loadingSection: 'fetchScriptList',
    apiMethod: api.fetchScriptList,
    apiParams: [
      {
        clusterId: payload,
      },
    ],
  });
  if (response?.ok) {
    yield put(ClustersActions.setScriptList(response?.data));
  } else {
    toast.error(response?.data?.message);
  }
}

export function* deleteClusterScript(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteClusterScript',
    loadingSection: 'deleteClusterScript',
    apiMethod: api.deleteClusterScript,
    apiParams: [
      {
        id: payload?.id,
        narId: payload?.narId,
      },
    ],
  });
  if (response?.ok) {
    toast.success(response?.data?.message || 'Deleted Successfully');
    yield put(ClustersActions.fetchScriptList(payload?.id));
  } else {
    toast.error(response?.data?.message);
  }
}
export function* testAzureConfig(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'testAzureConfig',
    loadingSection: 'testAzureConfig',
    apiMethod: api.testAzureConfig,
    apiParams: [{ payload: payload }],
  });
  if (response?.ok) {
    toast.success(
      response?.data?.message || 'Credentials valid & resource group accessible'
    );

    yield put(ClustersActions.setAzureTestPassed(true));
  } else {
    toast.error(response?.data?.message);
  }
}
export function* clustersSagas(api) {
  yield all([
    takeLatest(
      ClustersActions.checkServiceAccountCredentialsRequest,
      checkServiceAccountCredentials,
      api
    ),
    takeLatest(
      ClustersActions.addServiceAccountHostRequest,
      addServiceAccountHost,
      api
    ),
    takeLatest(
      ClustersActions.updateServiceAccountHostRequest,
      updateServiceAccountHost,
      api
    ),
    takeLatest(ClustersActions.fetchClusterList, fetchClusterList, api),
    takeLatest(ClustersActions.fetchClusterNodes, fetchClusterNodes, api),
    takeLatest(ClustersActions.fetchClusters, fetchClusters, api),
    takeLatest(ClustersActions.clusterLogout, clusterLogout, api),
    takeLatest(ClustersActions.getNiFiVersions, getNiFiVersions, api),
    takeLatest(
      ClustersActions.checkCredentialsClusterSetup,
      checkCredentialsClusterSetup,
      api
    ),
    takeLatest(ClustersActions.fetchHostNodesList, fetchHostNodesList, api),
    takeLatest(ClustersActions.addIndividualHost, addIndividualHost, api),
    takeLatest(ClustersActions.deleteIndividualHost, deleteIndividualHost, api),
    takeLatest(ClustersActions.updateIndividualHost, updateIndividualHost, api),
    takeLatest(ClustersActions.getConfigList, getConfigList, api),
    takeLatest(
      ClustersActions.addConfigClusterSetup,
      addConfigClusterSetup,
      api
    ),
    takeLatest(ClustersActions.deleteConfig, deleteConfig, api),
    takeLatest(ClustersActions.getConfigVersions, getConfigVersions, api),
    takeLatest(ClustersActions.createCluster, createCluster, api),
    takeLatest(ClustersActions.getSingleConfigData, getSingleConfigData, api),
    takeLatest(
      ClustersActions.changeClusterActionState,
      changeClusterActionState,
      api
    ),
    takeLatest(
      ClustersActions.fetchClusterRegistryNodes,
      fetchClusterRegistryNodes,
      api
    ),
    takeLatest(
      ClustersActions.fetchRunningStatusCluster,
      fetchRunningStatusCluster,
      api
    ),
    takeLatest(ClustersActions.fetchClusterMetrics, fetchClusterMetrics, api),
    takeLatest(
      ClustersActions.associateClusterWithRegistry,
      associateClusterWithRegistry,
      api
    ),
    takeLatest(
      ClustersActions.fetchAnsibleClusterData,
      fetchAnsibleClusterData,
      api
    ),
    takeLatest(
      ClustersActions.upgradeAnsibleCluster,
      upgradeAnsibleCluster,
      api
    ),
    takeLatest(
      ClustersActions.updateNodesAnsibleCluster,
      updateNodesAnsibleCluster,
      api
    ),
    takeLatest(
      ClustersActions.deleteAnsibleClusterHard,
      deleteAnsibleClusterHard,
      api
    ),
    takeLatest(
      ClustersActions.fetchAnsibleCLusterProcessData,
      fetchAnsibleCLusterProcessData,
      api
    ),
    takeLatest(
      ClustersActions.fetchAllConfigPropertiesWithValue,
      fetchAllConfigPropertiesWithValue,
      api
    ),
    takeLatest(
      ClustersActions.checkServiceAccountCredentialsRequest,
      checkServiceAccountCredentials,
      api
    ),
    takeLatest(ClustersActions.testMultipleNodes, testMultipleNodes, api),
    takeLatest(
      ClustersActions.updateMultipleNodeswithSSH,
      updateMultipleNodeswithSSH,
      api
    ),
    takeLatest(ClustersActions.fetchSSHstatus, fetchSSHstatus, api),
    takeLatest(ClustersActions.addNarFile, addNarFile, api),
    takeLatest(ClustersActions.fetchNarList, fetchNarList, api),
    takeLatest(ClustersActions.restartCluster, restartCluster, api),
    takeLatest(ClustersActions.uploadClusterDriver, uploadClusterDriver, api),
    takeLatest(ClustersActions.fetchDriversList, fetchDriversList, api),
    takeLatest(
      ClustersActions.fetchMasterHostNodesList,
      fetchMasterHostNodesList,
      api
    ),
    takeLatest(
      ClustersActions.fetchConfigFieldsForKubernetes,
      fetchConfigFieldsForKubernetes,
      api
    ),
    takeLatest(
      ClustersActions.createConfigForKubernetesCluster,
      createConfigForKubernetesCluster,
      api
    ),
    takeLatest(
      ClustersActions.fetchConfigListForKubernetes,
      fetchConfigListForKubernetes,
      api
    ),
    takeLatest(ClustersActions.deleteKubeConfig, deleteKubeConfig, api),
    takeLatest(
      ClustersActions.createKubernetesCluster,
      createKubernetesCluster,
      api
    ),
    takeLatest(
      ClustersActions.fetchConfigVersionsPerConfig,
      fetchConfigVersionsPerConfig,
      api
    ),
    takeLatest(
      ClustersActions.createKubernetesMasterNodeCluster,
      createKubernetesMasterNodeCluster,
      api
    ),
    takeLatest(
      ClustersActions.deleteMasterNodeConfig,
      deleteMasterNodeConfig,
      api
    ),
    takeLatest(
      ClustersActions.fetchKubeClusterDataToUpgrade,
      fetchKubeClusterDataToUpgrade,
      api
    ),
    takeLatest(ClustersActions.deleteClusterKube, deleteClusterKube, api),
    takeLatest(ClustersActions.deleteClusterNarFile, deleteClusterNarFile, api),
    takeLatest(
      ClustersActions.deleteClusterDriverFile,
      deleteClusterDriverFile,
      api
    ),
    takeLatest(ClustersActions.fetchKubePodStatus, fetchKubePodStatus, api),
    takeLatest(ClustersActions.fetchKubeHealth, fetchKubeHealth, api),
    takeLatest(
      ClustersActions.updateKubeConfigQuickEdit,
      updateKubeConfigQuickEdit,
      api
    ),
    takeLatest(ClustersActions.addScript, addScript, api),
    takeLatest(ClustersActions.fetchScriptList, fetchScriptList, api),
    takeLatest(ClustersActions.deleteClusterScript, deleteClusterScript, api),
    takeLatest(ClustersActions.testAzureConfig, testAzureConfig, api),
  ]);
}
