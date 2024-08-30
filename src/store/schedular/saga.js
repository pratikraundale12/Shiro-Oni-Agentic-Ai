// import { CLUSTERS_TOKEN } from '../../constants';
import { toast } from 'react-toastify';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { CLUSTERS_TOKEN } from '../../constants';
import { history } from '../../helpers/history';
import { requestSaga } from '../helpers/request_sagas';
import { SchedularActions, SchedularSelectors } from './redux';
import { AuthenticationActions } from '../authentication';

export function* createScheduleDeployment(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createScheduleDeployment',
    loadingSection: 'createScheduleDeployment',
    apiMethod: api.createScheduleDeployment,
    apiParams: [{ payload }],
  });
  if (response.ok) {
    toast.success('Successfully Scheduled Deployment');
    yield put(SchedularActions.setScheduleModal());
    yield call(history.push, '/schedule-deployment');
    yield put(AuthenticationActions.setRoute('schedule-deployment'));
  } else toast.error(response.data.message);
}

export function* fetchNamespaces(api, { payload }) {
  const queryParams = {
    clusterId: payload || '',
    namespaceId: '',
  };
  const clustersToken = JSON.parse(
    localStorage.getItem(CLUSTERS_TOKEN) || '[]'
  );
  const selectedClusterToken = clustersToken.find(item => item.id === payload);
  api.headers['x-cluster-id'] = selectedClusterToken?.id;
  api.headers['x-cluster-token'] = selectedClusterToken?.token;
  yield call(requestSaga, {
    errorSection: 'fetchNamespaces',
    loadingSection: 'fetchNamespaces',
    apiMethod: api.fetchNamespaces,
    apiParams: [{ queryParams }],
    successAction: SchedularActions.fetchNamespacesSuccess,
  });
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
  const rejectModelState = yield select(
    SchedularSelectors.getRejectScheduleModel
  );
  const editModelState = yield select(SchedularSelectors.getEditScheduleModel);
  const confirmRejectModel = yield select(
    SchedularSelectors.getRejectConfirmScheduleModel
  );
  const confirmScheduleModel = yield select(
    SchedularSelectors.getScheduleCofirmModel
  );
  if (response.ok) {
    toast.success('Successfully Updated Scheduled Deployment');
    if (rejectModelState) {
      yield put(SchedularActions.setRejectScheduleModal());
    }
    if (editModelState) {
      yield put(SchedularActions.setEditScheduleModel());
    }
    if (confirmRejectModel) {
      yield put(SchedularActions.setConfirmRejectScheduleModel());
    }
    if (confirmScheduleModel) {
      yield put(SchedularActions.setScheduleConfirmModel());
    }
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
    // yield call(history.push, '/schedule-deployment');
    // yield put(AuthenticationActions.setRoute('schedule-deployment'));
    yield put(SchedularActions.setSelectedSchedule(response.data));
  }
  // else yield call(history.push, '/login');
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
    takeLatest(SchedularActions.fetchNamespaces, fetchNamespaces, api),
    takeLatest(SchedularActions.checkApproverToken, checkApproverToken, api),
  ]);
}
