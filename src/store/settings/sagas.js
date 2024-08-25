// sagas.js
import { call, all, takeLatest } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { SettingsActions } from './redux';
import { toast } from 'react-toastify';
import { fetchGrid } from '../grid';

export function* createSettings(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createSettings',
    loadingSection: 'createSettings',
    apiMethod: api.createSettings,
    apiParams: [{ payload }],
    successAction: SettingsActions.fetchSettingsSuccess,
  });

  if (response.ok) {
    toast.success('Settings updated.');
    // yield put(RolesActions.permissionModal());
    // yield call(api, { payload: { module: 'fetchSettingsSuccess' } });
  } else {
    toast.error(response.data?.message || 'Something went wrong');
  }
}

export function* fetchSettings(api) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchSettings',
    loadingSection: 'fetchSettings',
    apiMethod: api.fetchSettings,
    apiParams: [{ params: {} }],
    successAction: SettingsActions.fetchSettingsSuccess,
  });
  console.log('Fetch settings response:', response);
}

export function* refreshSetting(api) {
  yield call(fetchGrid, api, { payload: { module: 'namespaces' } });
}

export function* settingsSagas(api) {
  yield all([
    takeLatest(SettingsActions.createSettings, createSettings, api),
    takeLatest(SettingsActions.fetchSettings, fetchSettings, api),
    takeLatest(SettingsActions.refreshSetting, refreshSetting, api),
  ]);
}
