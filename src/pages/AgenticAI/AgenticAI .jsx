import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { isEmpty } from 'lodash';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AgenticAiActions,
  AgenticAiSelectors,
  AuthenticationSelectors,
  LoadingSelectors,
} from '../../store';
import { API_URL, KDFM } from '../../constants';
import { formattedTime } from '../AiFlowGenerator/utils';
import { SendMessageIcon, ChatbotIcon } from '../../assets';
import { toast } from 'react-toastify';
import { AgenticAiClusterLoginButton } from './AgenticAiClusterLoginButton';
import { MessageIdentityAvatar } from './MessageIdentityAvatar';
import { AgenticAiClusterLogoutButton } from './AgenticAiClusterLogoutButton';
import { AgenticAiDisclaimer } from './AgenticAiDisclaimer';

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

const WelcomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 40px;
  color: #333;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const AgentLogoWrapper = styled.div`
  width: 80px;
  height: 80px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;

  svg {
    width: 40px;
    height: 40px;
    color: #ff7a00;
  }
`;

const AgentTitle = styled.h3`
  font-size: 27px;
  font-weight: 700;
  color: #444445;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const GreetingText = styled.h2`
  font-family: 'Georgia', serif;
  font-size: 24px;
  font-weight: 400;
  color: #333;
  margin: 0;
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  width: 100%;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 16px;
  color: #888;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};

  span:nth-of-type(1) {
    font-size: 16px;
    font-weight: bold;
    color: #444445;
    margin-right: 10px;
  }

  span:nth-of-type(2) {
    font-size: 14px;
    color: #888;
    font-weight: 400;
  }
`;

const MessageContent = styled.div`
  padding: 12px;
  border-radius: 10px;
  max-width: 85%;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${props => (props.isUser ? '#ff7a001a' : '#f0f0f0')};
  color: ${props => (props.isUser ? '#444445' : '#333')};
  font-size: 16px;
  line-height: 1.6;
  ${props => props.isUser && `white-space: pre-wrap;`}
  word-break: break-word;
  width: ${props => (props.isUser ? 'fit-content' : '100%')};
  text-align: left;

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    background-color: white;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #ddd;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
  }

  th {
    background-color: #f8f8f8;
    font-weight: 600;
  }

  tr:nth-child(even) {
    background-color: #fafafa;
  }

  /* List and Paragraph Spacing */
  p {
    margin-bottom: 8px;
  }
  p:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    padding-left: 25px;
    margin-bottom: 8px;
  }

  /* Code Block Styling */
  pre {
    background-color: #282c34;
    color: #abb2bf;
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 10px 0;
    font-family: 'Fira Code', 'Courier New', monospace;
  }

  code {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 0.9em;
  }

  pre > code {
    background-color: transparent;
    padding: 0;
    color: inherit;
  }
`;

const FooterContainer = styled.div`
  padding: 20px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
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

const dotAnimation = keyframes`
  0% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0.2; transform: scale(1); }
`;

const LoaderDots = styled.span`
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  gap: 6px;

  span {
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: #ff7a00;
    border-radius: 50%;
    animation: ${dotAnimation} 1.4s infinite ease-in-out;
  }

  span:nth-child(1) {
    animation-delay: 0s;
  }
  span:nth-child(2) {
    animation-delay: 0.2s;
  }
  span:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const NewChatBtn = styled.button`
  position: absolute;
  top: 3px;
  right: 20px;
  z-index: 10;
  background-color: #444445;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;

  &:hover {
    background-color: #555556;
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
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const [isValidProfilePic, setIsValidProfilePic] = useState(false);

  const handleNewChat = () => {
    dispatch(AgenticAiActions.resetChat());
  };

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

  useEffect(() => {
    if (currentUser?.photo) {
      const img = new Image();
      img.onload = () => setIsValidProfilePic(true);
      img.onerror = () => setIsValidProfilePic(false);
      img.src = `${API_URL}${currentUser.photo}`;
    }
  }, [currentUser?.photo]);

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

  const renderMessage = (item, index) => {
    const isUser = item.role === 'user';
    const isPending = item.status === 'pending';
    let content;

    if (isPending && isLoading) {
      content = (
        <div className="mt-1 d-flex align-items-center">
          <span style={{ fontWeight: '500' }}>Generating Response</span>
          <LoaderDots>
            <span />
            <span />
            <span />
          </LoaderDots>
        </div>
      );
    } else if (item.status === 'error') {
      content = <span style={{ color: 'red' }}> {item.data}</span>;
    } else {
      if (isUser) {
        content = <p style={{ margin: 0 }}>{item.data}</p>;
      } else {
        content = (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={MarkdownComponents}
            >
              {item.data}
            </ReactMarkdown>
            {item.isLoginRequired !== false && <AgenticAiClusterLoginButton />}
            {item.isLogoutRequired === true && <AgenticAiClusterLogoutButton />}
          </>
        );
      }
    }

    return (
      <MessageWrapper key={index} isUser={isUser}>
        <MessageHeader isUser={isUser}>
          <MessageIdentityAvatar
            isUser={isUser}
            userPhoto={currentUser?.photo}
            isValidProfilePic={isValidProfilePic}
          />
          <span>{isUser ? KDFM.YOU : KDFM.DFM_AI_AGENT}</span>
          <span>{item?.time ?? formattedTime()}</span>
        </MessageHeader>
        <MessageContent isUser={isUser}>{content}</MessageContent>
      </MessageWrapper>
    );
  };

  const handleInputChange = e => {
    const val = e.target.value;
    if (val.length <= KDFM.MAX_CHAR_LIMIT) {
      setQueryText(val);
    }
  };

  return (
    <Container>
      {hasMessages && (
        <NewChatBtn onClick={handleNewChat}>+ New Chat</NewChatBtn>
      )}
      <ContentArea hasMessages={hasMessages}>
        {!hasMessages ? (
          <WelcomeWrapper>
            <HeaderRow>
              <AgentLogoWrapper>
                <ChatbotIcon />
              </AgentLogoWrapper>
              <AgentTitle>{KDFM.AGENTIC_AI_MODAL_TITLE}</AgentTitle>
            </HeaderRow>
            <GreetingText>{KDFM.WELCOME_TEXT}</GreetingText>
          </WelcomeWrapper>
        ) : (
          <MessageList>
            {conversationalRes.map(renderMessage)}
            <div ref={messagesEndRef} />
          </MessageList>
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
