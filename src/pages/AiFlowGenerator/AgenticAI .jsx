import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { isEmpty } from 'lodash';
import {
  AgenticAiActions,
  AgenticAiSelectors,
  LoadingSelectors,
  NamespacesSelectors,
} from '../../store';
import { KDFM } from '../../constants';
import { formattedTime } from './utils';
import { SendMessageIcon, UserIcon, AIMiniIcon } from '../../assets';
import { toast } from 'react-toastify';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* Crucial: Use 100% of the parent's defined height, 
     or define the height here if the parent doesn't. 
     Assuming the parent element (e.g., a route wrapper) 
     gives this component a specific height (e.g., calc(100vh - header-height)). 
     If not, setting a height here is necessary, e.g., height: 80vh; */
  height: 100%;
  padding: 20px;
  background-color: #f7f7f7;
`;

const ChatContainer = styled.div`
  flex-grow: 1; /* Allows this area to fill the remaining space */
  overflow-y: auto; /* Provides scrollbar only for chat content when needed */
  padding-right: 15px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const PromptInputWrapper = styled.div`
  /* This component should not use flex-grow, 
     it should maintain a fixed height to stay visible */
  flex-shrink: 0; /* Prevents this section from being squeezed */
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: white;
  border-radius: 30px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 12px;
  color: #666;
`;

const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => (props.isUser ? '#ff7a00' : '#444445')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
`;

const MessageContent = styled.div`
  padding: 10px;
  border-radius: 10px;
  max-width: 80%;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${props => (props.isUser ? '#ff7a001a' : '#f0f0f0')};
  color: ${props => (props.isUser ? '#444445' : '#333')};
  white-space: pre-wrap;
  word-break: break-word;
`;

const InputBox = styled.textarea`
  flex-grow: 1;
  border: none;
  outline: none;
  resize: none;
  height: 40px;
  padding: 10px;
  font-size: 16px;
  background: transparent;
`;

const SubmitButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => (props.disabled ? '#ccc' : '#ff7a00')};
  border: none;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  svg {
    fill: white;
  }
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
export const AgenticAI = () => {
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const [queryText, setQueryText] = useState('');
  const [conversationalRes, setConversationalRes] = useState([]);
  const apiResponse = useSelector(AgenticAiSelectors.getMessageChatAi);
  const apiError = useSelector(AgenticAiSelectors.getMessageChatAiError);
  // const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  // const sessionId = useSelector(AgenticAiSelectors.getSessionId);

  const isLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchMessageChatAi')
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isInputValid = queryText.trim().length > 0;
  const isSendBtnDisabled = isLoading || !isInputValid;

  const sessionId = useSelector(AgenticAiSelectors.getSessionId);

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
        nifi_server_id: 'nifi-local-example',
      };

      dispatch(AgenticAiActions.fetchMessageChatAi(payload));

      setQueryText('');
    },
    [queryText, isLoading, dispatch, sessionId]
  );

  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  useEffect(() => {
    if (selectedCluster?.value) {
      dispatch(AgenticAiActions.fetchSessionId(selectedCluster.value));
    }
  }, [dispatch, selectedCluster?.value]);

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

        if (lastIndex !== -1) {
          updated[lastIndex] = newSystemMessage;
        }
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

        if (lastIndex !== -1) {
          updated[lastIndex] = errorMessage;
        }
        return updated;
      });

      dispatch(AgenticAiActions.setMessageChatAiError({}));
    }
  }, [apiResponse, apiError, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [conversationalRes]);

  const renderMessage = (item, index) => {
    const isUser = item.role === 'user';
    const senderName = isUser ? KDFM.YOU : KDFM.DATA_FLOW_MANAGER;
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
      content = <p className="mt-1">{item.data}</p>;
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
            {senderName}
          </span>
          <span>{item?.time ?? formattedTime()}</span>
        </MessageHeader>
        <MessageContent isUser={isUser}>{content}</MessageContent>
      </MessageWrapper>
    );
  };

  return (
    <Container>
      <ChatContainer>
        {conversationalRes.map(renderMessage)}
        <div ref={messagesEndRef} />
      </ChatContainer>
      <PromptInputWrapper>
        <InputBox
          value={queryText}
          onChange={e => setQueryText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !isSendBtnDisabled && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          disabled={isLoading}
          placeholder={KDFM.PROMPT_INPUT_PLACEHOLDER}
        />
        <SubmitButton
          type="button"
          disabled={isSendBtnDisabled}
          onClick={handleSendMessage}
        >
          <SendMessageIcon color={isSendBtnDisabled ? '#444443' : '#FFFFFF'} />
        </SubmitButton>
      </PromptInputWrapper>
    </Container>
  );
};
