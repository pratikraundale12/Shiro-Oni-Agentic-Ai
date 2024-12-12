import { toast } from 'react-toastify';
import { all, call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN, KDFM } from '../../constants';
import { GridSelectors } from '../grid';
import { requestSaga } from '../helpers/request_sagas';
import { SchedularSelectors } from '../schedular/redux';
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
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
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
  const scheduleFromList = yield select(SchedularSelectors.getScheduleFromList);
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );

  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const path = yield select(NamespacesSelectors.getFlowPath);
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const srcClusterToken = clusters?.find(
    cluster => cluster.id === selectedCluster?.value
  )?.token;
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  api.headers['x-cluster-id'] = scheduleFromList
    ? selectedDestCluster.value
    : destClusterToken?.id;
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
        is_scheduled: scheduleFromList,
        sourceNamespaceId: selectedNamespace?.value,
      },
    ],
    successAction: NamespacesActions.checkDestClusterSuccess,
  });
  if (response.ok && response.data.message) {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
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
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
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
        sourceNamespaceName: selectedNamespace?.label,
        sourceNamespaceId: selectedNamespace?.value,
        sourceClusterId: selectedCluster?.value,
        ...(formData.namespaceId && { namespaceId: formData.namespaceId }),
        ...(formData.position && { position: formData.position }),
      },
    ],
    successAction: NamespacesActions.deployClusterSuccess,
  });
  if (response.ok) {
    yield put(NamespacesActions.setDeployedModal());
    yield put(NamespacesActions.setNamespaceSummaryLoadingState(false));
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
    yield put(NamespacesActions.setNamespaceSummaryLoadingState(false));
  }
}
export function* updateNamespaceStatus(api, { payload }) {
  const registryDeployNamepsaceId = yield select(
    NamespacesSelectors.getRegistryDeployResponseData
  );
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const srcClusterToken = clusters?.find(
    cluster => cluster.id === selectedCluster?.value
  );
  const sigleNamespaceData = yield select(
    NamespacesSelectors.getSingleNamespaceData
  );
  api.headers['x-cluster-id'] = selectedCluster?.value;
  api.headers['x-cluster-token'] = srcClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'updateNamespaceStatus',
    loadingSection: 'updateNamespaceStatus',
    apiMethod: api.updateNamespaceStatus,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        namespaceId: registryDeployNamepsaceId?.id || sigleNamespaceData?.id,
        state: payload,
      },
    ],
  });
  if (response.ok) {
    const responseData = {
      id: response.data.status?.id,
      nifiUrl: response.data.status?.nifiUrl,
      runningCount: response.data.status?.runningCount,
      stoppedCount: response.data.status?.stoppedCount,
      invalidCount: response.data.status?.invalidCount,
      disabledCount: response.data.status?.disabledCount,
      parameterContextId: response.data.status.parameterContextId,
    };
    yield put(NamespacesActions.setFlowControlData(responseData));
    yield put(NamespacesActions.setRegistryDeployResponseData(responseData));
    yield put(NamespacesActions.deployClusterSuccess(responseData));
  }
  if (!response.ok) {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* clusterProgress(api) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  const queryParams = {
    sourceNamespaceId: selectedNamespace?.value,
    sourceNamespaceName: selectedNamespace?.label,
  };
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
        auditId: deployOrUpgradeDetails?.auditId,
      },
      queryParams,
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
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* clusterProgressDelete(api) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getDeployOrUpgradeDetails
  );
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
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
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* getCountDetails(api) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const checkDestCluster = yield select(
    NamespacesSelectors.getCheckDestCluster
  );
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
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
  else toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
}

