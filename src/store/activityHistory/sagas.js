// import { all, call, select } from 'redux-saga/effects';
// import { CLUSTERS_TOKEN } from '../../constants';

// export function* fetchActivityHistory(api) {
// const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
// const selectedNamespace = yield select(
//   NamespacesSelectors.getSelectedNamespace
// );
// const queryParams = {
//   clusterId: selectedCluster?.value || '',
//   namespaceId: selectedNamespace?.value || '',
// };
// const clustersToken = JSON.parse(
//   localStorage.getItem(CLUSTERS_TOKEN) || '[]'
// );
// const selectedClusterToken = clustersToken.find(
//   item => item.id === selectedCluster?.value
// );
// api.headers['x-cluster-id'] = selectedClusterToken?.id;
// api.headers['x-cluster-token'] = selectedClusterToken?.token;
// yield call(requestSaga, {
//   errorSection: 'fetchNamespaces',
//   loadingSection: 'fetchNamespaces',
//   apiMethod: api.fetchNamespaces,
//   apiParams: [{ queryParams }],
// successAction: NamespacesActions.fetchNamespacesSuccess,
// });
// }

// export function* activityHistorySagas(api) {
//   yield all([
//     takeLatest(NamespacesActions.fetchVariableList, fetchActivityHistory, api),
//   ])
// }
