import { all, call, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesSelectors } from '../namespaces/redux';
import { DashboardActions } from './redux';
import { toast } from 'react-toastify';
export function* fetchDashboard(api, action) {
  const { payload } = action; // Now you can access payload here
  const { refresh } = payload || {}; // Destructure refresh from payload safely
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const selectedNamespace = payload?.payload?.selectedNamespace;

  if (!selectedCluster?.value) {
    return;
  }

  const queryParams = {
    clusterId: selectedCluster?.value || '',
    namespaceId: selectedNamespace?.value || '',
  };
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  yield call(requestSaga, {
    ...(!refresh && {
      errorSection: 'fetchDashboard',
      loadingSection: 'fetchDashboard',
    }),
    apiMethod: api.fetchDashboard,
    apiParams: [{ queryParams }],
    successAction: DashboardActions.fetchDashboardSuccess,
    clusterId: selectedCluster?.value,
  });
}

export function* fetchDeploymentMetrics(api, action) {
  const { payload } = action; // Extract payload from action
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);

  if (!selectedCluster?.value) return;
  const apiParams = {
    clusterId: selectedCluster?.value,
    ...(payload?.start_date && { start_date: payload.start_date }),
    ...(payload?.end_date && { end_date: payload.end_date }),
  };

  const response = yield call(requestSaga, {
    errorSection: 'fetchDeploymentMetrics',
    loadingSection: 'fetchDeploymentMetrics',
    apiMethod: api.fetchDeploymentMetrics,
    apiParams: [apiParams],
    successAction: DashboardActions.fetchDeploymentMetricsSuccess,
    clusterId: selectedCluster?.value,
  });

  if (!response.ok) {
    toast.error(
      response?.message ||
        response?.data?.message ||
        'Failed to fetch deployment metrics'
    );
  }
}

export function* dashboardSagas(api) {
  yield all([takeLatest(DashboardActions.fetchDashboard, fetchDashboard, api)]);
  yield all([
    takeLatest(
      DashboardActions.fetchDeploymentMetrics,
      fetchDeploymentMetrics,
      api
    ),
  ]);
}
