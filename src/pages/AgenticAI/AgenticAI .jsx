import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { isEmpty } from 'lodash';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  AgenticAiActions,
  AgenticAiSelectors,
  LoadingSelectors,
} from '../../store';
import { KDFM } from '../../constants';
import { formattedTime } from '../AiFlowGenerator/utils';
import {
  SendMessageIcon,
  UserIcon,
  AIMiniIcon,
  ChatbotIcon,
} from '../../assets';
import { toast } from 'react-toastify';

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
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: #888;
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => (props.isUser ? '#ff7a00' : '#444445')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  padding: 12px;
  border-radius: 10px;
  max-width: 85%;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${props => (props.isUser ? '#ff7a001a' : '#f0f0f0')};
  color: ${props => (props.isUser ? '#444445' : '#333')};
  font-size: 14px;
  line-height: 1.6;
  ${props => props.isUser && `white-space: pre-wrap;`}
  word-break: break-word;

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
  font-size: 15px;
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

const DisclaimerText = styled.p`
  font-size: 14px;
  color: #999;
  margin-top: 10px;
  text-align: center;
  max-width: 80%;
`;

const dotAnimation = keyframes`
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
`;

const LoaderDots = styled.span`
  &::after {
    content: ' .';
    animation: ${dotAnimation} 1s infinite;
  }
  &::before {
    content: ' .';
    animation: ${dotAnimation} 1s infinite 0.33s;
  }
  & span {
    content: ' .';
    animation: ${dotAnimation} 1s infinite 0.66s;
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
  const [conversationalRes, setConversationalRes] = useState([]);
  const apiResponse = useSelector(AgenticAiSelectors.getMessageChatAi);
  const apiError = useSelector(AgenticAiSelectors.getMessageChatAiError);
  const inputRef = useRef(null);
  const sessionId = useSelector(AgenticAiSelectors.getSessionId);

  const isLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchMessageChatAi')
  );

  const handleNewChat = () => {
    setConversationalRes([]);
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

      setConversationalRes(prev => [
        ...prev,
        newUserMessage,
        tempSystemMessage,
      ]);

      const payload = {
        message: trimmedQuery,
        session_id: sessionId,
      };

      dispatch(AgenticAiActions.fetchMessageChatAi(payload));
      setQueryText('');

      if (inputRef.current) inputRef.current.style.height = 'auto';
    },
    [queryText, isLoading, dispatch, sessionId]
  );

  useEffect(() => {
    dispatch(AgenticAiActions.fetchSessionId());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(apiResponse)) {
      const timestamp = formattedTime();
      const newSystemMessage = {
        role: 'system',
        status: 'completed',
        data: apiResponse.message || JSON.stringify(apiResponse),
        time: timestamp,
      };
      setConversationalRes(prev => {
        const updated = [...prev];
        const lastIndex = updated.map(msg => msg.status).lastIndexOf('pending');
        if (lastIndex !== -1) updated[lastIndex] = newSystemMessage;
        return updated;
      });
      dispatch(AgenticAiActions.setMessageChatAi({}));
    }

    if (!isEmpty(apiError)) {
      const timestamp = formattedTime();
      const errorMessage = {
        role: 'system',
        status: 'error',
        data: apiError.message || KDFM.GENERIC_CHAT_ERROR,
        time: timestamp,
      };
      setConversationalRes(prev => {
        const updated = [...prev];
        const lastIndex = updated.map(msg => msg.status).lastIndexOf('pending');
        if (lastIndex !== -1) updated[lastIndex] = errorMessage;
        return updated;
      });
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

  const renderMessage = (item, index) => {
    const isUser = item.role === 'user';
    const isPending = item.status === 'pending';
    let content;

    if (isPending && isLoading) {
      content = (
        <p className="mt-1 d-flex align-items-center">
          <span>Generating Response</span>
          <LoaderDots />
        </p>
      );
    } else if (item.status === 'error') {
      content = <span style={{ color: 'red' }}>Error: {item.data}</span>;
    } else {
      if (isUser) {
        content = <p style={{ margin: 0 }}>{item.data}</p>;
      } else {
        content = (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={MarkdownComponents}
          >
            {item.data}
          </ReactMarkdown>
        );
      }
    }

    return (
      <MessageWrapper key={index}>
        <MessageHeader>
          <Avatar isUser={isUser}>
            {isUser ? (
              <UserIcon width={16} height={16} color="white" />
            ) : (
              <AIMiniIcon width={16} height={16} color="white" />
            )}
          </Avatar>
          <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
            {isUser ? KDFM.YOU : KDFM.DATA_FLOW_MANAGER}
          </span>
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
          />
          <SendButton
            type="button"
            disabled={isSendBtnDisabled}
            onClick={handleSendMessage}
          >
            <SendMessageIcon />
          </SendButton>
        </InputPill>
        <DisclaimerText>{KDFM.AGENTIC_AI_DISCLAIMER_TEXT}</DisclaimerText>
      </FooterContainer>
    </Container>
  );
};
