import { call, put } from 'redux-saga/effects';
// import { ErrorsActions } from './error_redux';
import { LoadingActions } from './loading_redux';
// import { AuthorizationActions } from '../authorization/redux';
import {
  CLUSTERS_TOKEN,
  RESPONSE_DATA_CODE,
  STATUS_CODE,
} from '../../constants';
import { toast } from 'react-toastify';

export function* requestSaga({
  // errorSection,
  loadingSection,
  apiMethod,
  apiParams = [],
  successAction = () => null,
  clusterId,
}) {
  // yield put(ErrorsActions.clearError(errorSection));
  yield put(LoadingActions.startLoading(loadingSection));
  const response = yield call(apiMethod, ...apiParams);
  yield put(LoadingActions.stopLoading(loadingSection));
  if (response.ok) {
    const action = successAction(response.data);
    if (action) {
      yield put(action);
    }
  } else if (
    !response.ok &&
    response.status === 500 &&
    response.data.message.includes('Token Expired')
  ) {
    toast.error(response.data.message);
    const clustersToken = JSON.parse(
      localStorage.getItem(CLUSTERS_TOKEN) || '[]'
    );
    const filteredClustersToken = clustersToken.filter(
      cluster => cluster.id !== clusterId
    );
    localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify(filteredClustersToken));
  } else if (
    response?.status === STATUS_CODE.UNAUTHORIZED &&
    response?.data?.code === RESPONSE_DATA_CODE.TOKEN_NOT_VALID
  ) {
    console.log('logout');
    // yield put(AuthorizationActions.logout());
  } else {
    // yield put(
    //   ErrorsActions.showError(errorSection, response.data, response.problem)
    // );
  }
  return response;
}
