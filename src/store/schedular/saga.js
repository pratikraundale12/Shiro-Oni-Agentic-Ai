// import { CLUSTERS_TOKEN } from '../../constants';
import { SchedularActions } from './redux';
import { call, all, takeLatest } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { toast } from 'react-toastify';
export function* createScheduleDeployment(api, { payload }) {
  console.log([payload], '?????? gen fun');
  // const clusters = JSON.parse(localStorage.getItem(CLUSTERS_TOKEN) || '[]');
  // const destClusterToken = clusters?.find(
  //   cluster => cluster.id === selectedDestCluster?.value
  // );
  // api.headers['x-cluster-id'] = destClusterToken?.id;
  // api.headers['x-cluster-token'] = destClusterToken?.token;
  const response = yield call(requestSaga, {
    errorSection: 'createScheduleDeployment',
    loadingSection: 'createScheduleDeployment',
    apiMethod: api.createScheduleDeployment,
    apiParams: [{ payload }],
  });
  if (response.ok) {
    console.log(response);
  } else toast.error(response.data.message);
}

export function* schedularSagas(api) {
  yield all([
    takeLatest(
      SchedularActions.createScheduleDeployment,
      createScheduleDeployment,
      api
    ),
  ]);
}
