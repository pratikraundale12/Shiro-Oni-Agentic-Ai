import React from 'react';
import PropTypes from 'prop-types';
import { ModalWithIcon } from '../../shared';
import { DeleteDustbinIcon } from '../../assets';

const DiscardFlowConfirmationModal = ({
  isDiscardFlowModalOpen,
  setIsDiscardFlowModalOpen,
  handleDiscardFlow,
  generatedFlow,
}) => {
  const handleSubmit = e => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    handleDiscardFlow(generatedFlow);
  };
  const handleClose = e => {
    e.preventDefault(); // Ensure closing doesn't trigger form submission
    e.stopPropagation();
    setIsDiscardFlowModalOpen(false);
  };
  return (
    <div>
      <ModalWithIcon
        title="Discard the flow JSON"
        primaryButtonText={'Discard'}
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={isDiscardFlowModalOpen}
        onRequestClose={handleClose}
        primaryText={`Are you sure you want to discard the flow JSON?`}
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
