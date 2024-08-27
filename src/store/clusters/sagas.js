import { isEmpty } from 'lodash';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesActions, NamespacesSelectors } from '../namespaces';
import { ClustersActions } from './redux';

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
