import { call, all, takeLatest, select } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesActions, NamespacesSelectors } from './redux';

export function* fetchNamespaces(api) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  yield call(requestSaga, {
    errorSection: 'fetchNamespaces',
    loadingSection: 'fetchNamespaces',
    apiMethod: api.fetchNamespaces,
    apiParams: [selectedCluster?.value, selectedNamespace?.value],
    successAction: NamespacesActions.fetchNamespacesSuccess,
  });
}

export function* namespacesSagas(api) {
  yield all([
    takeLatest(NamespacesActions.fetchNamespaces, fetchNamespaces, api),
  ]);
}
