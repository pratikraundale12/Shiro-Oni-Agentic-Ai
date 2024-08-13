import { call, all, takeLatest } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { ClustersActions } from './redux';

export function* fetchClusterList(api, { payload }) {
  yield call(requestSaga, {
    errorSection: 'fetchClusterList',
    loadingSection: 'fetchClusterList',
    apiMethod: api.fetchClusterList,
    apiParams: [payload],
    successAction: ClustersActions.fetchClusterListSuccess,
  });
}

export function* clustersSagas(api) {
  yield all([
    takeLatest(ClustersActions.fetchClusterList, fetchClusterList, api),
  ]);
}
