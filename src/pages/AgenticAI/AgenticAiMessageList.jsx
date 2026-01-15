import React from 'react';
import styled, { keyframes } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PropTypes from 'prop-types';
import { AgenticAiClusterLoginButton } from './AgenticAiClusterLoginButton';
import { AgenticAiClusterLogoutButton } from './AgenticAiClusterLogoutButton';
import { CardLogo } from '../../assets';

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

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 20px;
`;

const MessageRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
`;

const UserBubble = styled.div`
  max-width: 60%;
  padding: 12px 16px;
  background-color: #f1f1f1;
  color: #202124;
  border-radius: 16px 16px 0 16px;
  white-space: pre-wrap;
  word-break: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: 'Red Hat Display', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.31px;
`;

const AgentContainer = styled.div`
  display: flex;
  gap: 12px;
  max-width: 90%;
  align-items: flex-start;
`;

const LogoWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4px; /* Aligns icon with the first line of text */
`;

const AgentContent = styled.div`
  flex-grow: 1;
  color: #3c4043;
  font-family: 'Red Hat Display', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.31px;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 16px 0;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    font-size: 14px;
  }

  th,
  td {
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding: 10px 12px;
    text-align: left;
  }

  th:last-child,
  td:last-child {
    border-right: none;
  }

  tr:last-child td {
    border-bottom: none;
  }

  th {
    background-color: #f8f8f8;
    font-weight: 600;
    color: #444;
  }

  tr:nth-child(even) {
    background-color: #fafafa;
  }

  p {
    margin-bottom: 12px;
  }
  p:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    padding-left: 25px;
    margin-bottom: 12px;
  }

  li {
    margin-bottom: 4px;
  }

  pre {
    background-color: #282c34;
    color: #fff;
    padding: 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
    font-family: 'Fira Code', 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.5;
  }

  code {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    font-family: inherit;
  }

  pre > code {
    background-color: transparent;
    padding: 0;
    color: inherit;
    font-family: inherit;
  }
`;

const GeneratingWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #444445;
  font-family: 'Red Hat Display', sans-serif;
  font-size: 16px;
  padding-top: 12px;
`;

export const AgenticAiMessageList = ({
  messages,
  isLoading,
  markdownComponents,
  endRef,
}) => {
  return (
    <ListContainer>
      {messages.map((item, index) => {
        const isUser = item.role === 'user';
        const isPending = item.status === 'pending';

        return (
          <MessageRow key={index} isUser={isUser}>
            {isUser ? (
              <UserBubble>{item.data}</UserBubble>
            ) : (
              <AgentContainer>
                <LogoWrapper>
                  <CardLogo width={40} height={40} />
                </LogoWrapper>
                <AgentContent>
                  {isPending && isLoading ? (
                    <GeneratingWrapper>
                      <span>Thinking</span>
                      <LoaderDots>
                        <span />
                        <span />
                        <span />
                      </LoaderDots>
                    </GeneratingWrapper>
                  ) : (
                    <>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                      >
                        {item.data}
                      </ReactMarkdown>
                      {item.isLoginRequired && <AgenticAiClusterLoginButton />}
                      {item.isLogoutRequired && (
                        <AgenticAiClusterLogoutButton />
                      )}
                    </>
                  )}
                </AgentContent>
              </AgentContainer>
            )}
          </MessageRow>
        );
      })}
      <div ref={endRef} />
    </ListContainer>
  );
};

AgenticAiMessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  markdownComponents: PropTypes.object.isRequired,
  endRef: PropTypes.object.isRequired,
};
