import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import reducer from './rootReducers';
import rootSagas from './rootSagas';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// mount it on the Store
export default configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(sagaMiddleware),
});

// then run the saga
sagaMiddleware.run(rootSagas);
