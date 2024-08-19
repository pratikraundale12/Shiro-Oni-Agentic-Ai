import { call, all, takeLatest, put } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { ClustersActions } from './redux';
import { NamespacesActions } from '../namespaces';
import { CLUSTERS_TOKEN } from '../../constants';
import { isEmpty } from 'lodash';

export function* fetchClusterList(api, { payload: { params } = {} }) {
  yield call(requestSaga, {
    errorSection: 'fetchClusterList',
    loadingSection: 'fetchClusterList',
    apiMethod: api.fetchClusterList,
    apiParams: [{ params }],
    successAction: ClustersActions.fetchClusterListSuccess,
  });
  const clusterData = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN)) || [];
  if (!isEmpty(clusterData[0])) {
    yield put(
      NamespacesActions.setSelectedCluster({
        label: clusterData[0]?.name,
        value: clusterData[0]?.id,
      })
    );
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

export function* clustersSagas(api) {
  yield all([
    takeLatest(ClustersActions.fetchClusterList, fetchClusterList, api),
    takeLatest(ClustersActions.fetchClusterNodes, fetchClusterNodes, api),
  ]);
}
