import { toast } from 'react-toastify';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { AiFlowGeneratorActions } from '../aiFlowGenerator';
import { requestSaga } from '../helpers/request_sagas';
import { FlowValidationActions } from './redux';

export function* ruleScopeFetch(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'ruleScopeApi',
    loadingSection: 'ruleScopeApi',
    apiMethod: api.ruleScopeApi,
    apiParams: [payload],
    successAction: FlowValidationActions.fetchRuleScopeSuccess,
  });
  if (!response?.ok) {
    toast.error(response?.data?.message);
  }
}
export function* fetchRules(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchRuleApi',
    loadingSection: 'fetchRuleApi',
    apiMethod: api.fetchRuleApi,
    apiParams: [payload],
    successAction: FlowValidationActions.fetchRulesSuccess,
  });
  if (!response?.ok) {
    toast.error(response?.data?.message);
  }
}
export function* fetchProperty(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchProperty',
    loadingSection: 'fetchProperty',
    apiMethod: api.fetchPropertyApi,
    apiParams: [payload],
    successAction: FlowValidationActions.fetchPropertySuccess,
  });
  if (!response?.ok) {
    toast.error(response?.data?.message);
  }
}
export function* validateRulesSaga(api, { payload }) {
  const { clusterId, namespaceId, data } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'validateRules',
    loadingSection: 'validateRules',
    apiMethod: api.validateRulesApi,
    apiParams: [clusterId, namespaceId, data],
    successAction: FlowValidationActions.validateRulesSuccess,
  });
  if (!response?.ok) {
    toast.error(response?.data?.message);
  }
}
export function* compareRulesSaga(api, { payload }) {
  const { clusterId, namespaceId, data } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'compareRules',
    loadingSection: 'compareRules',
    apiMethod: api.compareRulesApi,
    apiParams: [clusterId, namespaceId, data],
    successAction: FlowValidationActions.compareRulesSuccess,
  });
  if (!response?.ok) {
    toast.error(response?.data?.message);
  }
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
    toast.error(response?.data?.message);
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
    toast.error(response?.data?.message);
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
    toast.error(response?.data?.message);
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
    toast.error(response?.data?.message);
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
    toast.error(response?.data?.message);
  }
}

export function* deleteRuleSaga(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'deleteRule',
    loadingSection: 'deleteRule',
    apiMethod: api.deleteRule,
    apiParams: [payload],
    successAction: FlowValidationActions.deleteRuleSuccess,
  });
  if (response.ok) {
    toast.success('Rule deleted successfully!');
  } else {
    toast.error(response?.data?.message);
  }
}
export function* emailReportSaga(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'emailReport',
    loadingSection: 'emailReport',
    apiMethod: api.emailReportApi,
    apiParams: [payload],
    successAction: FlowValidationActions.emailReportSuccess,
  });

  if (response.ok) {
    toast.success('Email report triggered successfully!');
  } else {
    toast.error(response?.data?.message || 'Failed to send email report');
  }
}
export function* setRulePrioritySaga(api, { payload }) {
  const { ruleScopeId, ruleOrder } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'setRulePriority',
    loadingSection: 'setRulePriority',
    apiMethod: api.setRulePriorityApi,
    apiParams: [ruleScopeId, { ruleOrder }],
    successAction: FlowValidationActions.setRulePrioritySuccess,
  });

  if (response.ok) {
    yield put(FlowValidationActions.ruleScopeFetch());
    toast.success('Rule priority updated successfully!');
  } else {
    toast.error(response?.data?.message || 'Failed to update rule priority');
  }
}

export function* fetchFlowsSaga(api, { payload }) {
  const response = yield call(requestSaga, {
    errorSection: 'fetchFlows',
    loadingSection: 'fetchFlows',
    apiMethod: api.getFlows,
    apiParams: [payload],
    successAction: FlowValidationActions.fetchFlowsSuccess,
  });
  if (response?.ok) {
    yield put(AiFlowGeneratorActions.fetchRegistryDetails());
  } else {
    toast.error(response?.data?.message || 'Failed to fetch flows');
  }
}

export function* validateDeploymentFlowSaga(api, { payload }) {
  const { clusterId, data } = payload;
  const response = yield call(requestSaga, {
    errorSection: 'validateDeploymentFlow',
    loadingSection: 'validateDeploymentFlow',
    apiMethod: api.validateDeploymentFlow,
    apiParams: [clusterId, data],
    successAction: FlowValidationActions.validateDeploymentFlowSuccess,
  });

  if (response.ok) {
    toast.success('Deployment flow validated successfully!');
  } else {
    toast.error(
      response?.data?.message || 'Failed to validate deployment flow'
    );
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
    takeLatest(FlowValidationActions.emailReport, emailReportSaga, api),
    takeLatest(FlowValidationActions.setRulePriority, setRulePrioritySaga, api),
    takeLatest(FlowValidationActions.fetchFlows, fetchFlowsSaga, api),
    takeLatest(
      FlowValidationActions.validateDeploymentFlow,
      validateDeploymentFlowSaga,
      api
    ),
  ]);
}
