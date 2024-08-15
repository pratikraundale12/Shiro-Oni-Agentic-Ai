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
  yield call(requestSaga, {
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
        namespaceId: formData.namespaceId,
        version: formData.version || checkDestCluster?.version,
        flowId: checkDestCluster?.flowId,
        bucketId: checkDestCluster?.bucketId,
        bucketName: checkDestCluster.bucketName,
        registryId: checkDestCluster?.registryId,
      },
    ],
    successAction: NamespacesActions.deployClusterSuccess,
  });
  if (response.ok) yield put(NamespacesActions.setDeployedModal());
  else toast.error(response.data.message);
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

export function* fetchParameterContext(api, { initialCall = true }) {
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
  if (response.ok && initialCall)
    yield put(NamespacesActions.setDeployedModal());
  else toast.error(response.data.message);
}

export function* updateParameterContext(api, { payload }) {
  const { modifiedPayloadData } = payload;
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const parameterDetails = yield select(
    NamespacesSelectors.getParameterDetails
  );
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN));
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  api.headers['x-cluster-id'] = destClusterToken?.id;
  api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'updateParameterContext',
    loadingSection: 'updateParameterContext',
    apiMethod: api.updateParameterContext,
    apiParams: [
      {
        clusterId: selectedDestCluster?.value,
        parameterContextId: deployOrUpgradeDetails?.parameterContextId,
        payloadData: {
          revision: { version: parameterDetails?.version },
          parameters:
            modifiedPayloadData &&
            modifiedPayloadData?.map(item => ({
              parameter: {
                name: item.name,
                value: item.value,
                description: item.description,
                sensitive: item.sensitive,
                can_write: item.can_write,
                provided: item.provided,
              },
            })),
        },
      },
    ],
  });
  if (response.ok && !response.data?.complete && response.data?.requestId) {
    yield call(getStatusAndDeleteParameterContext, api, {
      method: 'get',
      additionalData: { requestId: response.data?.requestId },
    });
  } else toast.error(response.data.message);
}

export function* getStatusAndDeleteParameterContext(
  api,
  { method, additionalData }
) {
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
    errorSection: 'getParameterContextStatus',
    loadingSection: 'getParameterContextStatus',
    apiMethod:
      method === 'get'
        ? api.getParameterContextStatus
        : api.deleteParameterContext,
    apiParams: [
      {
        clusterId: selectedDestCluster?.value,
        parameterContextId: deployOrUpgradeDetails?.parameterContextId,
        requestId: additionalData?.requestId,
      },
    ],
  });
  if (response.ok && !response.data?.complete && response.data?.requestId) {
    delay(1000);
    yield call(getStatusAndDeleteParameterContext, api, {
      method: 'get',
      additionalData: { requestId: response.data?.requestId },
    });
  } else if (
    response.ok &&
    response.data?.complete &&
    response.data?.requestId
  ) {
    yield call(getStatusAndDeleteParameterContext, api, {
      additionalData: { requestId: response.data?.requestId },
    });
  } else if (response.ok && response.status === 204) {
    yield call(fetchParameterContext, api, { initialCall: false });
  } else toast.error(response.data.message);
}

export function* namespacesSagas(api) {
  yield all([
    takeLatest(NamespacesActions.fetchNamespaces, fetchNamespaces, api),
    takeLatest(NamespacesActions.fetchDestNamespaces, fetchDestNamespaces, api),
    takeLatest(NamespacesActions.checkDestCluster, checkDestCluster, api),
    takeLatest(NamespacesActions.deployCluster, deployCluster, api),
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
    takeLatest(
      NamespacesActions.updateParameterContext,
      updateParameterContext,
      api
    ),
    takeLatest(
      NamespacesActions.getStatusAndDeleteParameterContext,
      getStatusAndDeleteParameterContext,
      api
    ),
  ]);
}
