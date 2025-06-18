/* eslint-disable no-unused-vars */
import { toast } from 'react-toastify';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { history } from '../../helpers/history';
import { AuthenticationActions } from '../authentication';
import { GridActions, fetchGrid } from '../grid';
import { requestSaga } from '../helpers/request_sagas';
import { SchedularActions, SchedularSelectors } from './redux';
import { NamespacesActions } from '../namespaces';

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
  } else {
    toast.error(response?.data?.error);
  }
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
  const selectedRange = yield select(SchedularSelectors.getScheduleSelectRange);
  const statusData = yield select(SchedularSelectors.getStatusFilterData);
  const search = yield select(SchedularSelectors.getSearchText);
  const scheduleModal = yield select(SchedularSelectors.getScheduleModal);
  if (response.ok) {
    toast.success(response?.data?.message);
    yield put(SchedularActions.setScheduleModal(false));
    if (rejectScheduleModal)
      yield put(SchedularActions.setRejectScheduleModal());
    if (cancelScheduleModal)
      yield put(SchedularActions.setCancelScheduleModal());
    if (approveScheduleModal)
      yield put(SchedularActions.setApproveScheduleModal());
    if (scheduleModal) yield put(SchedularActions.setScheduleModal());
    if (tokenScheduleModal) yield put(SchedularActions.setTokenScheduleModal());
    // yield put(SchedularActions.setScheduleSelectRange([]));
    yield put(
      GridActions.fetchGrid({
        module: 'scheduler',
        params: {
          page: 1,
          limit: 10,
          ...(search && { search }),
          ...(statusData &&
            statusData !== 'all' && {
              deployment_status: statusData,
            }),
          ...(selectedRange && {
            start_date: selectedRange?.[0]?.toISOString(),
            end_date: selectedRange?.[1]?.toISOString(),
          }),
        },
      })
    );
  } else toast.error(response.data.message);
}

export function* editScheduleByRegistry(api, { payload }) {
  const selectedRange = yield select(SchedularSelectors.getScheduleSelectRange);
  const statusData = yield select(SchedularSelectors.getStatusFilterData);
  const search = yield select(SchedularSelectors.getSearchText);
  const response = yield call(requestSaga, {
    errorSection: 'editScheduleByRegistry',
    loadingSection: 'editScheduleByRegistry',
    apiMethod: api.editScheduleByRegistry,
    apiParams: [{ schedularId: payload?.schedularId, state: payload?.state }],
  });
  if (response.ok) {
    yield put(SchedularActions.setCancelScheduleModal(false));
    yield put(SchedularActions.setApproveScheduleModal(false));
    yield put(
      GridActions.fetchGrid({
        module: 'scheduler',
        params: {
          page: 1,
          limit: 10,
          ...(search && { search }),
          ...(statusData &&
            statusData !== 'all' && {
              deployment_status: statusData,
            }),
          ...(selectedRange && {
            start_date: selectedRange?.[0]?.toISOString(),
            end_date: selectedRange?.[1]?.toISOString(),
          }),
        },
      })
    );
    // yield put(SchedularActions.setScheduleSelectRange([]));
    toast.success(response?.data?.message);
  } else {
    toast.error(response?.data?.error);
  }
}

export function* rejectScheduleDeployment(api, { payload }) {
  const { schedularId, ...rest } = payload;
  const selectedRange = yield select(SchedularSelectors.getScheduleSelectRange);
  const statusData = yield select(SchedularSelectors.getStatusFilterData);
  const search = yield select(SchedularSelectors.getSearchText);
  const response = yield call(requestSaga, {
    errorSection: 'rejectScheduleDeployment',
    loadingSection: 'rejectScheduleDeployment',
    apiMethod: api.rejectScheduleDeployment,
    apiParams: [{ schedularId: schedularId, payload: rest }],
  });
  if (response.ok) {
    toast.success(response?.data?.message);
    yield put(SchedularActions.setRejectScheduleModal(false));
    yield put(SchedularActions.setCancelScheduleModal(false));
    yield put(
      GridActions.fetchGrid({
        module: 'scheduler',
        params: {
          page: 1,
          limit: 10,
          ...(search && { search }),
          ...(statusData &&
            statusData !== 'all' && {
              deployment_status: statusData,
            }),
          ...(selectedRange && {
            start_date: selectedRange?.[0]?.toISOString(),
            end_date: selectedRange?.[1]?.toISOString(),
          }),
        },
      })
    );
  } else {
    toast.error(response?.data?.error);
  }
}

export function* fetchDiffScheduleData(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchDiffScheduleData',
    loadingSection: 'fetchDiffScheduleData',
    apiMethod: api.fetchDiffScheduleData,
    apiParams: [{ schedularId: payload }],
  });
  if (response.ok) {
    yield put(SchedularActions.setDiffAllData(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}
export function* fetchGroupUserData(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchGroupUserData',
    loadingSection: 'fetchGroupUserData',
    apiMethod: api.fetchGroupUserData,
    apiParams: [{ groupId: payload }],
  });
  if (response.ok) {
    yield put(SchedularActions.setListGroupMembers(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}

export function* fetchScheduleDeploymentDetails(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchScheduleDeploymentDetails',
    loadingSection: 'fetchScheduleDeploymentDetails',
    apiMethod: api.fetchScheduleDeploymentDetails,
    apiParams: [{ schedularId: payload }],
  });
  if (response.ok) {
    yield put(SchedularActions.setScheduleDeploymentDetails(response?.data));
  } else {
    toast.error(response?.data?.error);
  }
}

export function* scheduleSanityAndDeploy(api, { payload }) {
  const selectedSchedule = yield select(SchedularSelectors.getSelectedSchedule);
  const response = yield call(requestSaga, {
    errorSection: 'scheduleSanityAndDeploy',
    loadingSection: 'scheduleSanityAndDeploy',
    apiMethod: api.scheduleSanityAndDeploy,
    apiParams: [payload],
  });
  if (response.ok) {
    yield put(SchedularActions.setSanityAndDeployStatus(response?.data));
    toast.success(
      response?.data?.message ||
        'Successfully performed sanity check and deployment'
    );

    // yield put(
    //   NamespacesActions.fetchSanityReportAuditLog(
    //     response?.data?.id || selectedSchedule?.last_sanity_check_id
    //   )
    // );
    // yield put(
    //   SchedularActions.setSanityAndDeployStatus(response?.data?.sanity_detail)
    // );
  } else {
    toast.error(response?.data?.message);
    yield put(SchedularActions.setSanityAndDeployStatus(null));
    // yield put(NamespacesActions.setSanityReportAuditData(null));
    console.log('Error in scheduleSanityAndDeploy:', response?.data?.error);
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
    takeLatest(
      SchedularActions.editScheduleByRegistry,
      editScheduleByRegistry,
      api
    ),
    takeLatest(
      SchedularActions.rejectScheduleDeployment,
      rejectScheduleDeployment,
      api
    ),
    takeLatest(
      SchedularActions.fetchDiffScheduleData,
      fetchDiffScheduleData,
      api
    ),
    takeLatest(SchedularActions.fetchGroupUserData, fetchGroupUserData, api),
    takeLatest(
      SchedularActions.fetchScheduleDeploymentDetails,
      fetchScheduleDeploymentDetails,
      api
    ),
    takeLatest(
      SchedularActions.scheduleSanityAndDeploy,
      scheduleSanityAndDeploy,
      api
    ),
  ]);
}
