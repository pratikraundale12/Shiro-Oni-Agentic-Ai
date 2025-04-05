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
  validateRules: createAction(`${prefix}validateRules`), // New
  validateRulesSuccess: createAction(`${prefix}validateRulesSuccess`), // New
  compareRules: createAction(`${prefix}compareRules`), // New
  compareRulesSuccess: createAction(`${prefix}compareRulesSuccess`), // New
  setSelectedItem: createAction(`${prefix}setSelectedItem`),
  addRuleScope: createAction(`${prefix}addRuleScope`),
  addRuleScopeSuccess: createAction(`${prefix}addRuleScopeSuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const FlowValidation_INITIAL_STATE = {
  ruleScopes: [],
  rules: [],
  properties: [],
  validationResult: null, // New
  compareResult: null,
  selectedItem: null,
  addedRuleScope: null,
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
      .addCase(FlowValidationActions.addRuleScopeSuccess, addRuleScopeSuccess);
  }
);
