import PropTypes from 'prop-types';
import React from 'react';
import { StatusRender, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { Modal } from '../../shared';

const dummyData = [
  {
    timestamp: '2024-07-27 10:30:00',
    event: 'Login',
    message: 'User logged in',
    status: 'Success',
    update_by: 'admin',
  },
  {
    timestamp: '2024-07-27 11:00:00',
    event: 'File Upload',
    message: 'File uploaded successfully',
    status: 'Success',
    update_by: 'user1',
  },
  {
    timestamp: '2024-07-27 12:45:00',
    event: 'Password Change',
    message: 'Password changed',
    status: 'Success',
    update_by: 'user2',
  },
  {
    timestamp: '2024-07-27 14:30:00',
    event: 'Logout',
    message: 'User logged out',
    status: 'Success',
    update_by: 'admin',
  },
  {
    timestamp: '2024-07-28 09:15:00',
    event: 'Login Attempt',
    message: 'Invalid password',
    status: 'Failed',
    update_by: 'user3',
  },
];

const COLUMNS = [
  {
    label: 'Timestamp',
    renderCell: item => <TextRender text={item.timestamp} />,
  },
  {
    label: 'Event',
    renderCell: item => <TextRender text={item.event} />,
  },
  {
    label: 'Message',
    renderCell: item => <TextRender text={item.message} />,
  },
  {
    label: 'Status',
    renderCell: item => <StatusRender status={item.status || KDFM.NA} />,
  },
  {
    label: 'Updated By',
    renderCell: item => <TextRender text={item.update_by} />,
  },
];

const AuditLog = ({ isOpen, closePopup }) => {
  return (
    <Modal
      title="Audit Log"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="md"
      secondaryButtonText="Back"
      primaryButtonText="Continue"
      // onSubmit={handleSubmit(onSubmit)}
    >
      <Table data={dummyData} columns={COLUMNS} />
    </Modal>
  );
};

// Add prop-types validation
AuditLog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
};

export default AuditLog;
