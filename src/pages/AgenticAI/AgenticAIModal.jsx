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
import { ShowLoggedInCluster } from './ShowLoggedInCluster';

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
        dispatch(AgenticAiActions.setAgenticAiModalFullScreen(false));
      }}
      primaryButtonText=""
      secondaryButtonText=""
      shouldCloseOnEsc={false}
      overlayStyles={{
        position: 'fixed',
        backgroundColor: '#F5F7FA',
        inset: isFullscreen ? 'auto 0 0 auto' : 'auto 0 0 auto',
        width: isFullscreen ? '100%' : '522px',
        height: isFullscreen ? '100%' : '555px',
      }}
      contentStyles={{
        inset: isFullscreen ? 'auto 0 0 auto' : 'auto 20px 90px auto',
        transform: 'none',
        minWidth: '500px',
        width: isFullscreen ? '100%' : '600px',
        maxWidth: isFullscreen ? '100%' : '40%',
        maxHeight: isFullscreen ? '100%' : '76%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 20px',
        zIndex: 1000,
        minHeight: '655px',
      }}
      formClass={'h-100'}
      isAdditionalIcon={true}
      additionalIcon={isFullscreen ? <MinimizeModal /> : <MaximizeModal />}
      onAdditionalIconClick={toggleFullScreen}
      noPadding={true}
      clickOutsideToClose={false}
      showLoggedInCluster={true}
      loggedInClusterComponent={() => (
        <ShowLoggedInCluster
          showCluster={true}
          showProfileIcon={false}
          showMinimizeScreenIcon={true}
          onClick={onRequestClose}
        />
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
