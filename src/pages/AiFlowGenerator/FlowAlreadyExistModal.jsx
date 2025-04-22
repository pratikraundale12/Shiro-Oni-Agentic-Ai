import PropTypes from 'prop-types';
import React from 'react';
import { RightCircleIcon } from '../../assets';
import { ModalWithIcon } from '../../shared';

export const FlowAlreadyExistModal = ({
  isModalOpen,
  handleClose,
  handleSubmit,
}) => {
  return (
    <div>
      <ModalWithIcon
        title="Flow Already Exists"
        primaryButtonText={'Continue'}
        secondaryButtonText="Cancel"
        icon={<RightCircleIcon />}
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        primaryText="The flow you are trying to add already exists to the registry."
        secondaryText="If you want to deploy the flow please continue."
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default FlowAlreadyExistModal;

FlowAlreadyExistModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
};