export function* fetchParameterContext(
  api,
  { initialCall = true, showError = false }
) {
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getRegistryDeployResponseData
  );
  const singleNamespaceData = yield select(
    NamespacesSelectors.getSingleNamespaceData
  );
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );

  const parentParameterSelectData = yield select(
    NamespacesSelectors.getParameterEditParent
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'fetchParameterContext',
    loadingSection: 'fetchParameterContext',
    apiMethod: api.fetchParameterContext,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        parameterId:
          deployOrUpgradeDetails?.parameterContextId ||
          singleNamespaceData?.parameterContextId,
        includeInherited: !parentParameterSelectData?.parent,
      },
    ],
    successAction: NamespacesActions.setParameterDetails,
  });
  if (response.ok && initialCall) {
    yield put(NamespacesActions.setDeployedModal());
    yield put(
      NamespacesActions.setParameterContextListAtDeploy(response?.data)
    );
  } else if (!response.ok || (showError && !initialCall)) {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* updateParameterContext(api, { payload }) {
  const { modifiedPayloadData } = payload;
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getRegistryDeployResponseData
  );
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const parameterDetails = yield select(
    NamespacesSelectors.getParameterDetails
  );
  const parentParameterSelectData = yield select(
    NamespacesSelectors.getParameterEditParent
  );
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  const singleNamespaceData = yield select(
    NamespacesSelectors.getSingleNamespaceData
  );
  const parentList = yield select(NamespacesSelectors.getParentListItems);
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'updateParameterContext',
    loadingSection: 'updateParameterContext',
    apiMethod: api.updateParameterContext,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        parameterContextId: parentParameterSelectData?.parent
          ? parentParameterSelectData?.id
          : parentList[0]?.parentParameterId ||
            deployOrUpgradeDetails?.parameterContextId ||
            singleNamespaceData?.parameterContextId ||
            selectedNamespace?.parameterContextId,
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

    yield put(
      NamespacesActions.setParameterEditParent({
        parent: false,
        id: '',
      })
    );
  } else {
    yield call(fetchParameterContext, api, {
      initialCall: false,
      showError: true,
    });
  }
}

export function* getStatusAndDeleteParameterContext(
  api,
  { method, additionalData }
) {
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getRegistryDeployResponseData
  );
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  const singleNamespaceData = yield select(
    NamespacesSelectors.getSingleNamespaceData
  );

  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'getParameterContextStatus',
    loadingSection: 'getParameterContextStatus',
    apiMethod:
      method === 'get'
        ? api.getParameterContextStatus
        : api.deleteParameterContext,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        parameterContextId:
          deployOrUpgradeDetails?.parameterContextId ||
          selectedNamespace?.parameterContextId ||
          singleNamespaceData?.parameterContextId,
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
  } else {
    yield call(fetchParameterContext, api, {
      initialCall: false,
      showError: !response.ok,
    });
  }
}

export function* fetchVariableList(
  api,
  { initialCall = true, showError = false }
) {
  yield put(NamespacesActions.setVariableListLoading(true));
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getRegistryDeployResponseData
  );
  const singleNamespaceData = yield select(
    NamespacesSelectors.getSingleNamespaceData
  );
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'fetchVariableList',
    loadingSection: 'fetchVariableList',
    apiMethod: api.getVariableList,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        namespaceId: deployOrUpgradeDetails?.id || singleNamespaceData?.id,
      },
    ],
    successAction: NamespacesActions.fetchVariableListSuccess,
  });
  if (response.ok && initialCall)
    yield put(NamespacesActions.setDeployedModal());
  else if (!response.ok || (showError && !initialCall))
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  if (response) {
    yield put(NamespacesActions.setVariableListLoading(false));
  }
}

