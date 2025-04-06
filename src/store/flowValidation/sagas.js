import { toast } from 'react-toastify';
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
    apiMethod: api.fetchPropertyApi,
    apiParams: [payload],
    successAction: FlowValidationActions.fetchPropertySuccess,
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
  const response = yield call(requestSaga, {
    errorSection: 'addRuleScope',
    loadingSection: 'addRuleScope',
    apiMethod: api.addRuleScope,
    apiParams: [payload],
    successAction: FlowValidationActions.addRuleScopeSuccess,
  });
  if (response.ok) {
    yield put(FlowValidationActions.ruleScopeFetch());
    toast.success('Rule Scope added successfully!');
  } else {
    toast.error(response?.message);
  }
}

export function* updateRuleScopeSaga(api, { payload }) {
  const { id, ...data } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'updateRuleScope',
    loadingSection: 'updateRuleScope',
    apiMethod: api.updateRuleScope,
    apiParams: [id, data],
    successAction: FlowValidationActions.updateRuleScopeSuccess,
  });
  if (response.ok) {
    yield put(FlowValidationActions.ruleScopeFetch());
    toast.success('Rule Scope updated successfully!');
  } else {
    toast.error(response?.message);
  }
}

export function* updateRuleSaga(api, { payload }) {
  const { ruleId, data } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'updateRule',
    loadingSection: 'updateRule',
    apiMethod: api.updateRuleApi,
    apiParams: [ruleId, data],
    successAction: FlowValidationActions.updateRuleSuccess,
  });
  if (response.ok) {
    yield put(FlowValidationActions.ruleScopeFetch());
    toast.success('Rule updated successfully!');
  } else {
    toast.error(response?.message);
  }
}

export function* createRuleSaga(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'createRule',
    loadingSection: 'createRule',
    apiMethod: api.createRule,
    apiParams: [payload],
    successAction: FlowValidationActions.createRuleSuccess,
  });
  if (response.ok) {
    toast.success('Rule created successfully!');
  } else {
    toast.error(response?.message);
  }
}
export function* deleteRuleScopeSaga(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteRuleScope',
    loadingSection: 'deleteRuleScope',
    apiMethod: api.deleteRuleScope,
    apiParams: [payload], // assuming payload is the ruleScope ID
    successAction: FlowValidationActions.deleteRuleScopeSuccess,
  });

  if (response.ok) {
    yield put(FlowValidationActions.ruleScopeFetch());
    toast.success('Rule Scope deleted successfully!');
  } else {
    toast.error(response?.data?.error);
  }
}

export function* deleteRuleSaga(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteRule',
    loadingSection: 'deleteRule',
    apiMethod: api.deleteRule,
    apiParams: [payload], // payload should be rule ID
    successAction: FlowValidationActions.deleteRuleSuccess,
  });
  if (response.ok) {
    toast.success('Rule deleted successfully!');
  } else {
    toast.error(response?.message || 'Failed to delete rule');
  }
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
    takeLatest(FlowValidationActions.createRule, createRuleSaga, api),
    takeLatest(FlowValidationActions.deleteRuleScope, deleteRuleScopeSaga, api),
    takeLatest(FlowValidationActions.deleteRule, deleteRuleSaga, api),
  ]);
}
