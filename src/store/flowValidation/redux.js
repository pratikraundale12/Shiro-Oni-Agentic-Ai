import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-FLOWVALIDATION/';

/* ------------- ACTIONS ------------------ */
export const FlowValidationActions = {
  ruleScopeFetch: createAction(`${prefix}ruleScopeFetch`),
  fetchRuleScopeSuccess: createAction(`${prefix}fetchRuleScopeSuccess`),
  fetchRules: createAction(`${prefix}fetchRules`),
  fetchRulesSuccess: createAction(`${prefix}fetchRulesSuccess`),
  fetchProperty: createAction(`${prefix}fetchProperty`),
  fetchPropertySuccess: createAction(`${prefix}fetchPropertySuccess`),
  validateRules: createAction(`${prefix}validateRules`),
  validateRulesSuccess: createAction(`${prefix}validateRulesSuccess`),
  compareRules: createAction(`${prefix}compareRules`),
  compareRulesSuccess: createAction(`${prefix}compareRulesSuccess`),
  setSelectedItem: createAction(`${prefix}setSelectedItem`),
  addRuleScope: createAction(`${prefix}addRuleScope`),
  addRuleScopeSuccess: createAction(`${prefix}addRuleScopeSuccess`),
  updateRuleScope: createAction(`${prefix}updateRuleScope`),
  updateRuleScopeSuccess: createAction(`${prefix}updateRuleScopeSuccess`),
  updateRule: createAction(`${prefix}updateRule`),
  updateRuleSuccess: createAction(`${prefix}updateRuleSuccess`),
  createRule: createAction(`${prefix}createRule`),
  createRuleSuccess: createAction(`${prefix}createRuleSuccess`),
  deleteRuleScope: createAction(`${prefix}deleteRuleScope`),
  deleteRuleScopeSuccess: createAction(`${prefix}deleteRuleScopeSuccess`),
  deleteRule: createAction(`${prefix}deleteRule`),
  deleteRuleSuccess: createAction(`${prefix}deleteRuleSuccess`),
  emailReport: createAction(`${prefix}emailReport`),
  emailReportSuccess: createAction(`${prefix}emailReportSuccess`),
  addNewAnalysisModalOpen: createAction(`${prefix}addNewAnalysisModalOpen`),
  validateRandomFlow: createAction(`${prefix}validateRandomFlow`),
  validateRandomFlowSuccess: createAction(`${prefix}validateRandomFlowSuccess`),
  savePayload: createAction(`${prefix}savePayload`),
  fetchFlows: createAction(`${prefix}fetchFlows`),
  fetchFlowsSuccess: createAction(`${prefix}fetchFlowsSuccess`),
  setRulePriority: createAction(`${prefix}setRulePriority`),
  setRulePrioritySuccess: createAction(`${prefix}setRulePrioritySuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const FlowValidation_INITIAL_STATE = {
  ruleScopes: [],
  rules: [],
  properties: [],
  validationResult: null,
  compareResult: null,
  selectedItem: null,
  addedRuleScope: null,
  updatedRuleScope: null,
  updatedRule: null,
  createdRule: null,
  emailReportResponse: null,
  addNewAnalysisModalOpen: false,
  randomFlowValidationResult: null,
  savedPayload: null,
  flows: [],
  rulePriority: null,
};

/* ------------- SELECTORS ------------------ */
export const FlowValidationSelectors = {
  getRuleScopes: state => state.flowValidation.ruleScopes,
  getRules: state => state.flowValidation.rules,
  getProperty: state => state.flowValidation.properties,
  getValidationResult: state => state.flowValidation.validationResult,
  getCompareResult: state => state.flowValidation.compareResult,
  getselectedItem: state => state.flowValidation.selectedItem,
  getAddedRuleScope: state => state.flowValidation.addedRuleScope,
  getUpdatedRuleScope: state => state.flowValidation.updatedRuleScope,
  getUpdatedRule: state => state.flowValidation.updatedRule,
  getCreatedRule: state => state.flowValidation.createdRule,
  getEmailReportResponse: state => state.flowValidation.emailReportResponse,
  getAddNewAnalysisModalOpen: state =>
    state.flowValidation.addNewAnalysisModalOpen,
  getSavedPayload: state => state.flowValidation.savedPayload,
  getRandomFlowValidationResult: state =>
    state.flowValidation.randomFlowValidationResult,
  getFlows: state => state.flowValidation.flows,
  getRulePriority: state => state.flowValidation.rulePriority,
};

/* ------------- REDUCERS ------------------- */
const fetchRuleScopeSuccess = (state, { payload }) => ({
  ...state,
  ruleScopes: payload,
});

const fetchRulesSuccess = (state, { payload }) => ({
  ...state,
  rules: payload,
});

const fetchPropertySuccess = (state, { payload }) => ({
  ...state,
  properties: payload,
});

const validateRulesSuccess = (state, { payload }) => ({
  ...state,
  validationResult: payload,
});

const compareRulesSuccess = (state, { payload }) => ({
  ...state,
  compareResult: payload,
});

const setSelectedItem = (state, { payload }) => ({
  ...state,
  selectedItem: payload,
});

const addRuleScopeSuccess = (state, { payload }) => ({
  ...state,
  addedRuleScope: payload,
});

const updateRuleScopeSuccess = (state, { payload }) => {
  const updatedData = state.ruleScopes.data.map(scope =>
    scope.id === payload.id ? payload : scope
  );

  return {
    ...state,
    updatedRuleScope: payload,
    ruleScopes: {
      ...state.ruleScopes,
      data: updatedData,
    },
  };
};
const deleteRuleScopeSuccess = (state, { payload }) => {
  const updatedList = (state.ruleScopes.data || []).filter(
    scope => scope.id !== payload
  );

  return {
    ...state,
    ruleScopes: {
      ...state.ruleScopes,
      data: updatedList,
    },
  };
};

const updateRuleSuccess = (state, { payload }) => ({
  ...state,
  updatedRule: payload,
});

const createRuleSuccess = (state, { payload }) => ({
  ...state,
  createdRule: payload,
  rules: {
    ...state.rules,
    data: [...(state.rules.data || []), payload],
  },
});
const deleteRuleSuccess = (state, { payload }) => {
  const updatedRules = (state.rules.data || []).filter(
    rule => rule.id !== payload
  );
  return {
    ...state,
    rules: {
      ...state.rules,
      data: updatedRules,
    },
  };
};
const emailReportSuccess = (state, { payload }) => ({
  ...state,
  emailReportResponse: payload,
});

const addNewAnalysisModalOpen = (state, { payload }) => ({
  ...state,
  addNewAnalysisModalOpen: payload,
});
const validateRandomFlowSuccess = (state, { payload }) => ({
  ...state,
  randomFlowValidationResult: payload,
});
const savePayload = (state, { payload }) => ({
  ...state,
  savedPayload: payload,
});

const fetchFlowsSuccess = (state, { payload }) => ({
  ...state,
  flows: payload,
});
const setRulePrioritySuccess = (state, { payload }) => ({
  ...state,
  ruleScopes: {
    ...state.ruleScopes,
    data: (state.ruleScopes.data || []).map(scope =>
      scope.id === payload.ruleScopeId
        ? { ...scope, ruleOrder: payload.ruleOrder }
        : scope
    ),
  },
});
/* ------------- Hookup Reducers To Types ------------- */
export const flowValidationReducer = createReducer(
  FlowValidation_INITIAL_STATE,
  builder => {
    builder
      .addCase(
        FlowValidationActions.fetchRuleScopeSuccess,
        fetchRuleScopeSuccess
      )
      .addCase(FlowValidationActions.fetchRulesSuccess, fetchRulesSuccess)
      .addCase(FlowValidationActions.fetchPropertySuccess, fetchPropertySuccess)
      .addCase(FlowValidationActions.validateRulesSuccess, validateRulesSuccess)
      .addCase(FlowValidationActions.setSelectedItem, setSelectedItem)
      .addCase(FlowValidationActions.compareRulesSuccess, compareRulesSuccess)
      .addCase(FlowValidationActions.addRuleScopeSuccess, addRuleScopeSuccess)
      .addCase(
        FlowValidationActions.updateRuleScopeSuccess,
        updateRuleScopeSuccess
      )
      .addCase(FlowValidationActions.updateRuleSuccess, updateRuleSuccess)
      .addCase(FlowValidationActions.createRuleSuccess, createRuleSuccess)
      .addCase(
        FlowValidationActions.deleteRuleScopeSuccess,
        deleteRuleScopeSuccess
      )
      .addCase(FlowValidationActions.deleteRuleSuccess, deleteRuleSuccess)
      .addCase(FlowValidationActions.emailReportSuccess, emailReportSuccess)
      .addCase(
        FlowValidationActions.addNewAnalysisModalOpen,
        addNewAnalysisModalOpen
      )
      .addCase(
        FlowValidationActions.validateRandomFlowSuccess,
        validateRandomFlowSuccess
      )
      .addCase(FlowValidationActions.savePayload, savePayload)
      .addCase(FlowValidationActions.fetchFlowsSuccess, fetchFlowsSuccess)
      .addCase(
        FlowValidationActions.setRulePrioritySuccess,
        setRulePrioritySuccess
      );
  }
);
