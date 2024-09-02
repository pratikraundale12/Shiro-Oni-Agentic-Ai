/* eslint-disable no-unused-vars */
import { toast } from 'react-toastify';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { history } from '../../helpers/history';
import { requestSaga } from '../helpers/request_sagas';
import { SchedularActions, SchedularSelectors } from './redux';
import { AuthenticationActions } from '../authentication';
import { fetchGrid } from '../grid';

export function* createScheduleDeployment(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createScheduleDeployment',
    loadingSection: 'createScheduleDeployment',
    apiMethod: api.createScheduleDeployment,
    apiParams: [{ payload }],
  });
  if (response.ok) {
    toast.success('Successfully Scheduled Deployment');
    yield put(SchedularActions.setScheduleDeployModal());
    yield call(history.push, '/schedule-deployment');
    yield put(AuthenticationActions.setRoute('schedule-deployment'));
  } else toast.error(response.data.message);
}

export function* editScheduleDeployment(api, { payload }) {
  const { schedularId, ...rest } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'editScheduleDeployment',
    loadingSection: 'editScheduleDeployment',
    apiMethod: api.editScheduleDeployment,
    apiParams: [
      {
        schedularId: schedularId,
        payloadData: rest,
      },
    ],
  });
  const rejectScheduleModal = yield select(
    SchedularSelectors.getRejectScheduleModal
  );
  const cancelScheduleModal = yield select(
    SchedularSelectors.getCancelScheduleModal
  );
  const approveScheduleModal = yield select(
    SchedularSelectors.getApproveScheduleModal
  );
  const tokenScheduleModal = yield select(
    SchedularSelectors.getTokenScheduleModal
  );
  const scheduleModal = yield select(SchedularSelectors.getScheduleModal);
  if (response.ok) {
    toast.success('Successfully Updated Scheduled Deployment');
    if (rejectScheduleModal)
      yield put(SchedularActions.setRejectScheduleModal());
    if (cancelScheduleModal)
      yield put(SchedularActions.setCancelScheduleModal());
    if (approveScheduleModal)
      yield put(SchedularActions.setApproveScheduleModal());
    if (scheduleModal) yield put(SchedularActions.setScheduleModal());
    if (tokenScheduleModal) yield put(SchedularActions.setTokenScheduleModal());
    yield call(fetchGrid, api, {
      payload: { module: 'scheduler' },
    });
  } else toast.error(response.data.message);
}

export function* checkApproverToken(api, { payload: { params } }) {
  const response = yield call(requestSaga, {
    errorSection: 'checkApproverToken',
    loadingSection: 'checkApproverToken',
    apiMethod: api.checkApproverToken,
    apiParams: [{ params: params }],
  });
  if (response.ok) {
    yield put(SchedularActions.setSelectedSchedule(response.data));
  }
}

export function* schedularSagas(api) {
  yield all([
    takeLatest(
      SchedularActions.createScheduleDeployment,
      createScheduleDeployment,
      api
    ),
    takeLatest(
      SchedularActions.editScheduleDeployment,
      editScheduleDeployment,
      api
    ),
    takeLatest(SchedularActions.checkApproverToken, checkApproverToken, api),
  ]);
}
