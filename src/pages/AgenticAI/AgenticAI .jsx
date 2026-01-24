import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import {
  AgenticAiActions,
  AgenticAiSelectors,
  ClustersActions,
  ClustersSelectors,
  GridSelectors,
  LoadingSelectors,
} from '../../store';
import { KDFM } from '../../constants';
import { formattedTime } from '../AiFlowGenerator/utils';
import { toast } from 'react-toastify';
import { AgenticAiDisclaimer } from './AgenticAiDisclaimer';
import { AgenticAiWelcome } from './AgenticAiWelcome';
import { AgenticAiMessageList } from './AgenticAiMessageList';
import { AgenticAiFooter } from './AgenticAiFooter';
import { history } from '../../helpers/history';
import { useGlobalContext } from '../../utils';

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

const InternalActionButton = styled.button`
  background-color: #ff7a00;
  color: #ffffff;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Red Hat Display', sans-serif;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: #e66e00;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const INTERNAL_ROUTE_RULES = [
  {
    pattern: '/clusters/',
    getRoute: id => `/clusters/${id}`,
    state: { clusterSummaryPage: true },
  },
  {
    pattern: '/process-group/',
    getRoute: id => `/process-group/${id}`,
    state: {},
  },
  // for other routes, define new object here.
];

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
        isLoginRequired:
          apiResponse?.message?.login_required ||
          apiResponse?.login_required ||
          false,
        clusterId:
          apiResponse?.message?.cluster_id || apiResponse?.cluster_id || null,
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

  const { state, setState } = useGlobalContext();
  const clusters = useSelector(state =>
    GridSelectors.getGridData(state, 'clusters')
  );

  const resolveLinkAction = href => {
    if (!href) return { isInternal: false };
    const rule = INTERNAL_ROUTE_RULES.find(r => href.includes(r.pattern));
    if (rule) {
      const id = href.split(rule.pattern)[1]?.split('/')[0]?.split('?')[0];
      if (id) {
        return {
          isInternal: true,
          handler: () => {
            history.push(rule.getRoute(id), rule.state);
            if (href.includes('clusters')) {
              const targetCluster = id
                ? clusters.find(c => c.id === id)
                : clusters[0];

              console.log('Executed!!');
              setState({
                ...state,
                nodeClusterId: targetCluster?.id,
                created_by_ansible: targetCluster?.created_by_ansible,
                is_kube_cluster: targetCluster?.is_kube_cluster,
                isRegistrySecured: targetCluster?.isRegistrySecured,
              });
            }
          },
        };
      }
    }
    return { isInternal: false };
  };

  const MarkdownComponents = {
    a: ({ children, href, ...props }) => {
      const { isInternal, handler } = resolveLinkAction(href);

      if (isInternal) {
        return (
          <InternalActionButton
            onClick={e => {
              e.preventDefault();
              handler();
            }}
          >
            {children}
          </InternalActionButton>
        );
      }

      return (
        <a
          {...props}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#ff7a00', textDecoration: 'underline' }}
        >
          {children}
        </a>
      );
    },
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
