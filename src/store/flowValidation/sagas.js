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

export function* flowValidationSagas(api) {
  yield all([
    takeLatest(FlowValidationActions.ruleScopeFetch, ruleScopeFetch, api),
    takeLatest(FlowValidationActions.fetchRules, fetchRules, api),
  ]);
}