export function* addVariableServices(api, { payload }) {
  yield put(NamespacesActions.setVariableListLoading(true));
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getRegistryDeployResponseData
  );
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const { variables } = payload;
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  const singleNamespaceData = yield select(
    NamespacesSelectors.getSingleNamespaceData
  );
  const variableList = yield select(NamespacesSelectors.getVariableList);
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'addVariableServices',
    loadingSection: 'addVariableServices',
    apiMethod: api.addVariableServices,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        namespaceId: deployOrUpgradeDetails?.id || singleNamespaceData?.id,
        version: variableList.version,
        variables: variables,
        sourceNamespaceName: selectedNamespace?.label,
      },
    ],
  });
  if (response.ok && response.data?.requestId) {
    yield call(getStatusAndDeleteVariables, api, {
      method: 'get',
      additionalData: { requestId: response.data?.requestId },
    });
  } else toast.error(response.data.message);
  if (response) {
    yield put(NamespacesActions.setVariableListLoading(false));
  }
}
export function* getStatusAndDeleteVariables(api, { method, additionalData }) {
  const deployOrUpgradeDetails = yield select(
    NamespacesSelectors.getRegistryDeployResponseData
  );
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  const singleNamespaceData = yield select(
    NamespacesSelectors.getSingleNamespaceData
  );

  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'getVariableServices',
    loadingSection: 'getVariableServices',
    apiMethod:
      method === 'get' ? api.getVariableServices : api.deleteVariableServices,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        namespaceId: deployOrUpgradeDetails?.id || singleNamespaceData?.id,
        requestId: additionalData?.requestId,
        sourceNamespaceName: selectedNamespace?.label,
      },
    ],
  });
  if (response.ok && !response.data?.complete && response.data?.requestId) {
    delay(1000);
    yield call(getStatusAndDeleteVariables, api, {
      method: 'get',
      additionalData: { requestId: response.data?.requestId },
    });
  } else if (
    response.ok &&
    response.data?.complete &&
    response.data?.requestId
  ) {
    yield call(getStatusAndDeleteVariables, api, {
      additionalData: { requestId: response.data?.requestId },
    });
  } else if (response.ok && method !== 'get') {
    yield call(fetchVariableList, api, { initialCall: false });
  } else toast.error(response.data.message);
}

export function* fetchNamespaceAudit(api) {
  const selectedNamespaceId = yield select(
    NamespacesSelectors.getSelectedSourceNamespace
  );
  const singleNamespaceData = yield select(
    NamespacesSelectors.getSingleNamespaceData
  );
  const response = yield call(requestSaga, {
    errorSection: 'fetchNamespaceAudit',
    loadingSection: 'fetchNamespaceAudit',
    apiMethod: api.fetchNamespaceAudit,
    apiParams: [
      {
        params: {
          recordId: selectedNamespaceId,
          nameSpaceName: singleNamespaceData?.name,
        },
        payload: {},
      },
    ],
  });
  if (response.ok)
    yield put(NamespacesActions.fetchNamespaceAuditSuccess(response.data));
  else toast.error(response.data.message);
}

export function* singleNamespaceData(api) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  // const selectedNamespace = yield select(
  //   NamespacesSelectors.getSelectedNamespace
  // );
  const srcNamespaceId = yield select(
    NamespacesSelectors.getSelectedSourceNamespace
  );
  const queryParams = {
    clusterId: selectedCluster?.value,
    namespaceId: srcNamespaceId,
  };
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'singleNamespaceData',
    loadingSection: 'singleNamespaceData',
    apiMethod: api.singleNamespaceData,
    apiParams: [{ queryParams }],
    successAction: NamespacesActions.singleNamespaceDataSuccess,
  });
  if (response.ok) {
    const responseData = {
      // id: response.data?.id,
      // nifiUrl: response.data?.id.nifiUrl,
      runningCount: response.data?.runningCount,
      stoppedCount: response.data?.stoppedCount,
      invalidCount: response.data?.invalidCount,
      disabledCount: response.data?.disabledCount,
    };
    yield put(NamespacesActions.setFlowControlData(responseData));
  }
}

export function* getControllerServiceList(api) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const selectedNamespaceId = yield select(
    NamespacesSelectors.getSingleNamespaceData
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'getAllRootControllerServiceNamespace',
    loadingSection: 'getAllRootControllerServiceNamespace',
    apiMethod: api.getAllRootControllerServiceNamespace,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        namespaceId: selectedNamespaceId?.id,
      },
    ],
    successAction: NamespacesActions.fetchVariableListSuccess,
  });
  if (response.ok)
    yield put(
      NamespacesActions.getRootControllerServiceNamespace(response?.data)
    );
  else if (!response.ok) {
    toast.error(response.data.message || 'Please login to cluster');
  }
}

