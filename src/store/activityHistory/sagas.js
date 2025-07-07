import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesSelectors } from '../namespaces';
import { ActivityHistoryActions, ActivityHistorySelectors } from './redux';
import { toast } from 'react-toastify';
import { history } from '../../helpers/history';

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

  const response = yield call(requestSaga, {
    errorSection: 'fetchEmailReport',
    loadingSection: 'fetchEmailReport',
    apiMethod: api.fetchEmailReport,
    apiParams: [{ queryParams }],
    successAction: ActivityHistoryActions.fetchEmailReportSuccess,
  });
  if (response?.error) {
    toast.error('Failed to fetch email report.');
  } else {
    history.push('/activity-history/download-history');
    toast.success(
      'Export request received. The report will be emailed once ready and can also be accessed via the Download History'
    );
  }
}

export function* fetchDownloadReportSaga(api, action) {
  const {
    status = [],
    event = [],
    entity = [],
  } = action.payload?.queryParams || {};

  const response = yield call(requestSaga, {
    errorSection: 'fetchDownloadReport',
    loadingSection: 'fetchDownloadReport',
    apiMethod: api.fetchDownloadReport,
    apiParams: [status, event, entity], // 👈 Corrected!
    successAction: ActivityHistoryActions.fetchDownloadReportSuccess,
  });

  if (response?.error) {
    toast.error('Failed to download history.');
  } else {
    yield put(
      ActivityHistoryActions.fetchDownloadReportSuccess(response?.data)
    );
  }
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
    takeLatest(
      ActivityHistoryActions.fetchDownloadReport,
      fetchDownloadReportSaga,
      api
    ),
  ]);
}
