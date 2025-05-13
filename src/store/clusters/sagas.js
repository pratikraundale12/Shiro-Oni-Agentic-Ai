import { isEmpty } from 'lodash';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesActions, NamespacesSelectors } from '../namespaces';
import { ClustersActions } from './redux';
import { toast } from 'react-toastify';

export function* fetchClusterList(api, { payload: { params } = {} }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);

  yield call(requestSaga, {
    errorSection: 'fetchClusterList',
    loadingSection: 'fetchClusterList',
    apiMethod: api.fetchClusterList,
    apiParams: [{ params }],
    successAction: ClustersActions.fetchClusterListSuccess,
  });
  const clusterData = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN)) || [];

  if (!isEmpty(clusterData[0]) && isEmpty(selectedCluster)) {
    yield put(
      NamespacesActions.setSelectedCluster({
        label: clusterData[0]?.name,
        value: clusterData[0]?.id,
      })
    );
  }
}
export function* fetchClusters(api, { params }) {
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');

  yield call(requestSaga, {
    errorSection: 'fetchClusters',
    loadingSection: 'fetchClusters',
    apiMethod: api.fetchClusters,
    apiParams: [{ params, payload: clusters }],
    successAction: ClustersActions.fetchClustersSuccess,
  });
}

export function* fetchClusterNodes(api, { payload }) {
  yield call(requestSaga, {
    errorSection: 'fetchClusterNodes',
    loadingSection: 'fetchClusterNodes',
    apiMethod: api.fetchClusterNodes,
    apiParams: [payload],
    successAction: ClustersActions.fetchClusterNodesSuccess,
  });
}

export function* clusterLogout(api, { payload }) {
  if (payload?.id) {
    yield call(requestSaga, {
      errorSection: 'clusterLogout',
      loadingSection: 'clusterLogout',
      apiMethod: api.clusterLogout,
      apiParams: [
        { clusterId: payload?.id, payload: { token: payload?.token } },
      ],
      successAction: ClustersActions.clusterLogout,
    });
  }
}
export function* checkServiceAccountCredentials(api, { payload }) {
  const { clusterId, formData } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'checkServiceAccountCredentials',
    loadingSection: 'checkServiceAccountCredentials',
    apiMethod: api.createClusterServiceAcc,
    apiParams: [{ clusterId, payload: formData }],
  });

  if (response?.ok) {
    yield put(ClustersActions.checkServiceAccountCredentialsSuccess());
    toast.success('Credentials validated');
  } else {
    yield put(
      ClustersActions.checkServiceAccountCredentialsFailure(
        response?.data?.message
      )
    );
    toast.error(response?.data?.message);
  }
}

export function* addServiceAccountHost(api, { payload }) {
  try {
    const { clusterId, formData } = payload;

    console.log('addServiceAccountHost: clusterId:', clusterId);
    console.log('addServiceAccountHost: formData:', formData);

    if (!clusterId || !formData) {
      console.error('Invalid clusterId or formData');
      toast.error('Invalid cluster ID or form data');
      return;
    }

    const response = yield call(requestSaga, {
      errorSection: 'addServiceAccountHost',
      loadingSection: 'addServiceAccountHost',
      apiMethod: api.createClusterServiceAcc,
      apiParams: [{ clusterId, payload: formData }],
    });

    if (response.ok) {
      yield put(ClustersActions.addServiceAccountHostSuccess(response.data));
      toast.success('Saved successfully');
    } else {
      console.error('addServiceAccountHost: API error:', response.data.message);
      yield put(
        ClustersActions.addServiceAccountHostFailure(response.data.message)
      );
      toast.error(response.data.message);
    }
  } catch (error) {
    console.error('addServiceAccountHost: Saga error:', error);
    toast.error('An error occurred while adding the host');
  }
}

export function* updateServiceAccountHost(api, { payload }) {
  const { clusterId, formData } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'updateServiceAccountHost',
    loadingSection: 'updateServiceAccountHost',
    apiMethod: api.updateClusterServiceAcc,
    apiParams: [{ clusterId, payload: formData }],
  });

  if (response?.ok) {
    yield put(
      ClustersActions.updateServiceAccountHostSuccess(response?.data?.message)
    );
    toast.success('Saved successfully');
  } else {
    yield put(
      ClustersActions.updateServiceAccountHostFailure(response?.data?.message)
    );
    toast.error(response?.data?.message);
  }
}

export function* clustersSagas(api) {
  yield all([
    takeLatest(ClustersActions.fetchClusterList, fetchClusterList, api),
    takeLatest(ClustersActions.fetchClusterNodes, fetchClusterNodes, api),
    takeLatest(ClustersActions.fetchClusters, fetchClusters, api),
    takeLatest(ClustersActions.clusterLogout, clusterLogout, api),
    takeLatest(
      ClustersActions.checkServiceAccountCredentialsRequest,
      checkServiceAccountCredentials,
      api
    ),
    takeLatest(
      ClustersActions.addServiceAccountHostRequest,
      addServiceAccountHost,
      api
    ),
    takeLatest(
      ClustersActions.updateServiceAccountHostRequest,
      updateServiceAccountHost,
      api
    ),
  ]);
}
