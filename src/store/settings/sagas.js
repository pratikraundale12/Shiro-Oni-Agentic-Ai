// sagas.js
import { toast } from 'react-toastify';
import { all, call, takeLatest, put } from 'redux-saga/effects';
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
    yield put(SettingsActions.setIsEmailVerified(false));
    if (payload.favicon) changeFavicon(URL.createObjectURL(payload.favicon));
    if (payload.title) document.title = payload.title;
    toast.success('Settings updated successfully.');
  } else {
    toast.error(response?.message || response?.data?.message);
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
  if (response.ok && response.data) {
    yield put(SettingsActions.setSettingsData(response.data));
  } else {
    toast.error(response?.message || response?.data?.message);
  }
}

export function* downloadLogsZip(api, { payload }) {
  const { toastId, ...rest } = payload;
  yield put(SettingsActions.downloadLogsRequest());

  const response = yield call(api.downloadLogsZip, { payload: rest });

  if (response.ok && response.data) {
    const noLogs = response.headers?.['x-no-logs'] === 'true';

    if (noLogs) {
      toast.dismiss(toastId);
      toast.info('No data available for given date range.');
      yield put(SettingsActions.downloadLogsFailure());
    } else {
      const blob = new Blob([response.data], {
        type: 'application/zip',
      });

      const logsType = Array.isArray(payload.type)
        ? payload.type.join('_')
        : payload.type;
      const fileName = `logs_${logsType}_${Date.now()}.zip`;

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, fileName);
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      }

      toast.success('Logs downloaded successfully.');
      yield put(SettingsActions.downloadLogsSuccess());
    }
  } else {
    toast.dismiss(toastId);
    toast.error(response?.data?.error || 'Failed to download logs.');
    yield put(SettingsActions.downloadLogsFailure());
  }
}

export function* refreshSetting(api) {
  yield call(fetchGrid, api, {
    payload: { module: 'namespaces', refresh: true },
  });
  yield call(fetchDashboard, api, { payload: { refresh: true } });
}

export function* verifyEmail(api, payload) {
  const response = yield call(requestSaga, {
    errorSection: 'verifyEmail',
    loadingSection: 'verifyEmail',
    apiMethod: api.verifyEmail,
    successAction: SettingsActions.verifyEmailSuccess,
    apiParams: [
      {
        to_email: payload?.payload?.to_email,
        changedSmtpData: payload?.payload?.changedSmtpData,
      },
    ],
  });

  if (response.ok) {
    toast.success(
      'Verification email sent successfully. SMTP details are verified, you can proceed with saving the settings.'
    );
  } else {
    yield put(SettingsActions.setIsEmailVerified(false));
    toast.error(
      response?.message ||
        response?.data?.message ||
        'Failed to send verification email.'
    );
  }
}

export function* settingsSagas(api) {
  yield all([
    takeLatest(SettingsActions.createSettings, createSettings, api),
    takeLatest(SettingsActions.fetchSettings, fetchSettings, api),
    takeLatest(SettingsActions.refreshSetting, refreshSetting, api),
    takeLatest(SettingsActions.downloadLogsZip, downloadLogsZip, api),
    takeLatest(SettingsActions.verifyEmail, verifyEmail, api),
  ]);
}
