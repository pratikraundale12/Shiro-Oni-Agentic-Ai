import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from '../../shared';
import { AgenticAI } from './AgenticAI ';
import { FullScreenIcon, MiniScreenIcon } from '../../assets';
import { theme } from '../../styles';

const ContentWrapper = styled.div`
  /* Ensures AgenticAI fills the modal content area and enables its internal scrolling */
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const FullScreen = styled(FullScreenIcon)`
  padding: 5px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.white};
`;

const MiniScreen = styled(MiniScreenIcon)`
  padding: 5px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.white};
`;

export const AgenticAIModal = ({ isOpen, onRequestClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullscreen(prev => !prev);
  };
  return (
    <Modal
      title="Agentic AI Chatbot"
      isOpen={isOpen}
      onRequestClose={() => {
        onRequestClose();
        setIsFullscreen(false);
      }}
      primaryButtonText=""
      secondaryButtonText=""
      onSubmit={() => {
        onRequestClose();
        setIsFullscreen(false);
      }}
      contentStyles={{
        inset: isFullscreen ? 'auto 0 0 auto' : 'auto 20px 90px auto',
        transform: 'none',
        minWidth: '500px',
        width: isFullscreen ? '100%' : '500px',
        maxWidth: isFullscreen ? '100%' : '35%',
        maxHeight: isFullscreen ? '100%' : '70%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
      formClass={'h-100'}
      isAdditionalIcon={true}
      additionalIcon={isFullscreen ? <MiniScreen /> : <FullScreen />}
      onAdditionalIconClick={toggleFullScreen}
    >
      <ContentWrapper>
        <AgenticAI />
      </ContentWrapper>
    </Modal>
  );
};

AgenticAIModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};
