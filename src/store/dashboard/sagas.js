import { call, all, takeLatest, select } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { DashboardActions } from './redux';
import { NamespacesSelectors } from '../namespaces/redux';
import { CLUSTERS_TOKEN } from '../../constants';

export function* fetchDashboard(api, { payload: { refresh } = {} }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );

  if (!selectedCluster?.value) {
    console.log('No cluster ID available, aborting API call.');
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
