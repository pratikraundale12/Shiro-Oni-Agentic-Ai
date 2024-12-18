import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { StatusRender, Table, TextRender } from '../../components';
import { KDFM } from '../../constants';
import { NamespacesActions, NamespacesSelectors } from '../../store';

const DataWrapper = styled.div`
  width: 100%;
`;

const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
`;

const COLUMNS = [
  {
    label: KDFM.EVENT,
    renderCell: item => <TextRender text={item.event || KDFM.NA} />,
  },
  {
    label: KDFM.NAMESPACE,
    renderCell: item => <TextRender text={item.namespace || KDFM.NA} />,
  },
  {
    label: KDFM.FLOW_NAME,
    renderCell: item => <TextRender text={item.flow_name || KDFM.NA} />,
  },
  {
    label: KDFM.CLUSTER,
    renderCell: item => <TextRender text={item.cluster || KDFM.NA} />,
  },
  {
    label: KDFM.MESSAGE,
    renderCell: item => (
      <TextRender text={item.message || KDFM.NA} capitalizeText={false} />
    ),
    width: '25%',
  },
  {
    label: KDFM.VERSION,
    renderCell: item => <TextRender text={item.version || KDFM.NA} />,
  },
  {
    label: KDFM.STATUS,
    renderCell: item => <StatusRender status={item.status || KDFM.NA} />,
  },
  {
    label: KDFM.TIMESTAMP,
    renderCell: item => <TextRender text={item.timestamp || KDFM.NA} />,
  },
  {
    label: KDFM.CREATED_BY,
    renderCell: item => <TextRender text={item.created_by_name || KDFM.NA} />,
  },
];

const AuditLog = () => {
  const dispatch = useDispatch();
  const namespaceAuditLog = useSelector(NamespacesSelectors.getNamespaceAudit);

  useEffect(() => {
    dispatch(NamespacesActions.fetchNamespaceAudit());
  }, [dispatch]);

  return (
    <DataWrapper>
      <ScrollSetGrey className="scroll-set-grey pe-1">
        <Table data={namespaceAuditLog?.data || []} columns={COLUMNS} />
      </ScrollSetGrey>
    </DataWrapper>
  );
};

// Add prop-types validation
AuditLog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  rowId: PropTypes.string,
  closePopup: PropTypes.func.isRequired,
};

export default AuditLog;
