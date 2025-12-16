import React from 'react';
import { Modal } from '../../shared';
import PropTypes from 'prop-types';
import { Table } from '../../components';

export const FlowValidationErrorModal = ({
  isModalOpen,
  handleClose,
  errorData,
}) => {
  const COLUMNS = [
    {
      label: 'Flow Json Key',
      renderCell: item => item?.jsonkey,
      resize: true,
    },
    {
      label: 'Missing Value',
      renderCell: item => item?.missingValue,
      resize: true,
    },
  ];
  return (
    <div>
      <Modal
        title="Flow Validation Error Details"
        primaryButtonText={'Close'}
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        onSubmit={handleClose}
        contentStyles={{ minWidth: '50%' }}
      >
        <Table data={errorData} columns={COLUMNS} />
      </Modal>
    </div>
  );
};

export default FlowValidationErrorModal;

FlowValidationErrorModal.propTypes = {
  isModalOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  errorData: PropTypes.array,
};
