import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StatusRender, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { Modal } from '../../shared';
import { NamespacesActions, NamespacesSelectors } from '../../store';

const COLUMNS = [
  {
    label: KDFM.TIMESTAMP,
    renderCell: item => <TextRender text={item.timestamp || KDFM.NA} />,
  },
  {
    label: KDFM.EVENT,
    renderCell: item => <TextRender text={item.event || KDFM.NA} />,
  },
  {
    label: KDFM.MESSAGE,
    renderCell: item => <TextRender text={item.message || KDFM.NA} />,
  },
  {
    label: KDFM.STATUS,
    renderCell: item => <StatusRender status={item.status || KDFM.NA} />,
  },
  {
    label: KDFM.CREATED_BY,
    renderCell: item => <TextRender text={item.created_by || KDFM.NA} />,
  },
];

const AuditLog = ({ isOpen, rowId, closePopup }) => {
  const dispatch = useDispatch();
  const namespaceAuditLog = useSelector(NamespacesSelectors.getNamespaceAudit);

  useEffect(() => {
    dispatch(NamespacesActions.fetchNamespaceAudit());
  }, [dispatch]);

  const auditTableData =
    (rowId &&
      namespaceAuditLog?.data?.filter(
        auditInfo => auditInfo?.record_id === rowId
      )) ||
    [];

  return (
    <Modal
      title={KDFM.AUDIT_LOG}
      isOpen={isOpen}
      onRequestClose={closePopup}
      size="lg"
      // secondaryButtonText="Back"
      primaryButtonText={KDFM.CONTINUE}
      // onSubmit={handleSubmit(onSubmit)}
      onSubmit={closePopup}
    >
      <Table data={auditTableData} columns={COLUMNS} />
    </Modal>
  );
};

// Add prop-types validation
AuditLog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  rowId: PropTypes.string,
  closePopup: PropTypes.func.isRequired,
};

export default AuditLog;