export function* getAllControllerServiceListToAdd(api) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);

  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'getAllControllerServiceToAdd',
    loadingSection: 'getAllControllerServiceToAdd',
    apiMethod: api.getAllControllerServiceToAdd,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
      },
    ],
    successAction: NamespacesActions.fetchVariableListSuccess,
  });
  if (response.ok)
    yield put(NamespacesActions.setAddControllerServiceList(response?.data));
  else if (!response.ok)
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
}

export function* addControllerServiceRootLevel(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);

  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const selectedNamespaceId = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'addControllerServiceRootLevel',
    loadingSection: 'addControllerServiceRootLevel',
    apiMethod: api.addControllerServiceRootLevel,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        namespaceId: selectedNamespaceId?.value,
        payloadData: payload,
      },
    ],
  });
  if (response.ok) {
    toast.success(' Added Controller Service Successfully');
    yield put(NamespacesActions.getControllerServiceList());
    yield put(NamespacesActions.setNewlyAddedExternalServiceCS(response?.data));
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* addPropertyControllerService(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const { id, ...rest } = payload;
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'addPropertyControllerService',
    loadingSection: 'addPropertyControllerService',
    apiMethod: api.addPropertyControllerService,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        controllerId: id,
        payloadData: rest,
      },
    ],
  });
  if (response.ok) {
    toast.success(response?.data?.message);
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* getNewPropertyControllerService(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);

  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'getNewPropertyControllerService',
    loadingSection: 'getNewPropertyControllerService',
    apiMethod: api.getNewPropertyControllerService,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        type: payload?.type,
        group: payload.identifiesControllerServiceBundle.group,
        artifact: payload.identifiesControllerServiceBundle.artifact,
        version: payload.identifiesControllerServiceBundle.version,
      },
    ],
    successAction: NamespacesActions.fetchVariableListSuccess,
  });
  if (response.ok)
    yield put(
      NamespacesActions.setNewProperToAddControllerService(response?.data)
    );
  else if (!response.ok)
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
}

export function* getNewPropertyControllerServiceUpdated(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);

  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'getNewPropertyControllerServiceUpdated',
    loadingSection: 'getNewPropertyControllerServiceUpdated',
    apiMethod: api.getNewPropertyControllerServiceUpdated,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        serviceName: payload?.name,
      },
    ],
    successAction: NamespacesActions.fetchVariableListSuccess,
  });
  if (response.ok)
    yield put(
      NamespacesActions.setNewProperToAddControllerService(response?.data?.data)
    );
  else if (!response.ok)
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
}

export function* addControllerServicePropertyByDropdown(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);

  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const selectedNamespaceId = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'addControllerServicePropertyByDropdown',
    loadingSection: 'addControllerServicePropertyByDropdown',
    apiMethod: api.addControllerServicePropertyByDropdown,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        payloadData: payload,
        namespaceId: selectedNamespaceId?.value,
      },
    ],
  });
  if (response.ok) {
    toast.success('Proprty Added Successfully');
    yield put(NamespacesActions.setResponseNewAddedProprty(response?.data));
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* changeStatusControllerService(api, { payload }) {
  yield put(NamespacesActions.setChangeStatusCSRespone({}));
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const { id, ...rest } = payload;
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'changeStatusControllerService',
    loadingSection: 'changeStatusControllerService',
    apiMethod: api.changeStatusControllerService,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        payloadData: rest,
        controllerId: id,
      },
    ],
  });
  if (response.ok) {
    toast.success('Status updated Successfully');
    yield delay(400);
    yield put(NamespacesActions.getControllerServiceList());
    yield put(NamespacesActions.setChangeStatusCSRespone(response));
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
    yield put(NamespacesActions.setChangeStatusCSRespone({}));
  }
}

