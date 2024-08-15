import { toast } from 'react-toastify';
import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { requestSaga } from '../helpers/request_sagas';
import { NamespacesActions, NamespacesSelectors } from './redux';

export function* fetchNamespaces(api) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  const queryParams = {
    clusterId: selectedCluster?.value || '',
    namespaceId: selectedNamespace?.value || '',
  };
  yield call(requestSaga, {
    errorSection: 'fetchNamespaces',
    loadingSection: 'fetchNamespaces',
    apiMethod: api.fetchNamespaces,
    apiParams: [{ queryParams }],
    successAction: NamespacesActions.fetchNamespacesSuccess,
  });
}

export function* fetchDestNamespaces(api) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const selectedDestNamespace = yield select(
    NamespacesSelectors.getSelectedDestNamespace
  );
  const queryParams = {
    clusterId: selectedDestCluster?.value || '',
    namespaceId: selectedDestNamespace?.value || '',
  };
  yield call(requestSaga, {
    errorSection: 'fetchDestNamespaces',
    loadingSection: 'fetchDestNamespaces',
    apiMethod: api.fetchNamespaces,
    apiParams: [{ queryParams }],
    successAction: NamespacesActions.fetchDestNamespacesSuccess,
  });
}

export function* checkDestCluster(api) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const path = yield select(NamespacesSelectors.getFlowPath);
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
  const srcClusterToken = clusters?.find(
    cluster => cluster.id === selectedCluster?.value
  )?.token;
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  api.headers['x-cluster-id'] = destClusterToken?.id;
  api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'checkDestCluster',
    loadingSection: 'checkDestCluster',
    apiMethod: api.checkDestCluster,
    apiParams: [
      {
        clusterId: selectedDestCluster?.value,
        srcClusterId: selectedCluster?.value,
        srcClusterToken,
        path,
      },
    ],
    successAction: NamespacesActions.checkDestClusterSuccess,
  });
  if (response.ok && response.data.message) {
    toast.error(response.data.message);
  }
}

export function* deployCluster(api) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const checkDestCluster = yield select(
    NamespacesSelectors.getCheckDestCluster
  );
  const formData = yield select(NamespacesSelectors.getFormData);
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  api.headers['x-cluster-id'] = destClusterToken?.id;
  api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'deployCluster',
    loadingSection: 'deployCluster',
    apiMethod: api.deployCluster,
    apiParams: [
      {
        clusterId: selectedDestCluster?.value,
        version: formData.version || checkDestCluster?.version,
        flowId: checkDestCluster?.flowId,
        bucketId: checkDestCluster?.bucketId,
        registryId: checkDestCluster?.registryId,
        ...(formData.namespaceId && { namespaceId: formData.namespaceId }),
        ...(formData.position && { position: formData.position }),
      },
    ],
    successAction: NamespacesActions.deployClusterSuccess,
  });
  if (response.ok) yield put(NamespacesActions.setDeployedModal());
  else toast.error(response.data.message);
}

export function* updateNamespaceStatus(api, { payload }) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const deployDetails = yield select(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  api.headers['x-cluster-id'] = destClusterToken?.id;
  api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'updateNamespaceStatus',
    loadingSection: 'updateNamespaceStatus',
    apiMethod: api.updateNamespaceStatus,
    apiParams: [
      {
        clusterId: selectedDestCluster?.value,
        namespaceId: deployDetails.id,
        state: payload,
      },
    ],
  });
  if (response.ok) {
    console.log(response);
    const data = {
      id: response.data.status.id,
      runningCount: response.data.status.runningCount,
      stoppedCount: response.data.status.stoppedCount,
      invalidCount: response.data.status.invalidCount,
      disabledCount: response.data.status.disabledCount,
      parameterContextId: response.data.status.parameterContextId,
    };
    yield put(NamespacesActions.deployClusterSuccess(data));
  }
  if (!response.ok) {
    toast.error(response.data.message);
  }
}

