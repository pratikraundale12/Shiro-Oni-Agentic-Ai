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
  fetchRegistryDetails: createAction(`${prefix}fetchRegistryDetails`),
  addFlowToRegistry: createAction(`${prefix}addFlowToRegistry`),
  addFlowToRegistryFailure: createAction(`${prefix}addFlowToRegistryFailure`),
  addFlowToRegistryInventory: createAction(
    `${prefix}addFlowToRegistryInventory`
  ),
  addFlowToRegistryInventoryFailure: createAction(
    `${prefix}addFlowToRegistryInventoryFailure`
  ),
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
  setIsFlowJsonSaved: createAction(`${prefix}setIsFlowJsonSaved`),

  fetchSessionId: createAction(`${prefix}fetchSessionId`),
  getSessionIdSuccess: createAction(`${prefix}getSessionIdSuccess`),
  setSessionId: createAction(`${prefix}setSessionId`),
  setSessionIdError: createAction(`${prefix}setSessionIdError`),

  fetchMessageChatAi: createAction(`${prefix}fetchMessageChatAi`),
  messageChatAiSuccess: createAction(`${prefix}messageChatAiSuccess`), // removable
  messageChatAiFailure: createAction(`${prefix}messageChatAiFailure`), // removable
  setMessageChatAi: createAction(`${prefix}setMessageChatAi`),
  setMessageChatAiError: createAction(`${prefix}setMessageChatAiError`),
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
  isFlowJsonSaved: false,

  sessionId: {} || null,
  sessionIdError: {},

  messageChatAi: {},
  messageChatAiError: {},
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
  getIsflowJsonSaved: state => state.aiFlowGenerator.isFlowJsonSaved,

  getSessionId: state => state.aiFlowGenerator.sessionId,
  getSessionIdError: state => state.aiFlowGenerator.sessionIdError,

  getMessageChatAi: state => state.aiFlowGenerator.messageChatAi,
  getMessageChatAiError: state => state.aiFlowGenerator.messageChatAiError,
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

const setIsFlowJsonSaved = (state, { payload }) => {
  return {
    ...state,
    isFlowJsonSaved: payload,
  };
};

const setSessionId = (state, { payload }) => {
  return {
    ...state,
    sessionId: payload,
  };
};

const setSessionIdError = (state, { payload }) => {
  return {
    ...state,
    sessionIdError: payload,
  };
};

const getSessionIdSuccess = (state, { payload }) => {
  return {
    ...state,
    sessionId: payload,
  };
};

const messageChatAiSuccess = (state, { payload }) => {
  return {
    ...state,
    messageChatAi: payload,
  };
};

const messageChatAiFailure = (state, { payload }) => {
  return {
    ...state,
    messageChatAiError: payload,
  };
};

const setMessageChatAi = (state, { payload }) => {
  return {
    ...state,
    messageChatAi: payload,
  };
};

const setMessageChatAiError = (state, { payload }) => {
  return {
    ...state,
    messageChatAiError: payload,
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
      )
      .addCase(AiFlowGeneratorActions.setIsFlowJsonSaved, setIsFlowJsonSaved)
      .addCase(AiFlowGeneratorActions.getSessionIdSuccess, getSessionIdSuccess)
      .addCase(AiFlowGeneratorActions.setSessionIdError, setSessionIdError)
      .addCase(AiFlowGeneratorActions.setSessionId, setSessionId)
      .addCase(
        AiFlowGeneratorActions.messageChatAiSuccess,
        messageChatAiSuccess
      )
      .addCase(
        AiFlowGeneratorActions.messageChatAiFailure,
        messageChatAiFailure
      )
      .addCase(AiFlowGeneratorActions.setMessageChatAi, setMessageChatAi)
      .addCase(
        AiFlowGeneratorActions.setMessageChatAiError,
        setMessageChatAiError
      );
  }
);
