import { all, call, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesSelectors } from '../namespaces/redux';
import { DashboardActions } from './redux';
export function* fetchDashboard(api, action) {
  const { payload } = action; // Now you can access payload here
  const { refresh } = payload || {}; // Destructure refresh from payload safely
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const selectedNamespace = payload.payload.selectedNamespace;

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

export function* dashboardSagas(api) {
  yield all([takeLatest(DashboardActions.fetchDashboard, fetchDashboard, api)]);
}
