import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusRender, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';

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
    renderCell: item => <TextRender text={item.updated_by} />,
  },
];

const AuditLog = ({ isOpen, closePopup }) => {
  const dispatch = useDispatch();
  const namespaceAuditLog = useSelector(NamespacesSelectors.getNamespaceAudit);

  useEffect(() => {
    dispatch(NamespacesActions.fetchNamespaceAudit());
  }, []);

  return (
    <Modal
      title="Audit Log"
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="lg"
      // secondaryButtonText="Back"
      primaryButtonText={KDFM.CONTINUE}
      // onSubmit={handleSubmit(onSubmit)}
      onSubmit={closePopup}
    >
      <Table data={namespaceAuditLog?.data} columns={COLUMNS} />
    </Modal>
  );
};

// Add prop-types validation
AuditLog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  closePopup: PropTypes.func.isRequired,
};

export default AuditLog;