export function* upgradeCluster(api) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const checkDestCluster = yield select(
    NamespacesSelectors.getCheckDestCluster
  );
  const formData = yield select(NamespacesSelectors.getFormData);
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  api.headers['x-cluster-id'] = destClusterToken?.id;
  api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'upgradeCluster',
    loadingSection: 'upgradeCluster',
    apiMethod: api.upgradeCluster,
    apiParams: [
      {
        clusterId: selectedDestCluster?.value,
        namespaceId: checkDestCluster?.id,
        version: formData.version || checkDestCluster?.version,
      },
    ],
    successAction: NamespacesActions.deployClusterSuccess,
  });

  if (response.ok && response.data?.requestId) {
    yield call(clusterProgress, api);
  }

  if (!response.ok) {
    toast.error(response.data.message);
  }
}

export function* clusterProgress(api) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  api.headers['x-cluster-id'] = destClusterToken?.id;
  api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'clusterProgress',
    loadingSection: 'clusterProgress',
    apiMethod: api.clusterProgress,
    apiParams: [
      {
        clusterId: selectedDestCluster?.value,
        progressId: deployOrUpgradeDetails.requestId,
      },
    ],
    successAction: NamespacesActions.deployClusterSuccess,
  });

  if (response.ok && response.data?.percentCompleted < 100) {
    delay(1000);
    yield call(clusterProgress, api);
  } else if (response.ok && response.data?.percentCompleted === 100) {
    yield call(clusterProgressDelete, api);
  }
  if (!response.ok) {
    toast.error(response.data.message);
  }
}

export function* clusterProgressDelete(api) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  api.headers['x-cluster-id'] = destClusterToken?.id;
  api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'clusterProgressDelete',
    loadingSection: 'clusterProgressDelete',
    apiMethod: api.clusterProgressDelete,
    apiParams: [
      {
        clusterId: selectedDestCluster?.value,
        progressId: deployOrUpgradeDetails.requestId,
      },
    ],
    // successAction: NamespacesActions.deployClusterSuccess,
  });
  if (response.ok) {
    yield call(getCountDetails, api);
  } else {
    toast.error(response.data.message);
  }
}

export function* getCountDetails(api) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const checkDestCluster = yield select(
    NamespacesSelectors.getCheckDestCluster
  );
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  api.headers['x-cluster-id'] = destClusterToken?.id;
  api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'getCountDetails',
    loadingSection: 'getCountDetails',
    apiMethod: api.getCountDetails,
    apiParams: [
      {
        clusterId: selectedDestCluster?.value,
        namespaceId: checkDestCluster?.id,
      },
    ],
    successAction: NamespacesActions.deployClusterSuccess,
  });

  if (response.ok) yield put(NamespacesActions.setDeployedModal());
  else toast.error(response.data.message);
}

export function* fetchParameterContext(api) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  api.headers['x-cluster-id'] = destClusterToken?.id;
  api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'fetchParameterContext',
    loadingSection: 'fetchParameterContext',
    apiMethod: api.fetchParameterContext,
    apiParams: [
      {
        clusterId: selectedDestCluster?.value,
        parameterId: deployOrUpgradeDetails?.parameterContextId,
      },
    ],
    successAction: NamespacesActions.setParameterDetails,
  });
  if (response.ok) yield put(NamespacesActions.setDeployedModal());
  else toast.error(response.data.message);
}

export function* namespacesSagas(api) {
  yield all([
    takeLatest(NamespacesActions.fetchNamespaces, fetchNamespaces, api),
    takeLatest(NamespacesActions.fetchDestNamespaces, fetchDestNamespaces, api),
    takeLatest(NamespacesActions.checkDestCluster, checkDestCluster, api),
    takeLatest(NamespacesActions.deployCluster, deployCluster, api),
    takeLatest(
      NamespacesActions.updateNamespaceStatus,
      updateNamespaceStatus,
      api
    ),
    takeLatest(NamespacesActions.upgradeCluster, upgradeCluster, api),
    takeLatest(NamespacesActions.clusterProgress, clusterProgress, api),
    takeLatest(
      NamespacesActions.clusterProgressDelete,
      clusterProgressDelete,
      api
    ),
    takeLatest(NamespacesActions.getCountDetails, getCountDetails, api),
    takeLatest(
      NamespacesActions.fetchParameterContext,
      fetchParameterContext,
      api
    ),
  ]);
}
