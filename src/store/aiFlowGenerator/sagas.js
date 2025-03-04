import { all, takeLatest, put } from 'redux-saga/effects';
import { AiFlowGeneratorActions } from './redux';
// import { requestSaga } from '../helpers/request_sagas';
// import { toast } from 'react-toastify';
import { DEFAULT_FLOW_JSON } from '../../constants/aiFlowGenerator.constant';

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

export function* aiFlowGeneratorSagas(api) {
  yield all([
    takeLatest(
      AiFlowGeneratorActions.fetchDefaultRecentFlows,
      fetchDefaultRecentFlows,
      api
    ),
  ]);
}
