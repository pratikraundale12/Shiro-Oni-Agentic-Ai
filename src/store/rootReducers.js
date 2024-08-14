import { combineReducers } from 'redux';
import { resettableReducer } from 'reduxsauce';

// import { errorsReducer } from './helpers/error_redux';
import { loadingReducer } from './helpers/loading_redux';
import { authenticationReducer } from './authentication';
import { gridReducer } from './grid/redux';
import { usersReducer } from './users';
import { clustersReducer } from './clusters';
import { dashboardReducer } from './dashboard';
import { namespacesReducer } from './namespaces';

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
});
