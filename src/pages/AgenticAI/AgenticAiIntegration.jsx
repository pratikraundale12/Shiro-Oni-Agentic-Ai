import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  AgenticAiActions,
  AgenticAiSelectors,
  AuthenticationSelectors,
} from '../../store';
import { AgenticAIModal } from './AgenticAIModal';
import { AgenticAiButton } from '../../shared';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { KDFM } from '../../constants';

const ChatbotWrapper = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: ${props => (props.hide ? 'none' : 'block')};

  @media (max-width: 768px) {
    bottom: 16px;
    right: 16px;
  }
`;

export const AgenticAiIntegration = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(AuthenticationSelectors.getIsLoggedIn);
  const isFullscreen = useSelector(
    AgenticAiSelectors.getAgenticAiModalFullScreen
  );
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const onChatbotClick = () => {
    setIsChatModalOpen(prev => !prev);
    dispatch(AgenticAiActions.setAgenticAiModalFullScreen(false));
  };

  const handleCloseModal = () => {
    setIsChatModalOpen(false);
    dispatch(AgenticAiActions.setAgenticAiModalFullScreen(false));
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <ChatbotWrapper
        hide={isFullscreen || isChatModalOpen}
        data-tooltip-id={'tooltip-id-agent-icon'}
      >
        <AgenticAiButton onClick={onChatbotClick} />
      </ChatbotWrapper>
      <ReactTooltip
        id="tooltip-id-agent-icon"
        place="left"
        content={'Ask ' + KDFM.AGENTIC_AI_MODAL_TITLE}
        style={{
          zIndex: 9999,
        }}
      />

      <AgenticAIModal
        isOpen={isChatModalOpen}
        onRequestClose={handleCloseModal}
      />
    </>
  );
};
