import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from '../../shared';
import { SettingsActions, SettingsSelectors } from '../../store/settings';

const FlowValidationModal = () => {
  const dispatch = useDispatch();

  // ✅ Correct way to get state from Redux
  const isFlowValidationModalOpen = useSelector(
    SettingsSelectors.getFlowValidationModal
  );

  const isClosedFlowValidationModal = () =>
    dispatch(SettingsActions.flowValidationModalOpen(false));

  return (
    <Modal
      title="Add Controller Service"
      isOpen={isFlowValidationModalOpen}
      onRequestClose={isClosedFlowValidationModal}
      size="md"
      primaryButtonText="Add"
      secondaryButtonText="Back"
      contentStyles={{ maxWidth: '70%', maxHeight: '80%' }}
    >
      Modal Content Here
    </Modal>
  );
};

export default FlowValidationModal;
