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
export function* addRuleScope(api, { payload }) {
  yield call(requestSaga, {
    errorSection: 'addRuleScope',
    loadingSection: 'addRuleScope',
    apiMethod: api.addRuleSCope, // Now correctly sending data
    apiParams: [payload], // payload is now properly passed
    successAction: FlowValidationActions.addRuleScopeSuccess,
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
export function* flowValidationSagas(api) {
  yield all([
    takeLatest(FlowValidationActions.ruleScopeFetch, ruleScopeFetch, api),
    takeLatest(FlowValidationActions.fetchRules, fetchRules, api),
    takeLatest(FlowValidationActions.addRuleScope, addRuleScope, api),
    takeLatest(FlowValidationActions.fetchProperty, fetchProperty, api),
  ]);
}
