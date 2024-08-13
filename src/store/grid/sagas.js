import { call, all, put, debounce } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { GridActions } from './redux';
import { CLUSTERS_TOKEN, DEBOUNCE_DELAY } from '../../constants';

export function* fetchGrid(api, { payload: { module = '', params } }) {
  const API = {
    users: api.fetchUsers,
    clusters: api.fetchClusters,
    namespaces: api.fetchNamespaces,
  };
  let payload;
  if (module === 'clusters') payload = localStorage.getItem(CLUSTERS_TOKEN);
  const response = yield call(requestSaga, {
    errorSection: 'fetchGrid',
    loadingSection: 'fetchGrid',
    apiMethod: API[module],
    apiParams: [params, payload],
  });
  if (response.ok) {
    yield put(GridActions.fetchGridSuccess({ module, data: response.data }));
  }
}

export function* gridSagas(api) {
  yield all([debounce(DEBOUNCE_DELAY, GridActions.fetchGrid, fetchGrid, api)]);
}
