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
export function* clustersSagas(api) {
  yield all([
    takeLatest(ClustersActions.fetchClusterList, fetchClusterList, api),
    takeLatest(ClustersActions.fetchClusterNodes, fetchClusterNodes, api),
    takeLatest(ClustersActions.fetchClusters, fetchClusters, api),
    takeLatest(ClustersActions.clusterLogout, clusterLogout, api),
    takeLatest(ClustersActions.getNiFiVersions, getNiFiVersions, api),
  ]);
}
