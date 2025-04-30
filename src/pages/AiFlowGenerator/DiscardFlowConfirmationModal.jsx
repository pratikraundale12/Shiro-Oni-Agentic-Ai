import React from 'react';
import PropTypes from 'prop-types';
import { ModalWithIcon } from '../../shared';
import { DeleteDustbinIcon } from '../../assets';

const DiscardFlowConfirmationModal = ({
  isDiscardFlowModalOpen,
  setIsDiscardFlowModalOpen,
  handleDiscardFlow,
}) => {
  const handleSubmit = e => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    handleDiscardFlow();
  };
  const handleClose = e => {
    e.preventDefault(); // Ensure closing doesn't trigger form submission
    e.stopPropagation();
    setIsDiscardFlowModalOpen(false);
  };
  return (
    <div>
      <ModalWithIcon
        title="Flow will get lost"
        primaryButtonText={'Navigate away'}
        secondaryButtonText="Stay here"
        icon={<DeleteDustbinIcon />}
        isOpen={isDiscardFlowModalOpen}
        onRequestClose={handleClose}
        primaryText={`Any unsaved changes may be lost if you navigate away from this page or switch tabs !!!`}
        secondaryText="Please make sure to download or save flow to registry before proceeding"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DiscardFlowConfirmationModal;

DiscardFlowConfirmationModal.propTypes = {
  isDiscardFlowModalOpen: PropTypes.bool.isRequired,
  setIsDiscardFlowModalOpen: PropTypes.func.isRequired,
  handleDiscardFlow: PropTypes.func.isRequired,
  generatedFlow: PropTypes.object,
};
