import { createAction, createReducer } from '@reduxjs/toolkit';
const prefix = '@@KDFM-AGENTIC-AI/';

/* ------------- ACTIONS ------------------ */
export const AgenticAiActions = {
  fetchSessionId: createAction(`${prefix}fetchSessionId`),
  setSessionId: createAction(`${prefix}setSessionId`),
  setSessionIdError: createAction(`${prefix}setSessionIdError`),
  fetchMessageChatAi: createAction(`${prefix}fetchMessageChatAi`),
  messageChatAiSuccess: createAction(`${prefix}messageChatAiSuccess`),
  messageChatAiFailure: createAction(`${prefix}messageChatAiFailure`),
  setMessageChatAi: createAction(`${prefix}setMessageChatAi`),
  setMessageChatAiError: createAction(`${prefix}setMessageChatAiError`),
  setAgenticAiModalFullScreen: createAction(
    `${prefix}setAgenticAiModalFullScreen`
  ),
  setConversationHistory: createAction(`${prefix}setConversationHistory`),
  resetChat: createAction(`${prefix}resetChat`),
  setAgenticAiModalOpen: createAction(`${prefix}setAgenticAiModalOpen`),
  setQueryText: createAction(`${prefix}setQueryText`),
};

/* ------------- INITIAL STATE ------------- */
export const AGENTIC_AI_INITIAL_STATE = {
  sessionId: {} || null,
  sessionIdError: {},
  messageChatAi: {},
  messageChatAiError: {},
  agenticAiModalFullScreen: false,
  conversationHistory: [],
  agenticAiModalOpen: false,
  queryText: '',
};

/* ------------- SELECTORS ------------------ */
export const AgenticAiSelectors = {
  getSessionId: state => state.agenticAI.sessionId,
  getSessionIdError: state => state.agenticAI.sessionIdError,
  getMessageChatAi: state => state.agenticAI.messageChatAi,
  getMessageChatAiError: state => state.agenticAI.messageChatAiError,
  getAgenticAiModalFullScreen: state =>
    state.agenticAI.agenticAiModalFullScreen,
  getConversationHistory: state => state.agenticAI.conversationHistory,
  getAgenticAiModalOpen: state => state.agenticAI.agenticAiModalOpen,
  getQueryText: state => state.agenticAI.queryText,
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

const setAgenticAiModalFullScreen = (state, { payload }) => {
  return {
    ...state,
    agenticAiModalFullScreen: payload,
  };
};

const setConversationHistory = (state, { payload }) => {
  return {
    ...state,
    conversationHistory: payload,
  };
};

const resetChat = state => {
  return {
    ...state,
    conversationHistory: [],
    messageChatAi: {},
    messageChatAiError: {},
  };
};
const setAgenticAiModalOpen = (state, { payload }) => {
  return {
    ...state,
    agenticAiModalOpen: payload,
  };
};

const setQueryText = (state, { payload }) => {
  return {
    ...state,
    queryText: payload,
  };
};

/* ------------- Hookup Reducers To Types ------------- */
export const agenticAiReducer = createReducer(
  AGENTIC_AI_INITIAL_STATE,
  builder => {
    builder
      .addCase(AgenticAiActions.setSessionId, setSessionId)
      .addCase(AgenticAiActions.setSessionIdError, setSessionIdError)
      .addCase(AgenticAiActions.messageChatAiSuccess, messageChatAiSuccess)
      .addCase(AgenticAiActions.messageChatAiFailure, messageChatAiFailure)
      .addCase(AgenticAiActions.setMessageChatAi, setMessageChatAi)
      .addCase(AgenticAiActions.setMessageChatAiError, setMessageChatAiError)
      .addCase(
        AgenticAiActions.setAgenticAiModalFullScreen,
        setAgenticAiModalFullScreen
      )
      .addCase(AgenticAiActions.setConversationHistory, setConversationHistory)
      .addCase(AgenticAiActions.resetChat, resetChat)
      .addCase(AgenticAiActions.setAgenticAiModalOpen, setAgenticAiModalOpen)
      .addCase(AgenticAiActions.setQueryText, setQueryText);
  }
);
