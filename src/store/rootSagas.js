import { all, fork } from 'redux-saga/effects';

import { activityHistorySagas } from './activityHistory';
import { aiFlowGeneratorSagas } from './aiFlowGenerator';
import { authenticationSagas } from './authentication/sagas';
import { clustersSagas } from './clusters';
import { dashboardSagas } from './dashboard';
import { flowValidationSagas } from './flowValidation';
import { gridSagas } from './grid/sagas';
import { namespacesSagas } from './namespaces';
import { policiesSagas } from './policies';
import { rolesSagas } from './roles/sagas';
import { schedularSagas } from './schedular';
import API from './services2/api';
import { settingsSagas } from './settings';
import { usersSagas } from './users';
import { registrySagas } from './registry';

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
    // |---------------------FlowVlidation-------------------------|
    fork(flowValidationSagas, api),
    // |---------------------aiFlowGenerator-------------------------|
    fork(aiFlowGeneratorSagas, api),
    // |---------------------registry-------------------------|
    fork(registrySagas, api),
  ]);
}
