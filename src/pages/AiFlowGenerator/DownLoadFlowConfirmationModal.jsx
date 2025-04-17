import React from 'react';
import PropTypes from 'prop-types';
import { ModalWithIcon } from '../../shared';
import { DownloadImageIcon } from '../../assets';

const DownloadFlowConfirmationModal = ({
  isModalOpen,
  setIsModalOpen,
  handleDownloadFlow,
}) => {
  const handleSubmit = e => {
    if (e?.preventDefault) e.preventDefault();
    if (e?.stopPropagation) e.stopPropagation();
    handleDownloadFlow();
    setIsModalOpen(false);
  };
  const handleClose = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(false);
  };
  return (
    <div>
      <ModalWithIcon
        title="Download the flow JSON"
        primaryButtonText={'Confirm'}
        secondaryButtonText="Cancel"
        icon={<DownloadImageIcon />}
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        primaryText={`Are you sure you want to proceed with the Download?`}
        secondaryText="If Yes, Please click on the Confirm Button"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DownloadFlowConfirmationModal;

DownloadFlowConfirmationModal.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  handleDownloadFlow: PropTypes.func.isRequired,
};
