import { call, all, takeLatest, select } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { DashboardActions } from './redux';
import { NamespacesSelectors } from '../namespaces/redux';

export function* fetchDashboard(api) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  yield call(requestSaga, {
    errorSection: 'fetchDashboard',
    loadingSection: 'fetchDashboard',
    apiMethod: api.fetchDashboard,
    apiParams: [selectedCluster?.value, selectedNamespace?.value],
    successAction: DashboardActions.fetchDashboardSuccess,
  });
}

export function* dashboardSagas(api) {
  yield all([takeLatest(DashboardActions.fetchDashboard, fetchDashboard, api)]);
}
