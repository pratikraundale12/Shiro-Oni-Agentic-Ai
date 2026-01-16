import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import {
  AgenticAiActions,
  AgenticAiSelectors,
  LoadingSelectors,
} from '../../store';
import { KDFM } from '../../constants';
import { formattedTime } from '../AiFlowGenerator/utils';
import { toast } from 'react-toastify';
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
  const conversationalRes = useSelector(
    AgenticAiSelectors.getConversationHistory
  );
  const apiResponse = useSelector(AgenticAiSelectors.getMessageChatAi);
  const apiError = useSelector(AgenticAiSelectors.getMessageChatAiError);
  const inputRef = useRef(null);
  const sessionId = useSelector(AgenticAiSelectors.getSessionId);

  const isLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchMessageChatAi')
  );

  const isFullscreen = useSelector(
    AgenticAiSelectors.getAgenticAiModalFullScreen
  );

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

  const handleSendMessage = useCallback(
    e => {
      if (e) e.preventDefault();
      const trimmedQuery = queryText.trim();

      if (!trimmedQuery || isLoading || !sessionId) {
        if (!sessionId) {
          toast.warning('Session ID not found. Please try again.');
        }
        return;
      }
      const timestamp = formattedTime();
      const newUserMessage = {
        role: 'user',
        data: trimmedQuery,
        status: 'completed',
        time: timestamp,
      };
      const tempSystemMessage = {
        role: 'system',
        status: 'pending',
        time: timestamp,
        data: 'Waiting for response...',
      };
      const newHistory = [
        ...conversationalRes,
        newUserMessage,
        tempSystemMessage,
      ];
      dispatch(AgenticAiActions.setConversationHistory(newHistory));

      const payload = {
        message: trimmedQuery,
        session_id: sessionId,
      };

      dispatch(AgenticAiActions.fetchMessageChatAi(payload));
      setQueryText('');

      if (inputRef.current) inputRef.current.style.height = 'auto';
    },
    [queryText, isLoading, dispatch, sessionId, conversationalRes]
  );

  useEffect(() => {
    dispatch(AgenticAiActions.fetchSessionId());
  }, [dispatch]);

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
