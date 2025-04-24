import { toast } from 'react-toastify';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { RegistryActions } from './redux';
import { requestSaga } from '../helpers/request_sagas';

export function* fetchRegistry(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchRegistry',
    loadingSection: 'fetchRegistry',
    apiMethod: api.fetchRegistry,
    apiParams: [payload],
  });

  if (response.ok) {
    yield put(RegistryActions.fetchRegistryData(response.data));
  } else {
    toast.error(response?.message || response?.data?.message);
  }
}
export function* testRegistry(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'testRegistry',
    loadingSection: 'testRegistry',
    apiMethod: api.testRegistry,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    toast.success('Test Successful');
  } else {
    toast.error(response?.data?.message);
  }
}
export function* createRegistryAfterTest(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createRegistryAfterTest',
    loadingSection: 'createRegistryAfterTest',
    apiMethod: api.createRegistryAfterTest,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    toast.success(response?.data?.message);
  } else {
    toast.error(response?.data?.message);
  }
}

export function* registrySagas(api) {
  yield all([
    takeLatest(RegistryActions.fetchRegistry, fetchRegistry, api),
    takeLatest(RegistryActions.testRegistry, testRegistry, api),
    takeLatest(
      RegistryActions.createRegistryAfterTest,
      createRegistryAfterTest,
      api
    ),
  ]);
}