export function* deleteControllerService(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const { id, ...rest } = payload;
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'deleteControllerService',
    loadingSection: 'deleteControllerService',
    apiMethod: api.deleteControllerService,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        payloadData: rest,
        controllerId: id,
      },
    ],
  });
  if (response.ok) {
    toast.success('Controller service deleted Successfully');
    yield delay(100);
    yield put(NamespacesActions.getControllerServiceList());
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* fetchNamespacesForDestiationCluster(api, { payload }) {
  const selectedDestCluster = yield select(
    NamespacesSelectors.getSelectedDestCluster
  );
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const destClusterToken = clusters?.find(
    cluster => cluster.id === selectedDestCluster?.value
  );
  api.headers['x-cluster-id'] = destClusterToken?.id;
  api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'fetchNamespacesForDestiationCluster',
    loadingSection: 'fetchNamespacesForDestiationCluster',
    apiMethod: api.fetchNamespacesForDestiationCluster,
    apiParams: [
      {
        clusterId: selectedDestCluster?.id,
        namespaceId: payload,
      },
    ],
    successAction: NamespacesActions.fetchNamespacesSuccess,
  });
  if (response.ok) {
    yield put(
      NamespacesActions.setChildLevelDeployProcessorData(response?.data)
    );
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* fetchRegistryData(api) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const gridData = yield select(
    GridSelectors.getNamespaceGridRegistry,
    'namespaces'
  );
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'fetchRegistryData',
    loadingSection: 'fetchRegistryData',
    apiMethod: api.fetchRegistryData,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        registriesId: gridData?.id,
      },
    ],
  });
  if (response.ok) {
    yield put(NamespacesActions.setBucketListDropDownData(response?.data));
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* fetchFlowNameList(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const gridData = yield select(
    GridSelectors.getNamespaceGridRegistry,
    'namespaces'
  );
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );

  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'fetchFlowNameList',
    loadingSection: 'fetchFlowNameList',
    apiMethod: api.fetchFlowNameList,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        registriesId: gridData?.id,
        bucketId: payload,
      },
    ],
  });
  if (response.ok) {
    yield put(NamespacesActions.setFlowListRegistry(response?.data));
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* fetchVersionData(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const gridData = yield select(
    GridSelectors.getNamespaceGridRegistry,
    'namespaces'
  );
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );

  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'fetchVersionData',
    loadingSection: 'fetchVersionData',
    apiMethod: api.fetchVersionData,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        registriesId: gridData?.id,
        bucketId: payload?.bucketId,
        flowId: payload?.flowId,
      },
    ],
  });
  if (response.ok) {
    yield put(NamespacesActions.setVersionListData(response?.data));
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* fetchRegistryFlowDetails(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const selectedNamespace = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const isUpgrade = yield select(NamespacesSelectors.getDeployRegistryFlow);

  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'fetchRegistryFlowDetails',
    loadingSection: 'fetchRegistryFlowDetails',
    apiMethod: api.fetchRegistryFlowDetails,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        namespaceId: !isUpgrade ? selectedNamespace?.id : null,
        bucketId: payload?.bucketId,
        flowId: payload?.flowId,
        version: payload?.version,
        isUpgrade: !isUpgrade,
      },
    ],
  });
  if (response.ok) {
    yield put(NamespacesActions.setRegistryAllDetails(response?.data));
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* deployNamespaceByRegistryFlow(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'deployNamespaceByRegistryFlow',
    loadingSection: 'deployNamespaceByRegistryFlow',
    apiMethod: api.deployCluster,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        payload: payload,
      },
    ],
  });
  if (response.ok) {
    yield put(NamespacesActions.setDeployedModal(true));
    yield put(NamespacesActions.setRegistryDeployResponseData(response?.data));
  } else {
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}
export function* upgradeCluster(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const srcClusterToken = clusters?.find(
    cluster => cluster.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedCluster?.value;
  api.headers['x-cluster-token'] = srcClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'upgradeCluster',
    loadingSection: 'upgradeCluster',
    apiMethod: api.upgradeCluster,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        payload,
      },
    ],
    successAction: NamespacesActions.deployClusterSuccess,
  });

  if (response.ok) {
    yield put(NamespacesActions.setUpdatedNamespaceResponse(response));
    yield put(NamespacesActions.setRegistryDeployResponseData(response?.data));
    yield put(NamespacesActions.setDeployedModal(true));
    yield put(NamespacesActions.setFlowControlAfterUpgrade(true));
    toast.success(response?.data?.message);
  }

  if (!response.ok) {
    toast.error(response.message || KDFM.SOMETHING_WENT_WRONG);
  }
}

