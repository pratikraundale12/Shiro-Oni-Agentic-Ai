import { isEmpty } from 'lodash';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesActions, NamespacesSelectors } from '../namespaces';
import { ClustersActions } from './redux';
import { toast } from 'react-toastify';
import { history } from '../../helpers/history';
import { GridActions } from '../grid';

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

  yield call(requestSaga, {
    errorSection: 'fetchClusters',
    loadingSection: 'fetchClusters',
    apiMethod: api.fetchClusters,
    apiParams: [{ params, payload: clusters }],
    successAction: ClustersActions.fetchClustersSuccess,
  });
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
export function* addIndividualHost(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'addIndividualHost',
    loadingSection: 'addIndividualHost',
    apiMethod: api.addIndividualHost,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    toast.success('Node Added Successfully');
    yield put(ClustersActions.setIsAddHostIPModalOpen(false));
    yield put(
      ClustersActions.fetchHostNodesList({
        selected: true,
        clusterId: null,
        update_node: false,
      })
    );
  } else {
    toast.error(response?.data?.message);
    yield put(ClustersActions.setIsAddHostIPModalOpen(false));
  }
}
export function* deleteIndividualHost(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteIndividualHost',
    loadingSection: 'deleteIndividualHost',
    apiMethod: api.deleteIndividualHost,
    apiParams: [{ hostId: payload?.hostId }],
  });
  if (response.ok) {
    toast.success('Deleted Successfully');
    yield put(
      ClustersActions.fetchHostNodesList({
        selected: true,
        clusterId: null,
        update_node: false,
      })
    );
  } else {
    toast.error(response?.data?.message);
  }
}
export function* updateIndividualHost(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'updateIndividualHost',
    loadingSection: 'updateIndividualHost',
    apiMethod: api.updateIndividualHost,
    apiParams: [{ hostId: payload?.hostId, payload: payload?.payload }],
  });
  if (response.ok) {
    toast.success('Node Updated Successfully');
    yield put(ClustersActions.setIsAddHostIPModalOpen(false));
    yield put(
      ClustersActions.fetchHostNodesList({
        selected: true,
        clusterId: null,
        update_node: false,
      })
    );
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
  } else {
    toast.error(response?.data?.message);
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

    console.log('addServiceAccountHost: clusterId:', clusterId);
    console.log('addServiceAccountHost: formData:', formData);

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
  const response = yield call(requestSaga, {
    errorSection: 'fetchAnsibleCLusterProcessData',
    loadingSection: 'fetchAnsibleCLusterProcessData',
    apiMethod: api.fetchAnsibleCLusterProcessData,
    apiParams: [
      {
        clusterId: payload?.clusterId,
        process_id: payload?.process_id,
        process_name: payload?.process_name,
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
  ]);
}
