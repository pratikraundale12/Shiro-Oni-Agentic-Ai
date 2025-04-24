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
  validateFlowJson: createAction(`${prefix}validateFlowJson`),
  validateFlowJsonSuccess: createAction(`${prefix}validateFlowJsonSuccess`),
  setValidatedFlowErrors: createAction(`${prefix}setValidatedFlowErrors`),
  setIsFlowValidatedSuccessfully: createAction(
    `${prefix}setIsFlowValidatedSuccessfully`
  ),
  setIsFlowErrorModalOpen: createAction(`${prefix}setIsFlowErrorModalOpen`),
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
  setIsFlowAddedSuccessFully: createAction(
    `${prefix}setIsFlowAddedSuccessFully`
  ),
  setIsFlowAlreadyAddedSuccessFully: createAction(
    `${prefix}setIsFlowAlreadyAddedSuccessFully`
  ),
};

/* ------------- INITIAL STATE ------------- */
export const AI_FLOW_GENERATOR_INITIAL_STATE = {
  recentFlows: [],
  generatedFlow: {},
  genFlowError: '',
  registry: [],
  newBucket: {},
  addFlowError: {},
  isFlowAddedSuccessFully: false,
  isFlowAlreadyAddedSuccessFully: false,
  validatedFlowRes: {},
  validatedFlowErrors: [],
  isFlowValidatedSuccessfully: false,
  isFlowErrorModalOpen: false,
};

/* ------------- SELECTORS ------------------ */
export const AiFlowGeneratorSelectors = {
  getRecentFlows: state => state.aiFlowGenerator.recentFlows,
  getDefaultFlows: state => state.aiFlowGenerator.defaultFlows,
  getGeneratedFlow: state => state.aiFlowGenerator.generatedFlow,
  getGenFlowError: state => state.aiFlowGenerator.genFlowError,
  getRegistry: state => state.aiFlowGenerator.registry,
  getNewBucket: state => state.aiFlowGenerator.newBucket,
  getAddNewFlowError: state => state.aiFlowGenerator.addFlowError,
  getIsFlowAddedSuccessFully: state =>
    state.aiFlowGenerator.isFlowAddedSuccessFully,
  getIsFlowAlreadyAddedSuccessFully: state =>
    state.aiFlowGenerator.isFlowAlreadyAddedSuccessFully,
  getValidatedFlowErrors: state => state.aiFlowGenerator.validatedFlowErrors,
  getIsflowValidatedSuccessfully: state =>
    state.aiFlowGenerator.isFlowValidatedSuccessfully,
  getIsFlowErrorModalOpen: state => state.aiFlowGenerator.isFlowErrorModalOpen,
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
    newBucket: payload,
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

const setIsFlowAddedSuccessFully = (state, { payload }) => {
  return {
    ...state,
    isFlowAddedSuccessFully: payload,
  };
};

const setIsFlowAlreadyAddedSuccessFully = (state, { payload }) => {
  return {
    ...state,
    isFlowAlreadyAddedSuccessFully: payload,
  };
};

const setNewBucket = (state, { payload }) => {
  return {
    ...state,
    newBucket: payload,
  };
};

const validateFlowJsonSuccess = (state, { payload }) => {
  return {
    ...state,
    validatedFlowRes: payload,
  };
};

const setValidatedFlowErrors = (state, { payload }) => {
  return {
    ...state,
    validatedFlowErrors: payload,
  };
};

const setIsFlowValidatedSuccessfully = (state, { payload }) => {
  return {
    ...state,
    isFlowValidatedSuccessfully: payload,
  };
};

const setIsFlowErrorModalOpen = (state, { payload }) => {
  return {
    ...state,
    isFlowErrorModalOpen: payload,
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
      .addCase(AiFlowGeneratorActions.setAddFlowError, setAddFlowError)
      .addCase(
        AiFlowGeneratorActions.setIsFlowAddedSuccessFully,
        setIsFlowAddedSuccessFully
      )
      .addCase(AiFlowGeneratorActions.setNewBucket, setNewBucket)
      .addCase(
        AiFlowGeneratorActions.validateFlowJsonSuccess,
        validateFlowJsonSuccess
      )
      .addCase(
        AiFlowGeneratorActions.setValidatedFlowErrors,
        setValidatedFlowErrors
      )
      .addCase(
        AiFlowGeneratorActions.setIsFlowValidatedSuccessfully,
        setIsFlowValidatedSuccessfully
      )
      .addCase(
        AiFlowGeneratorActions.setIsFlowErrorModalOpen,
        setIsFlowErrorModalOpen
      )
      .addCase(
        AiFlowGeneratorActions.setIsFlowAlreadyAddedSuccessFully,
        setIsFlowAlreadyAddedSuccessFully
      );
  }
);
