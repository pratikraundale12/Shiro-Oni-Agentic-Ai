import { isEmpty } from 'lodash';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN, KDFM } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesActions, NamespacesSelectors } from '../namespaces';
import { ClustersActions } from './redux';
import { toast } from 'react-toastify';
import {
  AuthenticationActions,
  AuthenticationSelectors,
} from '../authentication';
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

export function* getClusterToken(api, { payload }) {
  const clusterData = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const clusterLogin = yield select(AuthenticationSelectors.getClusterLogin);
  const destinationFlag = yield select(
    AuthenticationSelectors.getDestinationFlag
  );
  console.log(destinationFlag, 'destinationFlag');
  const response = yield call(requestSaga, {
    errorSection: 'getClusterToken',
    loadingSection: 'getClusterToken',
    apiMethod: api.getClusterToken,
    apiParams: [{ payload }],
    successAction: ClustersActions.fetchClusterNodesSuccess,
  });
  if (response.ok) {
    if (response.cluster_id) {
      const newCluster = {
        id: response.cluster_id,
        name: response.cluster_name,
        token: response.token,
      };
      clusterData.push(newCluster);
      localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify(clusterData));
      if (!clusterLogin.is_deploy) {
        localStorage.setItem(
          'selected_cluster',
          JSON.stringify({
            label: response.cluster_name,
            value: response?.cluster_id,
          })
        );
      }

      if (!destinationFlag) {
        yield put(
          NamespacesActions.setSelectedCluster({
            label: response?.cluster_name,
            value: response?.cluster_id,
          })
        );
      }
      if (destinationFlag) {
        yield put(AuthenticationActions.setDestinationFlag());
        yield put(
          NamespacesActions.setSelectedDestCluster({
            label: response.cluster_name,
            value: response.cluster_id,
          })
        );
        yield put(AuthenticationActions.checkDestCluster());
      }
      yield put(AuthenticationActions.setClusterLogin());
      yield put(GridActions.fetchGrid({ module: 'clusters' }));
      toast.success('The cluster is now enabled successfully.');
      if (window.location.pathname.includes('/process-group')) {
        history.push('/process-group');
      }
    } else {
      toast.error(response.message || 'Error while getting data');
    }
  } else if (!response.ok)
    toast.error(response?.message || response?.data?.message);
}

export function* clustersSagas(api) {
  yield all([
    takeLatest(ClustersActions.fetchClusterList, fetchClusterList, api),
    takeLatest(ClustersActions.fetchClusterNodes, fetchClusterNodes, api),
    takeLatest(ClustersActions.fetchClusters, fetchClusters, api),
    takeLatest(ClustersActions.getClusterToken, getClusterToken, api),
  ]);
}
