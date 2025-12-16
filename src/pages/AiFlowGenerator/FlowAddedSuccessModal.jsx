import React from 'react';
import { RightCircleIcon } from '../../assets';
import { ModalWithIcon } from '../../shared';
import PropTypes from 'prop-types';

export const FlowAddedSuccessModal = ({
  isModalOpen,
  handleClose,
  handleSubmit,
}) => {
  return (
    <div>
      <ModalWithIcon
        title="Flow Added Successfully"
        primaryButtonText={'Continue'}
        secondaryButtonText="Cancel"
        icon={<RightCircleIcon />}
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        primaryText="Your flow has been successfully added to the registry."
        secondaryText="If you want to deploy the flow please continue."
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default FlowAddedSuccessModal;

FlowAddedSuccessModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
};
