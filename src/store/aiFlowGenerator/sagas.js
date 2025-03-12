import { all, takeLatest, put, call } from 'redux-saga/effects';
import { AiFlowGeneratorActions } from './redux';
import { requestSaga } from '../helpers/request_sagas';
// import { toast } from 'react-toastify';
import { DEFAULT_FLOW_JSON } from '../../constants/aiFlowGenerator.constant';
import { toast } from 'react-toastify';

export function* fetchDefaultRecentFlows() {
  /* Required API Header */
  // api.headers[] = '';
  yield put(AiFlowGeneratorActions.setDefaultFlows(DEFAULT_FLOW_JSON));
  //   const response = yield call(requestSaga, {
  //     errorSection: 'fetchDefaultRecentFlows',
  //     loadingSection: 'fetchDefaultRecentFlows',
  //     apiMethod: api.fetchDefaultRecentFlows,
  //     // apiParams: [{  }],
  //     successAction: AiFlowGeneratorActions.fetchDefaultRecentFlowsSuccess,
  //   });
  //   if (response.ok) {
  //     yield put(AiFlowGeneratorActions.setDefaultFlows(response?.data));
  //     yield put(AiFlowGeneratorActions.setRecentFlows(response?.data));
  //   } else {
  //     toast.error(
  //       response?.message ||
  //         response?.data?.message ||
  //         'Failed to fetch recent flows'
  //     );
  //   }
}

export function* generateFlowAPI(api, { payload }) {
  console.log('payload--', payload, api);
  if (!api.generateFlowAPI) {
    console.error('generateFlowApi is undefined!');
    return;
  }
  const response = yield call(requestSaga, {
    errorSection: 'generateFlowAPI',
    loadingSection: 'generateFlowAPI',
    apiMethod: api.generateFlowAPI,
    apiParams: [payload],
    successAction: AiFlowGeneratorActions.generateFlowAPISuccess,
  });

  // if (response.ok) {
  //   const parsedJson = JSON.parse(response?.data?.response);
  //   yield put(AiFlowGeneratorActions.setGeneratedFlow(parsedJson));
  //   console.log('response?.data--', parsedJson);
  // } else {
  //   console.log('response--', response);
  //   toast.error(
  //     response?.message || response?.data?.message || 'Unexpected error occured'
  //   );
  // }
  if (response.ok) {
    try {
      const rawResponse = response?.data?.response;
      const parsedJson =
        typeof rawResponse === 'string' ? JSON.parse(rawResponse) : rawResponse;

      if (parsedJson && typeof parsedJson === 'object') {
        yield put(AiFlowGeneratorActions.setGeneratedFlow(parsedJson));
        console.log('Parsed JSON:', parsedJson);
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
    console.log('Response Error:', response);
    toast.error(
      response?.message ||
        response?.data?.message ||
        'Unexpected error occurred'
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
  ]);
}
