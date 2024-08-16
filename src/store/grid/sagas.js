import { all, call, debounce, put, select } from 'redux-saga/effects';
import { CLUSTERS_TOKEN, DEBOUNCE_DELAY } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesSelectors } from '../namespaces';
import { GridActions } from './redux';

export function* fetchGrid(api, { payload: { module = '', params } }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const selectedDestNamespace = yield select(
    NamespacesSelectors.getSelectedDestNamespace
  );
  const API = {
    users: api.fetchUsers,
    clusters: api.fetchClusters,
    namespaces: api.fetchNamespaces,
    destNamespaces: api.fetchNamespaces,
    clustersRolesAccess: api.fetchClustersRolesAccess,
    policiesRolesAccess: api.fetchPoliciesRolesAccess,
  };
  let payload;
  if (module === 'clusters') payload = localStorage.getItem(CLUSTERS_TOKEN);
  let queryParams;
  if (module === 'namespaces')
    queryParams = {
      clusterId: selectedCluster?.value || '',
      namespaceId: selectedNamespace?.value || '',
    };
  if (module === 'destNamespaces')
    queryParams = {
      clusterId: selectedDestCluster?.value || '',
      namespaceId: selectedDestNamespace?.value || '',
    };
  const response = yield call(requestSaga, {
    errorSection: 'fetchGrid',
    loadingSection: 'fetchGrid',
    apiMethod: API[module],
    apiParams: [{ params, queryParams, payload }],
  });
  if (response.ok) {
    yield put(GridActions.fetchGridSuccess({ module, data: response.data }));
  }
}

export function* gridSagas(api) {
  yield all([debounce(DEBOUNCE_DELAY, GridActions.fetchGrid, fetchGrid, api)]);
}
