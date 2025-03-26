import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-FLOWVALIDATION/';

/* ------------- ACTIONS ------------------ */
export const FlowValidationActions = {
  ruleScopeFetch: createAction(`${prefix}ruleScopeFetch`),
  fetchRuleScopeSuccess: createAction(`${prefix}fetchRuleScopeSuccess`),
  fetchRules: createAction(`${prefix}fetchRules`),
  fetchRulesSuccess: createAction(`${prefix}fetchRulesSuccess`),
};

/* ------------- INITIAL STATE ------------- */
export const FlowValidation_INITIAL_STATE = {
  ruleScopes: [],
  rules: [],
};

/* ------------- SELECTORS ------------------ */
export const FlowValidationSelectors = {
  getRuleScopes: state => state.flowValidation.ruleScopes,
  getRules: state => state.flowValidation.rules,
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

/* ------------- Hookup Reducers To Types ------------- */
export const flowValidationReducer = createReducer(
  FlowValidation_INITIAL_STATE,
  builder => {
    builder
      .addCase(
        FlowValidationActions.fetchRuleScopeSuccess,
        fetchRuleScopeSuccess
      )
      .addCase(FlowValidationActions.fetchRulesSuccess, fetchRulesSuccess);
  }
);
