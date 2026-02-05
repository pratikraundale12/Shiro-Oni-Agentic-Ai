import { toast } from 'react-toastify';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { RegistryActions } from './redux';
import { requestSaga } from '../helpers/request_sagas';
import { GridActions } from '../grid';
import { history } from '../../helpers/history';
import { ClustersActions } from '../clusters';

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
    apiParams: [{ registryId: payload?.registryId, type: payload?.type }],
  });
  if (response.ok) {
    toast.success(
      response?.data?.message || response?.message || 'Deleted Successfully'
    );
    yield put(RegistryActions.setIsDeleteModalOpen(false));
    yield put(
      GridActions.fetchGrid({
        module: 'registry',
        params: {},
      })
    );
    if (payload?.type === 'nifi_uninstall') {
      yield put(ClustersActions.setProgressTrackingModalOpen(true));
      yield put(
        ClustersActions.setAnsibleClusterCreationResponseData(response?.data)
      );
    }
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
export function* createRegistryKubeConfig(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createRegistryKubeConfig',
    loadingSection: 'createRegistryKubeConfig',
    apiMethod: api.createRegistryKubeConfig,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    toast.success(response?.data?.message);
    yield put(RegistryActions.setiskubeConfigModalOpen(false));
    yield put(RegistryActions.fetchRegistryKubeConfigList());
  } else {
    toast.error(response?.data?.message);
  }
}

export function* fetchRegistryKubeConfigList(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchRegistryKubeConfigList',
    loadingSection: 'fetchRegistryKubeConfigList',
    apiMethod: api.fetchRegistryKubeConfigList,
    apiParams: [payload],
  });

  if (response.ok) {
    yield put(RegistryActions.setregistryKubeConfigList(response.data));
  } else {
    toast.error(response?.message || response?.data?.message);
  }
}
export function* deleteRegistryKubeConfig(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteRegistryKubeConfig',
    loadingSection: 'deleteRegistryKubeConfig',
    apiMethod: api.deleteRegistryKubeConfig,
    apiParams: [{ kubeId: payload }],
  });
  if (response.ok) {
    toast.success('Deleted Successfully');
    yield put(RegistryActions.fetchRegistryKubeConfigList());
  } else {
    toast.error(response?.data?.message);
  }
}
export function* createConfigRegistry(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createConfigRegistry',
    loadingSection: 'createConfigRegistry',
    apiMethod: api.createConfigRegistry,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    toast.success(response?.data?.message);
    yield call(history.push, '/registry-management/configuration');
  } else {
    toast.error(response?.data?.message);
  }
}
export function* fetchRegistryConfigurationList(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchRegistryConfigurationList',
    loadingSection: 'fetchRegistryConfigurationList',
    apiMethod: api.fetchRegistryConfigurationList,
    apiParams: [payload],
  });

  if (response.ok) {
    yield put(RegistryActions.setRegistryConfigurationsList(response.data));
  } else {
    toast.error(response?.message || response?.data?.message);
  }
}
export function* fetchRegistryConfigurationDefaultData(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchRegistryConfigurationDefaultData',
    loadingSection: 'fetchRegistryConfigurationDefaultData',
    apiMethod: api.fetchRegistryConfigurationDefaultData,
    apiParams: [{ type: payload }],
  });

  if (response.ok) {
    yield put(RegistryActions.setRegistryConfigDefaultData(response.data));
  } else {
    toast.error(response?.message || response?.data?.message);
  }
}

export function* deleteRegistryConfiguration(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteRegistryConfiguration',
    loadingSection: 'deleteRegistryConfiguration',
    apiMethod: api.deleteRegistryConfiguration,
    apiParams: [{ configId: payload }],
  });
  if (response.ok) {
    toast.success('Deleted Successfully');
    yield put(RegistryActions.fetchRegistryConfigurationList());
  } else {
    toast.error(response?.data?.message);
  }
}
export function* fetchRegistryConfigVersions(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchRegistryConfigVersions',
    loadingSection: 'fetchRegistryConfigVersions',
    apiMethod: api.fetchRegistryConfigVersions,
    apiParams: [{ configName: payload }],
  });

  if (response.ok) {
    yield put(RegistryActions.setregistryConfigVerions(response.data));
  } else {
    toast.error(response?.message || response?.data?.message);
  }
}
export function* createRegistryViaKube(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createRegistryViaKube',
    loadingSection: 'createRegistryViaKube',
    apiMethod: api.createRegistryViaKube,
    apiParams: [{ payload: payload }],
  });
  if (response.ok) {
    toast.success(response?.data?.message);
    yield call(history.push, '/registry-management');
    yield put(ClustersActions.setProgressTrackingModalOpen(true));
    yield put(
      ClustersActions.setAnsibleClusterCreationResponseData(response?.data)
    );
    // yield call(history.push, '/registry-management/configuration');
  } else {
    toast.error(response?.data?.message);
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
    takeLatest(
      RegistryActions.createRegistryKubeConfig,
      createRegistryKubeConfig,
      api
    ),
    takeLatest(
      RegistryActions.fetchRegistryKubeConfigList,
      fetchRegistryKubeConfigList,
      api
    ),
    takeLatest(
      RegistryActions.deleteRegistryKubeConfig,
      deleteRegistryKubeConfig,
      api
    ),
    takeLatest(RegistryActions.createConfigRegistry, createConfigRegistry, api),
    takeLatest(
      RegistryActions.fetchRegistryConfigurationList,
      fetchRegistryConfigurationList,
      api
    ),
    takeLatest(
      RegistryActions.fetchRegistryConfigurationDefaultData,
      fetchRegistryConfigurationDefaultData,
      api
    ),
    takeLatest(
      RegistryActions.deleteRegistryConfiguration,
      deleteRegistryConfiguration,
      api
    ),
    takeLatest(
      RegistryActions.fetchRegistryConfigVersions,
      fetchRegistryConfigVersions,
      api
    ),
    takeLatest(
      RegistryActions.createRegistryViaKube,
      createRegistryViaKube,
      api
    ),
  ]);
}
