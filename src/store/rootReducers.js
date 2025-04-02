import { combineReducers } from 'redux';
import { resettableReducer } from 'reduxsauce';
// import { errorsReducer } from './helpers/error_redux';
import { activityHistoryReducer } from './activityHistory/redux';
import { authenticationReducer } from './authentication';
import { clustersReducer } from './clusters';
import { dashboardReducer } from './dashboard';
import { gridReducer } from './grid/redux';
import { loadingReducer } from './helpers/loading_redux';
import { namespacesReducer } from './namespaces';
import { policiesReducer } from './policies';
import { schedularReducer } from './schedular';
import { settingsReducer } from './settings';
import { rolesReducer } from './roles/redux';
import { usersReducer } from './users';
import { aiFlowGeneratorReducer } from './aiFlowGenerator';

const resettable = resettableReducer('RESET');

export default combineReducers({
  // Authorization
  auth: resettable(authenticationReducer),

  // System
  // errors: resettable(errorsReducer),
  loaders: resettable(loadingReducer),

  // Data
  grid: resettable(gridReducer),
  dashboard: resettable(dashboardReducer),
  users: resettable(usersReducer),
  clusters: resettable(clustersReducer),
  namespaces: resettable(namespacesReducer),
  roles: resettable(rolesReducer),
  policies: resettable(policiesReducer),
  schedular: resettable(schedularReducer),
  settings: resettable(settingsReducer),
  activityHistory: resettable(activityHistoryReducer),
  aiFlowGenerator: resettable(aiFlowGeneratorReducer),
});
