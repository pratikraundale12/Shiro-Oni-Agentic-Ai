// import { CLUSTERS_TOKEN } from '../../constants';
import { SchedularActions } from './redux';
import { call, all, takeLatest, select } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { toast } from 'react-toastify';
import { CLUSTERS_TOKEN } from '../../constants';
import { NamespacesSelectors } from '../namespaces';
// import namespace from 'eslint-plugin-import/lib/rules/namespace';
export function* createScheduleDeployment(api, { payload }) {
  console.log([payload], '?????? gen fun');
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const checkDestCluster = yield select(
    NamespacesSelectors.getCheckDestCluster
  );
  const formData = yield select(NamespacesSelectors.getFormData);
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  console.log(selectedCluster, 'selectedCluster sourceid');
  console.log(selectedDestCluster, 'selectedDestCluster');
  console.log(checkDestCluster, 'checkDestCluster');
  console.log(formData, 'formData');
  // const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  // const destClusterToken = clusters?.find(
  //   cluster => cluster.id === selectedDestCluster?.value
  // );
  // api.headers['x-cluster-id'] = destClusterToken?.id;
  // api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'createScheduleDeployment',
    loadingSection: 'createScheduleDeployment',
    apiMethod: api.createScheduleDeployment,
    apiParams: [{ payload }],
  });
  if (response.ok) {
    console.log(response);
  } else toast.error(response.data.message);
}

export function* fetchNamespaces(api, { payload }) {
  const queryParams = {
    clusterId: payload || '',
    namespaceId: '',
  };
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(item => item.id === payload);
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  yield call(requestSaga, {
    errorSection: 'fetchNamespaces',
    loadingSection: 'fetchNamespaces',
    apiMethod: api.fetchNamespaces,
    apiParams: [{ queryParams }],
    successAction: SchedularActions.fetchNamespacesSuccess,
  });
}

export function* schedularSagas(api) {
  yield all([
    takeLatest(
      SchedularActions.createScheduleDeployment,
      createScheduleDeployment,
      api
    ),
    takeLatest(SchedularActions.fetchNamespaces, fetchNamespaces, api),
  ]);
}
