import { all, call, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesSelectors } from '../namespaces';
import { ActivityHistoryActions, ActivityHistorySelectors } from './redux';

export function* fetchActivityHistory(api) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const selectedEntity = yield select(
    ActivityHistorySelectors.getSelectedEntity
  );
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const queryParams = {
    entity: selectedEntity?.value || '',
  };
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  yield call(requestSaga, {
    errorSection: 'fetchActivityHistory',
    loadingSection: 'fetchActivityHistory',
    apiMethod: api.fetchActivityHistory,
    apiParams: [{ queryParams }],
    successAction: ActivityHistoryActions.fetchActivityHistorySuccess,
  });
}

export function* fetchEmailReportSaga(api, action) {
  const queryParams = action.payload?.queryParams || {};

  yield call(requestSaga, {
    errorSection: 'fetchEmailReport',
    loadingSection: 'fetchEmailReport',
    apiMethod: api.fetchEmailReport,
    apiParams: [{ queryParams }],
    successAction: ActivityHistoryActions.fetchEmailReportSuccess,
  });
}

export function* activityHistorySagas(api) {
  yield all([
    takeLatest(
      ActivityHistoryActions.fetchActivityHistory,
      fetchActivityHistory,
      api
    ),
    takeLatest(
      ActivityHistoryActions.fetchEmailReport,
      fetchEmailReportSaga,
      api
    ),
  ]);
}
