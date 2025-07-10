import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesSelectors } from '../namespaces';
import { ActivityHistoryActions, ActivityHistorySelectors } from './redux';
import { toast } from 'react-toastify';
// import { history } from '../../helpers/history';

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
  const contentType = response?.headers?.['content-type'];
  if (response?.error) {
    toast.error('Failed to fetch email report.');
  } else if (contentType && contentType.includes('text/csv')) {
    // 🧠 Try to get the filename from the headers
    const disposition = response.headers['content-disposition'];
    const filenameMatch = /filename="?(.+?)"?$/.exec(disposition || '');
    const filename = filenameMatch ? filenameMatch[1] : 'audit-report.csv';

    // ⬇️ Trigger download
    const blob = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();

    // ✅ Show success toast
    toast.success('Activity History report downloaded successfully');
  } else {
    toast.success(
      'Export request received. The report will be emailed once ready'
    );
  }
}
export function* deleteDownloadReport(api, action) {
  const { start_date, end_date } = action.payload || {};

  const response = yield call(requestSaga, {
    errorSection: 'deleteDownloadReport',
    loadingSection: 'deleteDownloadReport',
    apiMethod: api.deleteDownloadReport,
    apiParams: [{ start_date, end_date }],
    successAction: ActivityHistoryActions.deleteDownloadReport,
  });
  if (response?.error) {
    toast.error('Failed to delete report.');
  } else {
    toast.success('Report deleted successfully');
    history.push('/activity-history/download-history');
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
    toast.error('Failed to download Activity History.');
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
    takeLatest(
      ActivityHistoryActions.deleteDownloadReport,
      deleteDownloadReport,
      api
    ),
  ]);
}
