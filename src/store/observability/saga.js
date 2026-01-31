import { all, call, put, takeLatest } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { toast } from 'react-toastify';
import { ObservabilityActions } from './redux';

export function* fetchLabels(api) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchLabels',
    loadingSection: 'fetchLabels',
    apiMethod: api.fetchLabels,
    apiParams: [],
  });
  if (response.ok) {
    yield put(ObservabilityActions.setLabels(response?.data));
  } else {
    toast.error(
      response?.message || response?.data?.message || 'Failed to fetch labels'
    );
  }
}

export function* fetchLogs(api, { payload: { params } }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchLogs',
    loadingSection: 'fetchLogs',
    apiMethod: api.fetchLogs,
    apiParams: [{ params }],
  });
  if (response.ok) {
    yield put(ObservabilityActions.setLogs(response?.data));
  } else {
    toast.info(
      response?.message ||
        response?.data?.message ||
        'Unable to fetch logs at this moment.'
    );
  }
}

export function* observabilitySagas(api) {
  yield all([
    takeLatest(ObservabilityActions.fetchLabels, fetchLabels, api),
    takeLatest(ObservabilityActions.fetchLogs, fetchLogs, api),
  ]);
}
