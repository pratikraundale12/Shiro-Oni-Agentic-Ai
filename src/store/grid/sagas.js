import { isEmpty } from 'lodash';
import { all, call, debounce, put, select } from 'redux-saga/effects';
import { CLUSTERS_TOKEN, DEBOUNCE_DELAY } from '../../constants';
import { DashboardActions } from '../dashboard';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesActions, NamespacesSelectors } from '../namespaces';
import { SchedularSelectors } from '../schedular/redux';
import { GridActions } from './redux';

export function* fetchGrid(
  api,
  { payload: { module = '', clusterId, params, refresh = false } }
) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const selecedNamespaceDetails = yield select(
    NamespacesSelectors.getSelectedNamespace
  );

  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const selectedDestNamespace = yield select(
    NamespacesSelectors.getSelectedDestNamespace
  );

  const scheduleFromList = yield select(SchedularSelectors.getScheduleFromList);
  const API = {
    users: api.fetchUsers,
    clusters: api.fetchClusters,
    nodes: api.fetchClusterNodes,
    namespaces: api.fetchNamespaces,
    activityHistory: api.fetchActivityHistory,
    destNamespaces: api.fetchNamespaces,
    clustersRolesAccess: api.fetchClustersRolesAccess,
    policiesRolesAccess: api.fetchPoliciesRolesAccess,
    scheduler: api.fetchSchedular,
  };
  let payload;
  if (module === 'clusters') payload = localStorage.getItem(CLUSTERS_TOKEN);
  let queryParams;
  if (module === 'namespaces') {
    queryParams = {
      clusterId: selectedCluster?.value || '',
      namespaceId: selecedNamespaceDetails?.value || '',
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
      is_scheduled: scheduleFromList || false,
    };
    const clustersToken = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );
    const selectedClusterToken = clustersToken.find(
      item => item.id === selectedDestCluster?.value
    );
    api.headers['x-cluster-id'] = scheduleFromList
      ? selectedDestCluster?.value
      : selectedClusterToken?.id;
    api.headers['x-cluster-token'] = scheduleFromList
      ? undefined
      : selectedClusterToken?.token;
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
    ...(!refresh && { errorSection: 'fetchGrid', loadingSection: 'fetchGrid' }),
    apiMethod: API[module],
    apiParams: [{ params, queryParams, payload }],
  });
  if (module === 'clusters') {
    let clusterData = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN)) || [];
    if (Array.isArray(response.data.data)) {
      const processedClusters = response.data.data;
      const disconnectedData = processedClusters.filter(
        cluster => cluster.status === 'Disconnected'
      );
      const tempData = [];
      for (const item of clusterData) {
        const itemMatch = disconnectedData.find(
          childItem => item.id === childItem.id
        );
        if (!itemMatch) {
          tempData.push({
            id: item.id,
            name: item.name,
            token: item.token,
          });
        }
      }
      const selectedCluster = localStorage.getItem('selected_cluster');
      if (selectedCluster) {
        const cluster = tempData?.find(
          item => item?.id !== selectedCluster?.value
        );
        if (!cluster) {
          localStorage.removeItem('selected_cluster');
          yield put(
            NamespacesActions.setSelectedCluster({
              label: '',
              value: '',
            })
          );
          yield put(
            GridActions.fetchGridSuccess({ module: 'namespaces', data: {} })
          );
          yield put(DashboardActions.fetchDashboardSuccess({ data: {} }));
        }
      }

      localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify(tempData));
    }
  }
  if (response.ok) {
    yield put(GridActions.fetchGridSuccess({ module, data: response.data }));
  }
}

export function* gridSagas(api) {
  yield all([debounce(DEBOUNCE_DELAY, GridActions.fetchGrid, fetchGrid, api)]);
}
