import { isEmpty } from 'lodash';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesActions, NamespacesSelectors } from '../namespaces';
import { ClustersActions } from './redux';
import { toast } from 'react-toastify';

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
    toast.success('Test success');
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
    apiParams: [{ payload: payload?.selected }],
    // successAction: ClustersActions.fetchHostNodesList,
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
    /// list api
    yield put(ClustersActions.fetchHostNodesList({ selected: true }));
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
    yield put(ClustersActions.fetchHostNodesList({ selected: true }));
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
    yield put(ClustersActions.fetchHostNodesList({ selected: true }));
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
  console.log(payload, 'payload');

  const response = yield call(requestSaga, {
    errorSection: 'addConfigClusterSetup',
    loadingSection: 'addConfigClusterSetup',
    apiMethod: api.addConfigClusterSetup,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    toast.success('Config Added Successfully');
    // /// list api
    // yield put(ClustersActions.fetchHostNodesList({ selected: true }));
  } else {
    toast.error(response?.data?.message);
  }
}
export function* clustersSagas(api) {
  yield all([
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
  ]);
}
