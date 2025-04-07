import { all, takeLatest, put, call, select } from 'redux-saga/effects';
import { AiFlowGeneratorActions, AiFlowGeneratorSelectors } from './redux';
import { requestSaga } from '../helpers/request_sagas';
import { toast } from 'react-toastify';
import { CLUSTERS_TOKEN } from '../../constants';
import { NamespacesActions, NamespacesSelectors } from '../namespaces';
import { isEmpty } from 'lodash';

export function* fetchDefaultRecentFlows(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchDefaultRecentFlows',
    loadingSection: 'fetchDefaultRecentFlows',
    apiMethod: api.fetchDefaultRecentFlows,
    apiParams: [payload],
    successAction: AiFlowGeneratorActions.fetchDefaultRecentFlowsSuccess,
  });
  if (response.ok) {
    yield put(AiFlowGeneratorActions.setRecentFlows(response?.data));
  } else {
    toast.error(
      response?.message ||
        response?.data?.message ||
        'Failed to fetch recent flows'
    );
  }
}

export function* generateFlowAPI(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  yield put(AiFlowGeneratorActions.setIsFlowAddedSuccessFully(false));
  yield put(AiFlowGeneratorActions.setNewBucket({}));
  yield put(AiFlowGeneratorActions.setGenFlowError(''));
  if (!api.generateFlowAPI) {
    console.error('generateFlowApi is undefined!');
    return;
  }
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: AiFlowGeneratorActions.generateFlowAPIFailure,
    loadingSection: 'generateFlowAPI',
    apiMethod: api.generateFlowAPI,
    apiParams: [payload],
    successAction: AiFlowGeneratorActions.generateFlowAPISuccess,
  });
  if (response.ok) {
    try {
      yield put(AiFlowGeneratorActions.setGenFlowError(''));
      const rawResponse = response?.data;
      const parsedJson =
        typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;

      if (parsedJson && typeof parsedJson === 'object') {
        yield put(AiFlowGeneratorActions.setGeneratedFlow(parsedJson));
      } else {
        throw new Error('Invalid JSON format');
      }
    } catch (error) {
      console.error('JSON Parsing Error:', error?.message);
      toast.error(
        'Failed to parse the server response. Please check the data format.'
      );
    }
  } else {
    const error =
      response?.message ||
      response?.data?.message ||
      'Unable process the generation of the flow. Please try again!';
    yield put(AiFlowGeneratorActions.setGenFlowError(error));
    toast.error(error);
  }
}

export function* deleteGeneratedFlow(api, { payload }) {
  if (!api.deleteGeneratedFlow) {
    console.error('deleteGeneratedFlow is undefined!');
    return;
  }
  const response = yield call(requestSaga, {
    errorSection: 'deleteGeneratedFlow',
    loadingSection: 'deleteGeneratedFlow',
    apiMethod: api.deleteGeneratedFlow,
    apiParams: [payload],
  });
  if (response.ok) {
    toast.success(response?.message || 'Flow deleted successfully');
    yield put(AiFlowGeneratorActions.setGeneratedFlow({}));
  } else {
    toast.error(
      response?.message || response?.data?.message || 'Failed to delete flow'
    );
  }
}

export function* updateGeneratedFlow(api, { payload }) {
  const { id, data } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'updateGeneratedFlow',
    loadingSection: 'updateGeneratedFlow',
    apiMethod: api.updateGeneratedFlow,
    apiParams: [{ id, data }],
  });
  if (response.ok) {
    yield put(AiFlowGeneratorActions.setGeneratedFlow({}));
    // toast.success('Flow updated successfully');
  } else {
    toast.error(
      response?.message || response?.data?.message || 'Failed to update flow'
    );
  }
}

export function* fetchRegistry(api) {
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
    errorSection: 'fetchRegistry',
    loadingSection: 'fetchRegistry',
    apiMethod: api.fetchRegistry,
  });
  if (response.ok) {
    yield put(AiFlowGeneratorActions.setRegistry(response?.data));
  } else {
    toast.error(
      response?.message || response?.data?.message || 'Failed to fetch registry'
    );
  }
}

export function* addFlowToRegistry(api, { payload }) {
  yield put(AiFlowGeneratorActions.setIsFlowAddedSuccessFully(false));
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const clusterId = selectedClusterToken?.id;
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: AiFlowGeneratorActions.addFlowToRegistryFailure,
    loadingSection: 'addFlowToRegistry',
    apiMethod: api.addFlowToRegistry,
    apiParams: [{ clusterId: clusterId, payload: payload }],
  });
  if (response.ok) {
    toast.success('Flow is added to the registry');
    yield put(AiFlowGeneratorActions.setIsFlowAddedSuccessFully(true));
  } else {
    yield put(AiFlowGeneratorActions.setIsFlowAddedSuccessFully(false));
    yield put(AiFlowGeneratorActions.setAddFlowError(response?.data)); // Dispatch error action
    toast.error(
      response?.message ||
        response?.data?.message ||
        'Failed to add flow to registry'
    );
  }
}

export function* addNewBucketToRegistry(api, { payload }) {
  const selectedCluster = yield select(NamespacesSelectors.getSelectedCluster);
  const registryData = yield select(AiFlowGeneratorSelectors.getRegistry);
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(
    item => item.id === selectedCluster?.value
  );
  const clusterId = selectedClusterToken?.id;
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'addNewBucketToRegistry',
    loadingSection: 'addNewBucketToRegistry',
    apiMethod: api.addNewBucketToRegistry,
    apiParams: [{ clusterId: clusterId, payload: payload }],
    successAction: AiFlowGeneratorActions.addNewBucketToRegistrySuccess,
  });
  if (response.ok) {
    toast.success('Bucket is added to the registry');
    if (!isEmpty(registryData)) {
      yield put(
        NamespacesActions.fetchRegistryData({
          registriesId: registryData[0]?.id,
        })
      );
    }
  } else {
    toast.error(
      response?.message ||
        response?.data?.message ||
        'Failed to add bucket to registry, please check Generic user details'
    );
  }
}
export function* aiFlowGeneratorSagas(api) {
  yield all([
    takeLatest(AiFlowGeneratorActions.fetchDefaultRecentFlows, action =>
      fetchDefaultRecentFlows(api, action)
    ),
    takeLatest(AiFlowGeneratorActions.generateFlowAPI, action =>
      generateFlowAPI(api, action)
    ),
    takeLatest(AiFlowGeneratorActions.deleteGeneratedFlow, action =>
      deleteGeneratedFlow(api, action)
    ),
    takeLatest(AiFlowGeneratorActions.updateGeneratedFlow, action =>
      updateGeneratedFlow(api, action)
    ),
    takeLatest(AiFlowGeneratorActions.fetchRegistry, action =>
      fetchRegistry(api, action)
    ),
    takeLatest(AiFlowGeneratorActions.addFlowToRegistry, action =>
      addFlowToRegistry(api, action)
    ),
    takeLatest(AiFlowGeneratorActions.addNewBucketToRegistry, action =>
      addNewBucketToRegistry(api, action)
    ),
  ]);
}
