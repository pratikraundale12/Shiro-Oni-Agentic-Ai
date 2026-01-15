import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from '../../shared';
import { AgenticAI } from './AgenticAI ';
import { theme } from '../../styles';
import { AgenticAiActions, AgenticAiSelectors } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { AgenticAiModalTitle } from './AgenticAiModalTitle';
import { AgenticAiAdditionalActions } from './AgenticAiAdditionalActions';

const ContentWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const AgenticAIModal = ({ isOpen, onRequestClose }) => {
  const dispatch = useDispatch();
  const isFullscreen = useSelector(
    AgenticAiSelectors.getAgenticAiModalFullScreen
  );

  return (
    <Modal
      title={<AgenticAiModalTitle />}
      isOpen={isOpen}
      onRequestClose={() => {
        onRequestClose();
        dispatch(AgenticAiActions.setAgenticAiModalFullScreen(false));
      }}
      primaryButtonText=""
      secondaryButtonText=""
      shouldCloseOnEsc={false}
      headerStyles={{
        backgroundColor: theme.colors.primary,
        height: '90px',
        padding: '0 24px',
        borderBottom: 'none',
        borderRadius: isFullscreen ? '16px 16px 0px 0px' : '16px 16px 0px 0px',
      }}
      overlayStyles={{
        position: 'fixed',
        backgroundColor: '#F5F7FA',
        inset: isFullscreen ? 'auto 0 0 auto' : 'auto 0 0 auto',
        width: isFullscreen ? '70%' : '2px',
        height: isFullscreen ? '100%' : '2px',
      }}
      contentStyles={{
        inset: isFullscreen ? 'auto 25px 9px auto' : 'auto 25px 9px auto',
        transform: 'none',
        height: '100%',
        minHeight: '707px',
        minWidth: '480px',
        width: isFullscreen ? '100%' : '600px',
        maxWidth: isFullscreen ? '100%' : '40%',
        maxHeight: isFullscreen ? '99%' : '76%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 2px',
        zIndex: 1000,
      }}
      formClass={'h-100'}
      noPadding={true}
      clickOutsideToClose={false}
      closeIcon={false}
      showAdditionalActions={true}
      additionalActionsComponent={() => (
        <AgenticAiAdditionalActions onMinimizeScreenClick={onRequestClose} />
      )}
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
