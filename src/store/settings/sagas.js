// sagas.js
import { toast } from 'react-toastify';
import { all, call, takeLatest } from 'redux-saga/effects';
import { changeFavicon } from '../../helpers';
import { fetchDashboard } from '../dashboard';
import { fetchGrid } from '../grid';
import { requestSaga } from '../helpers/request_sagas';
import { SettingsActions } from './redux';

export function* createSettings(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createSettings',
    loadingSection: 'createSettings',
    apiMethod: api.createSettings,
    apiParams: [{ payload }],
    successAction: SettingsActions.fetchSettingsSuccess,
  });

  if (response.ok) {
    if (payload.favicon) changeFavicon(URL.createObjectURL(payload.favicon));
    if (payload.title) document.title = payload.title;
    toast.success('Settings updated successfully.');
    // yield put(RolesActions.permissionModal());
    // yield call(api, { payload: { module: 'fetchSettingsSuccess' } });
  } else {
    toast.error(response.data?.message || 'Something went wrong');
  }
}

export function* fetchSettings(api, { payload = false }) {
  const for_login = payload ? { for_login: payload } : {};
  yield call(requestSaga, {
    errorSection: 'fetchSettings',
    loadingSection: 'fetchSettings',
    apiMethod: api.fetchSettings,
    apiParams: [{ params: for_login }],
    successAction: SettingsActions.fetchSettingsSuccess,
  });
}

export function* refreshSetting(api) {
  yield call(fetchGrid, api, {
    payload: { module: 'namespaces', refresh: true },
  });
  yield call(fetchDashboard, api, { payload: { refresh: true } });
}

export function* settingsSagas(api) {
  yield all([
    takeLatest(SettingsActions.createSettings, createSettings, api),
    takeLatest(SettingsActions.fetchSettings, fetchSettings, api),
    takeLatest(SettingsActions.refreshSetting, refreshSetting, api),
  ]);
}
