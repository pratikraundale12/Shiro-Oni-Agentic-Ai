// import { CLUSTERS_TOKEN } from '../../constants';
import { SchedularActions } from './redux';
import { call, all, takeLatest } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { toast } from 'react-toastify';
import { CLUSTERS_TOKEN } from '../../constants';

export function* createScheduleDeployment(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createScheduleDeployment',
    loadingSection: 'createScheduleDeployment',
    apiMethod: api.createScheduleDeployment,
    apiParams: [{ payload }],
  });
  if (response.ok) {
    toast.success('Successfully Scheduled Deployment');
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
  if (response.ok) {
    toast.success('Successfully Updated Scheduled Deployment');
  } else toast.error(response.data.message);
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
  ]);
}
