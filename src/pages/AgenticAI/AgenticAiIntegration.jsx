import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { AuthenticationSelectors } from '../../store';
import { AgenticAIModal } from './AgenticAIModal';
import { AgenticAiButton } from '../../shared';

const ChatbotWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;

  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
  }
`;

export const AgenticAiIntegration = () => {
  const isLoggedIn = useSelector(AuthenticationSelectors.getIsLoggedIn);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const onChatbotClick = () => {
    setIsChatModalOpen(prev => !prev);
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <ChatbotWrapper>
        <AgenticAiButton onClick={onChatbotClick} />
      </ChatbotWrapper>

      <AgenticAIModal
        isOpen={isChatModalOpen}
        onRequestClose={() => setIsChatModalOpen(false)}
      />
    </>
  );
};
