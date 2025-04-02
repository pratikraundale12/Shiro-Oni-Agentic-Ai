import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-FLOWVALIDATION/';

/* ------------- ACTIONS ------------------ */
export const FlowValidationActions = {
  ruleScopeFetch: createAction(`${prefix}ruleScopeFetch`),
  fetchRuleScopeSuccess: createAction(`${prefix}fetchRuleScopeSuccess`),
  fetchRules: createAction(`${prefix}fetchRules`),
  fetchRulesSuccess: createAction(`${prefix}fetchRulesSuccess`),
  addRuleScope: createAction(`${prefix}addRuleScope`),
  addRuleScopeSuccess: createAction(`${prefix}addRuleScopeSuccess`),
  fetchProperty: createAction(`${prefix}fetchProperty`),
  fetchPropertySuccess: createAction(`${prefix}fetchPropertySuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const FlowValidation_INITIAL_STATE = {
  ruleScopes: [],
  rules: [],
  properties: [],
};

/* ------------- SELECTORS ------------------ */
export const FlowValidationSelectors = {
  getRuleScopes: state => state.flowValidation.ruleScopes,
  getRules: state => state.flowValidation.rules,
  getProperty: state => state.flowValidation.properties,
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

const addRuleScopeSuccess = (state, { payload }) => ({
  ...state,
  ruleScopes: [...state.ruleScopes, payload],
});
const fetchPropertySuccess = (state, { payload }) => ({
  ...state,
  properties: payload,
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
      .addCase(FlowValidationActions.addRuleScopeSuccess, addRuleScopeSuccess)
      .addCase(
        FlowValidationActions.fetchPropertySuccess,
        fetchPropertySuccess
      );
  }
);
