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
      .addCase(FlowValidationActions.createRuleSuccess, createRuleSuccess);
  }
);
