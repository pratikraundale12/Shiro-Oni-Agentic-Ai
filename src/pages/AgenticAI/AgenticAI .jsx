import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import {
  AgenticAiActions,
  AgenticAiSelectors,
  ClustersActions,
  ClustersSelectors,
  LoadingSelectors,
} from '../../store';
import { KDFM } from '../../constants';
import { formattedTime } from '../AiFlowGenerator/utils';
import { AgenticAiDisclaimer } from './AgenticAiDisclaimer';
import { AgenticAiWelcome } from './AgenticAiWelcome';
import { AgenticAiMessageList } from './AgenticAiMessageList';
import { AgenticAiFooter } from './AgenticAiFooter';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  position: relative;
  border-radius: 0 0 16px 16px;
  overflow: hidden;
`;

const ContentArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: ${props => (props.hasMessages ? 'flex-start' : 'center')};
  scroll-behavior: smooth;
`;

export const AgenticAI = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [queryText, setQueryText] = useState('');
  const sessionId = useSelector(AgenticAiSelectors.getSessionId);
  const [pendingAutoSend, setPendingAutoSend] = useState(null);
  const isSessionFetching = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchSessionId')
  );
  const isSessionReady = useCallback(() => {
    return (
      sessionId && typeof sessionId === 'string' && sessionId.trim().length > 0
    );
  }, [sessionId]);
  const reduxQueryText = useSelector(AgenticAiSelectors.getQueryText);
  const conversationalRes = useSelector(
    AgenticAiSelectors.getConversationHistory
  );
  const apiResponse = useSelector(AgenticAiSelectors.getMessageChatAi);
  const apiError = useSelector(AgenticAiSelectors.getMessageChatAiError);
  const inputRef = useRef(null);
  const isLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchMessageChatAi')
  );
  const isFullscreen = useSelector(
    AgenticAiSelectors.getAgenticAiModalFullScreen
  );
  const loginData = useSelector(
    ClustersSelectors.getIsClusterLoggedInSuccessfully
  );
  const loginFromAgent = useSelector(ClustersSelectors.getIsLoggedInFromAgent);

  useEffect(() => {
    const { loggedInSuccessfully, switchedSuccessfully, cluster } =
      loginData || {};

    if (loginFromAgent) {
      const clusterName = cluster?.name || 'Cluster';
      let infoMessage = null;

      if (loggedInSuccessfully && !switchedSuccessfully) {
        infoMessage = {
          role: 'info',
          infoType: 'login',
          data: `Logged in to the **${clusterName}**`,
        };
      } else if (!loggedInSuccessfully && switchedSuccessfully) {
        infoMessage = {
          role: 'info',
          infoType: 'switch',
          data: `Switched to the **${clusterName}**`,
        };
      }

      if (infoMessage) {
        const timestamp = formattedTime();
        dispatch(
          AgenticAiActions.setConversationHistory([
            ...conversationalRes,
            { ...infoMessage, status: 'completed', time: timestamp },
          ])
        );
        dispatch(ClustersActions.setIsLoggedInFromAgent(false));
        dispatch(ClustersActions.setClusterLoggedInSuccessfully({}));
      }
    }
  }, [loginFromAgent, loginData, conversationalRes, dispatch]);
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const hasMessages = !isEmpty(conversationalRes);

  const triggerSendMessage = useCallback(
    textToSend => {
      const message = textToSend || queryText.trim();
      if (!message || isLoading || !sessionId) return;

      const timestamp = formattedTime();
      const newUserMessage = {
        role: 'user',
        data: message,
        status: 'completed',
        time: timestamp,
      };

      const tempSystemMessage = {
        role: 'system',
        status: 'pending',
        time: timestamp,
        data: 'Waiting for response...',
      };

      dispatch(
        AgenticAiActions.setConversationHistory([
          ...conversationalRes,
          newUserMessage,
          tempSystemMessage,
        ])
      );

      dispatch(
        AgenticAiActions.fetchMessageChatAi({
          message: message,
          session_id: sessionId,
        })
      );

      setQueryText('');
      if (inputRef.current) inputRef.current.style.height = 'auto';
    },
    [queryText, isLoading, dispatch, sessionId, conversationalRes]
  );

  const handleSendMessage = e => {
    if (e) e.preventDefault();
    triggerSendMessage();
  };

  useEffect(() => {
    if (isEmpty(sessionId) || sessionId === null) {
      dispatch(AgenticAiActions.fetchSessionId());
    }
  }, [dispatch, sessionId]);

  useEffect(() => {
    if (!isEmpty(apiResponse)) {
      const timestamp = formattedTime();
      const displayContent =
        apiResponse?.message?.content || JSON.stringify(apiResponse);
      const newSystemMessage = {
        role: 'system',
        status: 'completed',
        data: displayContent,
        time: timestamp,
        fullResponse: apiResponse,
        isLoginRequired: apiResponse?.message?.login_required ?? false,
        isLogoutRequired: apiResponse?.message?.logout ?? false,
      };
      const updatedHistory = [...conversationalRes];
      const lastIndex = updatedHistory
        .map(msg => msg.status)
        .lastIndexOf('pending');

      if (lastIndex !== -1) {
        updatedHistory[lastIndex] = newSystemMessage;
        dispatch(AgenticAiActions.setConversationHistory(updatedHistory));
      }
      dispatch(AgenticAiActions.setMessageChatAi({}));
    }

    if (!isEmpty(apiError)) {
      const timestamp = formattedTime();
      const errorMessage = {
        role: 'system',
        status: 'error',
        data: KDFM?.GENERIC_CHAT_ERROR,
        time: timestamp,
      };
      const updatedHistory = [...conversationalRes];
      const lastIndex = updatedHistory
        .map(msg => msg.status)
        .lastIndexOf('pending');

      if (lastIndex !== -1) {
        updatedHistory[lastIndex] = errorMessage;
        dispatch(AgenticAiActions.setConversationHistory(updatedHistory));
      }

      dispatch(AgenticAiActions.setMessageChatAiError({}));
    }
  }, [apiResponse, apiError, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [conversationalRes]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [queryText]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        adjustTextareaHeight();
      }, 50);
    }
  }, [isLoading]);

  useEffect(() => {
    if (reduxQueryText) {
      setQueryText(reduxQueryText);

      if (isSessionReady()) {
        triggerSendMessage(reduxQueryText);
      } else {
        setPendingAutoSend(reduxQueryText);
        dispatch(AgenticAiActions.fetchSessionId());
      }
      dispatch(AgenticAiActions.setQueryText(''));
    }
  }, [reduxQueryText, dispatch, isSessionReady]);

  useEffect(() => {
    if (isSessionReady() && pendingAutoSend && !isSessionFetching) {
      triggerSendMessage(pendingAutoSend);
      setPendingAutoSend(null);
    }
  }, [
    sessionId,
    pendingAutoSend,
    isSessionFetching,
    isSessionReady,
    triggerSendMessage,
  ]);
  const MarkdownComponents = {
    a: ({ children, ...props }) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#ff7a00', textDecoration: 'underline' }}
      >
        {children}
      </a>
    ),

    code: ({ inline, className, children, ...props }) => {
      return !inline ? (
        <pre>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },

    pre: ({ children }) => <>{children}</>,
  };

  return (
    <Container>
      <ContentArea hasMessages={hasMessages}>
        {!hasMessages ? (
          <AgenticAiWelcome isFullscreen={isFullscreen} />
        ) : (
          <AgenticAiMessageList
            messages={conversationalRes}
            isLoading={isLoading}
            markdownComponents={MarkdownComponents}
            endRef={messagesEndRef}
          />
        )}
      </ContentArea>

      <AgenticAiFooter
        queryText={queryText}
        setQueryText={setQueryText}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        sessionId={sessionId}
        hasMessages={hasMessages}
      />

      <div
        style={{
          alignSelf: 'center',
          width: '100%',
          maxWidth: '1000px',
          padding: '8px 0',
        }}
      >
        <AgenticAiDisclaimer />
      </div>
    </Container>
  );
};
