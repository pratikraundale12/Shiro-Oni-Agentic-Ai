// sagas.js
import { call, all, takeLatest } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { SettingsActions } from './redux';
import { toast } from 'react-toastify';

export function* createSettings(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createSettings',
    loadingSection: 'createSettings',
    apiMethod: api.createSettings,
    apiParams: [payload],
  });

  if (response.ok) {
    toast.success('Settings updated.');
    // yield put(RolesActions.permissionModal());
    // yield call(api, { payload: { module: 'clustersRolesAccess' } });
  } else {
    toast.error(response.data?.message || 'Something went wrong');
  }
}

export function* fetchSettings(api) {
  console.log('Fetching settings...');
  const response = yield call(requestSaga, {
    errorSection: 'fetchSettings',
    loadingSection: 'fetchSettings',
    apiMethod: api.fetchSettings,
    apiParams: [{ params: {} }],
    successAction: SettingsActions.fetchSettingsSuccess,
  });
  console.log('Fetch settings response:', response);
}

export function* settingsSagas(api) {
  yield all([
    takeLatest(SettingsActions.createSettings, createSettings, api),
    takeLatest(SettingsActions.fetchSettings, fetchSettings, api),
  ]);
}
