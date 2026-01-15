import { toast } from 'react-toastify';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { RegistryActions } from './redux';
import { requestSaga } from '../helpers/request_sagas';
import { GridActions } from '../grid';

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
    toast.success(
      'Connection established successfully. The credentials are valid.'
    );
    yield put(RegistryActions.setRegistryTestSuccess(true));
  } else {
    toast.error(response?.data?.message);
    yield put(RegistryActions.setRegistryTestSuccess(false));
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
    yield put(RegistryActions.setIsAddRegistryModalOpen(false));
    yield put(RegistryActions.setRegistryTestSuccess(false));
    yield put(
      GridActions.fetchGrid({
        module: 'registry',
        params: {},
      })
    );
  } else {
    toast.error(
      response?.data?.message || response?.message || 'Error occured'
    );
  }
}

export function* deleteRegistry(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteRegistry',
    loadingSection: 'deleteRegistry',
    apiMethod: api.deleteRegistry,
    apiParams: [{ registryId: payload }],
  });
  if (response.ok) {
    toast.success('Deleted Successfully');
    yield put(RegistryActions.setIsDeleteModalOpen(false));
    yield put(
      GridActions.fetchGrid({
        module: 'registry',
        params: {},
      })
    );
  } else {
    toast.error(response?.data?.message);
  }
}

export function* editRegistry(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'editRegistry',
    loadingSection: 'editRegistry',
    apiMethod: api.editRegistry,
    apiParams: [
      { registryId: payload?.registryId, payload: { name: payload?.name } },
    ],
  });
  if (response.ok) {
    toast.success(response?.data?.message);
    yield put(RegistryActions.setIsAddRegistryModalOpen(false));
    yield put(RegistryActions.setRegistryTestSuccess(false));
    yield put(
      GridActions.fetchGrid({
        module: 'registry',
        params: {},
      })
    );
  } else {
    toast.error(response?.data?.message);
  }
}
export function* getAllRegistiesList(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'getAllRegistiesList',
    loadingSection: 'getAllRegistiesList',
    apiMethod: api.getAllRegistiesList,
    apiParams: [payload],
  });

  if (response.ok) {
    yield put(RegistryActions.setRegistriesList(response.data));
  } else {
    toast.error(response?.message || response?.data?.message);
  }
}

export function* registrySagas(api) {
  yield all([
    takeLatest(RegistryActions.fetchRegistry, fetchRegistry, api),
    takeLatest(RegistryActions.testRegistry, testRegistry, api),
    takeLatest(RegistryActions.deleteRegistry, deleteRegistry, api),
    takeLatest(
      RegistryActions.createRegistryAfterTest,
      createRegistryAfterTest,
      api
    ),
    takeLatest(RegistryActions.editRegistry, editRegistry, api),
    takeLatest(RegistryActions.getAllRegistiesList, getAllRegistiesList, api),
  ]);
}
