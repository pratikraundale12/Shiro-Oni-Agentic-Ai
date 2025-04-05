import { all, call, put, takeLatest } from 'redux-saga/effects';
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

export function* addRuleScopeSaga(api, { payload }) {
  yield call(requestSaga, {
    errorSection: 'addRuleScope',
    loadingSection: 'addRuleScope',
    apiMethod: api.addRuleScope,
    apiParams: [payload],
    successAction: FlowValidationActions.addRuleScopeSuccess,
  });

  // ✅ After successful addition, re-fetch updated list
  yield put(FlowValidationActions.ruleScopeFetch());
}

export function* updateRuleScopeSaga(api, { payload }) {
  const { id, ...data } = payload;
  yield call(requestSaga, {
    errorSection: 'updateRuleScope',
    loadingSection: 'updateRuleScope',
    apiMethod: api.updateRuleScope,
    apiParams: [id, data],
    successAction: FlowValidationActions.updateRuleScopeSuccess,
  });

  // After successful update, re-fetch updated list
  yield put(FlowValidationActions.ruleScopeFetch());
}

export function* updateRuleSaga(api, { payload }) {
  const { ruleId, data } = payload;
  yield call(requestSaga, {
    errorSection: 'updateRule',
    loadingSection: 'updateRule',
    apiMethod: api.updateRuleApi,
    apiParams: [ruleId, data],
    successAction: FlowValidationActions.updateRuleSuccess,
  });

  // After successful update, re-fetch the rules
  yield put(FlowValidationActions.fetchRules(ruleId));
}

export function* flowValidationSagas(api) {
  yield all([
    takeLatest(FlowValidationActions.ruleScopeFetch, ruleScopeFetch, api),
    takeLatest(FlowValidationActions.fetchRules, fetchRules, api),
    takeLatest(FlowValidationActions.fetchProperty, fetchProperty, api),
    takeLatest(FlowValidationActions.validateRules, validateRulesSaga, api),
    takeLatest(FlowValidationActions.compareRules, compareRulesSaga, api),
    takeLatest(FlowValidationActions.addRuleScope, addRuleScopeSaga, api),
    takeLatest(FlowValidationActions.updateRuleScope, updateRuleScopeSaga, api),
    takeLatest(FlowValidationActions.updateRule, updateRuleSaga, api),
  ]);
}
