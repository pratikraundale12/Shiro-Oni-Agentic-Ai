import { createAction, createReducer } from '@reduxjs/toolkit';

const prefix = '@@KDFM-AI-FLOW-GENERATOR/';

/* ------------- ACTIONS ------------------ */
export const AiFlowGeneratorActions = {
  fetchDefaultRecentFlows: createAction(`${prefix}fetchDefaultRecentFlows`),
  fetchDefaultRecentFlowsSuccess: createAction(
    `${prefix}fetchDefaultRecentFlowsSuccess`
  ),
  fetchDefaultRecentFlowsFailure: createAction(
    `${prefix}fetchDefaultRecentFlowsFailure`
  ),
  setDefaultFlows: createAction(`${prefix}setDefaultFlows`),
  setRecentFlows: createAction(`${prefix}setRecentFlows`),
};

/* ------------- INITIAL STATE ------------- */
export const AI_FLOW_GENERATOR_INITIAL_STATE = {
  recentFlows: [],
  defaultFlows: [],
};

/* ------------- SELECTORS ------------------ */
export const AiFlowGeneratorSelectors = {
  getRecentFlows: state => state.aiFlowGenerator.recentFlows,
  getDefaultFlows: state => state.aiFlowGenerator.defaultFlows,
};

/* ------------- REDUCERS ------------------- */
const fetchDefaultRecentFlowsSuccess = (state, { payload }) => {
  return {
    ...state,
    recentFlows: payload,
  };
};

const setDefaultFlows = (state, { payload }) => {
  return {
    ...state,
    defaultFlows: payload,
  };
};

const setRecentFlows = (state, { payload }) => {
  return {
    ...state,
    recentFlows: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const aiFlowGeneratorReducer = createReducer(
  AI_FLOW_GENERATOR_INITIAL_STATE,
  builder => {
    builder
      .addCase(
        AiFlowGeneratorActions.fetchDefaultRecentFlowsSuccess,
        fetchDefaultRecentFlowsSuccess
      )
      .addCase(AiFlowGeneratorActions.setDefaultFlows, setDefaultFlows)
      .addCase(AiFlowGeneratorActions.setRecentFlows, setRecentFlows);
  }
);
