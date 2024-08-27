import { isEmpty } from 'lodash';
import { all, call, debounce, put, select } from 'redux-saga/effects';
import { CLUSTERS_TOKEN, DEBOUNCE_DELAY } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesSelectors } from '../namespaces';
import { GridActions } from './redux';

export function* fetchGrid(
  api,
  { payload: { module = '', clusterId, params } },
  refresh
) {
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
    nodes: api.fetchClusterNodes,
    namespaces: api.fetchNamespaces,
    activityHistory: api.fetchActivityHistory,
    destNamespaces: api.fetchNamespaces,
    clustersRolesAccess: api.fetchClustersRolesAccess,
    policiesRolesAccess: api.fetchPoliciesRolesAccess,
  };
  let payload;
  if (module === 'clusters') payload = localStorage.getItem(CLUSTERS_TOKEN);
  let queryParams;
  if (module === 'namespaces') {
    queryParams = {
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
  }
  if (module === 'destNamespaces') {
    queryParams = {
      clusterId: selectedDestCluster?.value || '',
      namespaceId: selectedDestNamespace?.value || '',
    };
    const clustersToken = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );
    const selectedClusterToken = clustersToken.find(
      item => item.id === selectedDestCluster?.value
    );
    api.headers['x-cluster-id'] = selectedClusterToken?.id;
    api.headers['x-cluster-token'] = selectedClusterToken?.token;
  }
  if (module === 'namespaces' && isEmpty(selectedCluster)) return;
  if (module === 'nodes') {
    queryParams = {
      clusterId,
    };
    const clustersToken = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );
    const selectedClusterToken = clustersToken.find(
      item => item.id === clusterId
    );
    api.headers['x-cluster-id'] = selectedClusterToken?.id;
    api.headers['x-cluster-token'] = selectedClusterToken?.token;
  }
  const response = yield call(requestSaga, {
    errorSection: 'fetchGrid',
    ...(!refresh && { loadingSection: 'fetchGrid' }), // Conditionally include loadingSection if refresh is true
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
