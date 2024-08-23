import { all, fork } from 'redux-saga/effects';
import API from './services2/api';

import { authenticationSagas } from './authentication/sagas';
import { gridSagas } from './grid/sagas';
import { usersSagas } from './users';
import { clustersSagas } from './clusters';
import { dashboardSagas } from './dashboard';
import { namespacesSagas } from './namespaces';
import { rolesSagas } from './roles/sagas';
import { policiesSagas } from './policies';
import { schedularSagas } from './schedular';

/* ------------- API ------------- */
export const api = API.create();

export default function* root() {
  yield all([
    // |---------------------authorization-------------------------|
    fork(authenticationSagas, api),
    // |---------------------grid-------------------------|
    fork(gridSagas, api),
    // |---------------------dashboard-------------------------|
    fork(dashboardSagas, api),
    // |---------------------users-------------------------|
    fork(usersSagas, api),
    // |---------------------clusters-------------------------|
    fork(clustersSagas, api),
    // |---------------------namespaces-------------------------|
    fork(namespacesSagas, api),
    // |---------------------roles-------------------------|
    fork(rolesSagas, api),
    // |---------------------policies-------------------------|
    fork(policiesSagas, api),
    // |---------------------schedular-------------------------|
    fork(schedularSagas, api),
  ]);
}
