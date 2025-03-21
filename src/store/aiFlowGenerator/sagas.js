import { all, takeLatest, put, call } from 'redux-saga/effects';
import { AiFlowGeneratorActions } from './redux';
import { requestSaga } from '../helpers/request_sagas';
import { toast } from 'react-toastify';

export function* fetchDefaultRecentFlows(api) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchDefaultRecentFlows',
    loadingSection: 'fetchDefaultRecentFlows',
    apiMethod: api.fetchDefaultRecentFlows,
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
  yield put(AiFlowGeneratorActions.setGenFlowError(''));
  if (!api.generateFlowAPI) {
    console.error('generateFlowApi is undefined!');
    return;
  }
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
      console.error('JSON Parsing Error:', error.message);
      toast.error(
        'Failed to parse the server response. Please check the data format.'
      );
    }
  } else {
    const error =
      response?.message ||
      response?.data?.message ||
      'Unexpected error occurred while generating flow';
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
  ]);
}