export function* updateNamespaceStatusRegistry(api, { payload }) {
  const checkDestCluster = yield select(
    NamespacesSelectors.getSelectedNamespace
  );
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  const srcClusterToken = clusters?.find(
    cluster => cluster.id === selectedCluster?.value
  );
  api.headers['x-cluster-id'] = selectedCluster?.value;
  api.headers['x-cluster-token'] = srcClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'updateNamespaceStatus',
    loadingSection: 'updateNamespaceStatus',
    apiMethod: api.updateNamespaceStatus,
    apiParams: [
      {
        clusterId: selectedCluster?.value,
        namespaceId: checkDestCluster?.id,
        state: payload,
      },
    ],
  });
  if (response.ok) {
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
    toast.error(response.data.message || KDFM.SOMETHING_WENT_WRONG);
  }
}
//
export function* namespacesSagas(api) {
  yield all([
    takeLatest(NamespacesActions.fetchNamespaces, fetchNamespaces, api),
    takeLatest(NamespacesActions.singleNamespaceData, singleNamespaceData, api),
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
    takeLatest(NamespacesActions.addVariableServices, addVariableServices, api),
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
    takeLatest(
      NamespacesActions.getStatusAndDeleteVariables,
      getStatusAndDeleteVariables,
      api
    ),
    takeLatest(NamespacesActions.fetchVariableList, fetchVariableList, api),
    takeLatest(NamespacesActions.fetchNamespaceAudit, fetchNamespaceAudit, api),
    takeLatest(
      NamespacesActions.getControllerServiceList,
      getControllerServiceList,
      api
    ),
    takeLatest(
      NamespacesActions.getAllControllerServiceListToAdd,
      getAllControllerServiceListToAdd,
      api
    ),
    takeLatest(
      NamespacesActions.addControllerServiceRootLevel,
      addControllerServiceRootLevel,
      api
    ),
    takeLatest(
      NamespacesActions.addPropertyControllerService,
      addPropertyControllerService,
      api
    ),
    takeLatest(
      NamespacesActions.getNewPropertyControllerService,
      getNewPropertyControllerService,
      api
    ),
    takeLatest(
      NamespacesActions.getNewPropertyControllerServiceUpdated,
      getNewPropertyControllerServiceUpdated,
      api
    ),
    takeLatest(
      NamespacesActions.addControllerServicePropertyByDropdown,
      addControllerServicePropertyByDropdown,
      api
    ),
    takeLatest(
      NamespacesActions.changeStatusControllerService,
      changeStatusControllerService,
      api
    ),
    takeLatest(
      NamespacesActions.deleteControllerService,
      deleteControllerService,
      api
    ),
    takeLatest(
      NamespacesActions.fetchNamespacesForDestiationCluster,
      fetchNamespacesForDestiationCluster,
      api
    ),
    takeLatest(NamespacesActions.fetchRegistryData, fetchRegistryData, api),
    takeLatest(NamespacesActions.fetchFlowNameList, fetchFlowNameList, api),
    takeLatest(NamespacesActions.fetchVersionData, fetchVersionData, api),
    takeLatest(
      NamespacesActions.fetchRegistryFlowDetails,
      fetchRegistryFlowDetails,
      api
    ),
    takeLatest(
      NamespacesActions.deployNamespaceByRegistryFlow,
      deployNamespaceByRegistryFlow,
      api
    ),
    takeLatest(
      NamespacesActions.updateNamespaceStatusRegistry,
      updateNamespaceStatusRegistry,
      api
    ),
  ]);
}
//
