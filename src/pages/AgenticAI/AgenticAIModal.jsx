import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Modal } from '../../shared';
import { AgenticAI } from './AgenticAI ';
import { MaximizeModalIcon, MinimizeModalIcon } from '../../assets';
import { theme } from '../../styles';
import { KDFM } from '../../constants';
import { AgenticAiActions, AgenticAiSelectors } from '../../store';
import { useDispatch, useSelector } from 'react-redux';

const ContentWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const MaximizeModal = styled(MaximizeModalIcon)`
  padding: 5px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.white};
`;

const MinimizeModal = styled(MinimizeModalIcon)`
  padding: 5px;
  border-radius: 50%;
  border: 1px solid ${theme.colors.border};
  background: ${theme.colors.white};
`;

export const AgenticAIModal = ({ isOpen, onRequestClose }) => {
  const dispatch = useDispatch();
  const isFullscreen = useSelector(
    AgenticAiSelectors.getAgenticAiModalFullScreen
  );

  const toggleFullScreen = () => {
    dispatch(AgenticAiActions.setAgenticAiModalFullScreen(!isFullscreen));
  };
  return (
    <Modal
      title={`${KDFM.AGENTIC_AI_MODAL_TITLE}`}
      isOpen={isOpen}
      onRequestClose={() => {
        onRequestClose();
        dispatch(AgenticAiActions.setAgenticAiModalFullScreen(!isFullscreen));
      }}
      primaryButtonText=""
      secondaryButtonText=""
      onSubmit={() => {
        onRequestClose();
        dispatch(AgenticAiActions.setAgenticAiModalFullScreen(!isFullscreen));
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
      additionalIcon={isFullscreen ? <MinimizeModal /> : <MaximizeModal />}
      onAdditionalIconClick={toggleFullScreen}
      noPadding={true}
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
