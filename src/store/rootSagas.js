import { all, fork } from 'redux-saga/effects';

import API from './services2/api';
import { activityHistorySagas } from './activityHistory';
import { authenticationSagas } from './authentication/sagas';
import { clustersSagas } from './clusters';
import { dashboardSagas } from './dashboard';
import { gridSagas } from './grid/sagas';
import { namespacesSagas } from './namespaces';
import { policiesSagas } from './policies';
import { schedularSagas } from './schedular';
import { settingsSagas } from './settings';
import { rolesSagas } from './roles/sagas';
import { usersSagas } from './users';
import { aiFlowGeneratorSagas } from './aiFlowGenerator';

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
    // |---------------------settings-------------------------|
    fork(settingsSagas, api),
    // |---------------------activityHistory-------------------------|
    fork(activityHistorySagas, api),
    // |---------------------aiFlowGenerator-------------------------|
    fork(aiFlowGeneratorSagas, api),
  ]);
}
