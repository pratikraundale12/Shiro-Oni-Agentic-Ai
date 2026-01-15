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
import { SendMessageIcon } from '../../assets';
import { toast } from 'react-toastify';
import { AgenticAiDisclaimer } from './AgenticAiDisclaimer';
import { AgenticAiWelcome } from './AgenticAiWelcome';
import { AgenticAiMessageList } from './AgenticAiMessageList';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f7f7f7;
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

const FooterContainer = styled.div`
  padding: 20px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
`;

const InputPill = styled.div`
  width: 100%;
  background: white;
  border-radius: 30px;
  padding: 8px 8px 8px 20px;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #eaeaea;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #ff7a00;
  }
`;

const InputBox = styled.textarea`
  flex-grow: 1;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  font-size: 16px;
  line-height: 1.5;
  font-family: inherit;
  max-height: 120px;
  padding: 8px 0;
  margin-right: 10px;
  color: #333;

  &::placeholder {
    color: #aaa;
  }
`;

const SendButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => (props.disabled ? '#e0e0e0' : '#ff7a00')};
  border: none;
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: ${props => (props.disabled ? '#e0e0e0' : '#e66e00')};
  }

  svg {
    width: 18px;
    height: 18px;
    fill: white;
    /* transform: rotate(-90deg); */
  }
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

  const isInputValid = queryText.trim().length > 0;
  const isSendBtnDisabled = isLoading || !isInputValid;
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

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        e.stopPropagation();
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      if (!isSendBtnDisabled) {
        handleSendMessage();
      }
    }
  };

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

  const handleInputChange = e => {
    const val = e.target.value;
    if (val.length <= KDFM.MAX_CHAR_LIMIT) {
      setQueryText(val);
    }
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

      <FooterContainer>
        <InputPill>
          <InputBox
            ref={inputRef}
            value={queryText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading || !sessionId}
            placeholder={
              hasMessages ? KDFM.PROMPT_PLACEHOLDER : 'Message DFM Agent...'
            }
            rows={1}
            maxLength={KDFM.MAX_CHAR_LIMIT}
            id="inputTextArea"
          />
          <SendButton
            type="button"
            disabled={isSendBtnDisabled}
            onClick={handleSendMessage}
          >
            <SendMessageIcon />
          </SendButton>
        </InputPill>
        <AgenticAiDisclaimer />
      </FooterContainer>
    </Container>
  );
};
