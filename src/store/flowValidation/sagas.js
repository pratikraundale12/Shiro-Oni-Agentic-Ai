import { all, call, takeLatest } from 'redux-saga/effects';
import { requestSaga } from '../helpers/request_sagas';
import { FlowValidationActions } from './redux';

export function* ruleScopeFetch(api, { payload }) {
  yield call(requestSaga, {
    errorSection: 'ruleScopeApi',
    loadingSection: 'ruleScopeApi',
    apiMethod: api.ruleScopeApi,
    apiParams: [payload],
    successAction: FlowValidationActions.fetchRuleScopeSuccess,
  });
}
export function* fetchRules(api, { payload }) {
  yield call(requestSaga, {
    errorSection: 'fetchRuleApi',
    loadingSection: 'fetchRuleApi',
    apiMethod: api.fetchRuleApi,
    apiParams: [payload],
    successAction: FlowValidationActions.fetchRulesSuccess,
  });
}
export function* fetchProperty(api, { payload }) {
  yield call(requestSaga, {
    errorSection: 'fetchProperty',
    loadingSection: 'fetchProperty',
    apiMethod: api.fetchPropertyApi, // Correctly calling the API method for fetching properties
    apiParams: [payload], // No parameters needed for this API call
    successAction: FlowValidationActions.fetchPropertySuccess, // Action to dispatch on success
  });
}
export function* validateRulesSaga(api, { payload }) {
  const { clusterId, namespaceId, data } = payload;
  yield call(requestSaga, {
    errorSection: 'validateRules',
    loadingSection: 'validateRules',
    apiMethod: api.validateRulesApi,
    apiParams: [clusterId, namespaceId, data],
    successAction: FlowValidationActions.validateRulesSuccess,
  });
}
export function* compareRulesSaga(api, { payload }) {
  const { clusterId, namespaceId, data } = payload;
  yield call(requestSaga, {
    errorSection: 'compareRules',
    loadingSection: 'compareRules',
    apiMethod: api.compareRulesApi,
    apiParams: [clusterId, namespaceId, data],
    successAction: FlowValidationActions.compareRulesSuccess,
  });
}
export function* flowValidationSagas(api) {
  yield all([
    takeLatest(FlowValidationActions.ruleScopeFetch, ruleScopeFetch, api),
    takeLatest(FlowValidationActions.fetchRules, fetchRules, api),
    takeLatest(FlowValidationActions.fetchProperty, fetchProperty, api),
    takeLatest(FlowValidationActions.validateRules, validateRulesSaga, api),
    takeLatest(FlowValidationActions.compareRules, compareRulesSaga, api),
  ]);
}
