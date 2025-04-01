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
  updateGeneratedFlow: createAction(`${prefix}updateGeneratedFlow`),
  deleteGeneratedFlow: createAction(`${prefix}deleteGeneratedFlow`),
  fetchRegistry: createAction(`${prefix}fetchRegistry`),
  addFlowToRegistry: createAction(`${prefix}addFlowToRegistry`),
  addFlowToRegistryFailure: createAction(`${prefix}addFlowToRegistryFailure`),
  addNewBucketToRegistry: createAction(`${prefix}addNewBucketToRegistry`),
  addNewBucketToRegistrySuccess: createAction(
    `${prefix}addNewBucketToRegistrySuccess`
  ),
  setRecentFlows: createAction(`${prefix}setRecentFlows`),
  generateFlowAPI: createAction(`${prefix}generateFlowAPI`),
  generateFlowAPISuccess: createAction(`${prefix}generateFlowAPISuccess`),
  setGeneratedFlow: createAction(`${prefix}generatedFlow`),
  generateFlowAPIFailure: createAction(`${prefix}generateFlowAPIFailure`),
  setGenFlowError: createAction(`${prefix}setGenFlowError`),
  setAddFlowError: createAction(`${prefix}setAddFlowError`),
  setRegistry: createAction(`${prefix}setRegistry`),
  setNewBucket: createAction(`${prefix}setNewBucket`),
};

/* ------------- INITIAL STATE ------------- */
export const AI_FLOW_GENERATOR_INITIAL_STATE = {
  recentFlows: [],
  generatedFlow: {},
  genFlowError: '',
  registry: [],
  newBucekt: {},
  addFlowError: {},
};

/* ------------- SELECTORS ------------------ */
export const AiFlowGeneratorSelectors = {
  getRecentFlows: state => state.aiFlowGenerator.recentFlows,
  getDefaultFlows: state => state.aiFlowGenerator.defaultFlows,
  getGeneratedFlow: state => state.aiFlowGenerator.generatedFlow,
  getGenFlowError: state => state.aiFlowGenerator.genFlowError,
  getRegistry: state => state.aiFlowGenerator.registry,
  getNewBucket: state => state.aiFlowGenerator.newBucekt,
  getAddNewFlowError: state => state.aiFlowGenerator.addFlowError,
};

/* ------------- REDUCERS ------------------- */
const fetchDefaultRecentFlowsSuccess = (state, { payload }) => {
  return {
    ...state,
    recentFlows: payload,
  };
};

const setRecentFlows = (state, { payload }) => {
  return {
    ...state,
    recentFlows: payload,
  };
};

const generateFlowAPISuccess = (state, { payload }) => {
  return {
    ...state,
    generatedFlow: payload,
  };
};

const addNewBucketToRegistrySuccess = (state, { payload }) => {
  return {
    ...state,
    newBucekt: payload,
  };
};

const generateFlowAPIFailure = (state, { payload }) => {
  return {
    ...state,
    genFlowError: payload,
  };
};

const setAddFlowError = (state, { payload }) => {
  return {
    ...state,
    addFlowError: payload,
  };
};

const setGeneratedFlow = (state, { payload }) => {
  return {
    ...state,
    generatedFlow: payload,
  };
};

const setGenFlowError = (state, { payload }) => {
  return {
    ...state,
    genFlowError: payload,
  };
};

const setRegistry = (state, { payload }) => {
  return {
    ...state,
    registry: payload,
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
      .addCase(AiFlowGeneratorActions.setRecentFlows, setRecentFlows)
      .addCase(
        AiFlowGeneratorActions.generateFlowAPISuccess,
        generateFlowAPISuccess
      )
      .addCase(AiFlowGeneratorActions.setGeneratedFlow, setGeneratedFlow)
      .addCase(
        AiFlowGeneratorActions.generateFlowAPIFailure,
        generateFlowAPIFailure
      )
      .addCase(AiFlowGeneratorActions.setGenFlowError, setGenFlowError)
      .addCase(AiFlowGeneratorActions.setRegistry, setRegistry)
      .addCase(
        AiFlowGeneratorActions.addNewBucketToRegistrySuccess,
        addNewBucketToRegistrySuccess
      )
      .addCase(AiFlowGeneratorActions.setAddFlowError, setAddFlowError);
  }
);
