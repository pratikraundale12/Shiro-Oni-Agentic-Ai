import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { OpenEyeIcon, SortDownIcon, SortUpIcon } from '../../assets';
import {
  FullPageLoader,
  IconButton,
  StatusRender,
  Table,
  TextRender,
} from '../../components';
import { KDFM } from '../../constants';
import {
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import SanityCheckAuditLogReportModal from './SanityCheckAuditLogReportModal';

const DataWrapper = styled.div`
  width: 100%;
`;

const ScrollSetGrey = styled.div`
  min-height: calc(100vh - 341px);
  max-height: calc(100vh - 341px);
  overflow-x: hidden;
  overflow-y: auto;
`;

const AuditLog = () => {
  const dispatch = useDispatch();
  const namespaceAuditLog = useSelector(NamespacesSelectors.getNamespaceAudit);
  const [sortingState, setSortingState] = useState('');
  const [isSanityCheckModalOpen, setIsSanitCheckModalOpen] = useState(false);
  const convertDateTime = dateString => {
    if (!dateString) return 'No date provided';

    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };
  const toggleSorting = column => {
    setSortingState(prevState => {
      if (prevState === column) {
        return `-${column}`;
      }
      return column;
    });
  };

  const handleCheckSanity = item => {
    dispatch(
      NamespacesActions.fetchSanityReportAuditLog(item?.sanity_record_id)
    );
    setIsSanitCheckModalOpen(true);
  };
  const COLUMNS = [
    {
      label: (
        <>
          <button
            onClick={() => toggleSorting('event')}
            style={{ background: 'none' }}
          >
            {KDFM.EVENT}{' '}
            {sortingState === 'event' ? (
              <SortUpIcon />
            ) : sortingState === '-event' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      renderCell: item => <TextRender text={item.event || KDFM.NA} />,
      width: '10%',
      resize: true,
    },
    {
      label: KDFM.NAMESPACE,
      renderCell: item => <TextRender text={item.namespace || KDFM.NA} />,
      width: '8%',
      resize: true,
    },
    {
      label: KDFM.FLOW_NAME,
      renderCell: item => <TextRender text={item.flow_name || KDFM.NA} />,
      width: '8%',
      resize: true,
    },
    {
      label: (
        <>
          <button
            style={{ background: 'none' }}
            onClick={() => toggleSorting('cluster')}
          >
            {KDFM.CLUSTER}{' '}
            {sortingState === 'cluster' ? (
              <SortUpIcon />
            ) : sortingState === '-cluster' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      renderCell: item => <TextRender text={item.cluster || KDFM.NA} />,
      width: '12%',
      resize: true,
    },
    {
      label: KDFM.MESSAGE,
      renderCell: item => (
        <TextRender text={item.message || KDFM.NA} capitalizeText={false} />
      ),
      width: '15%',
      resize: true,
    },
    {
      label: KDFM.VERSION,
      renderCell: item => <TextRender text={item.version || KDFM.NA} />,
      width: '8%',
      resize: true,
    },
    {
      label: KDFM.STATUS,
      renderCell: item => (
        <StatusRender status={item.status || KDFM.NA} redColor="#FF0000" />
      ),
      width: '8%',
      resize: true,
    },
    {
      label: (
        <>
          <button
            onClick={() => toggleSorting('timestamp')}
            style={{ background: 'none' }}
          >
            {KDFM.TIMESTAMP}{' '}
            {sortingState === 'timestamp' ? (
              <SortUpIcon />
            ) : sortingState === '-timestamp' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      renderCell: item => (
        <TextRender text={convertDateTime(item.timestamp) || KDFM.NA} />
      ),
      width: '15%',
      resize: true,
    },
    {
      label: (
        <>
          <button
            style={{ background: 'none' }}
            onClick={() => toggleSorting('created_by_name')}
          >
            {KDFM.CREATED_BY}{' '}
            {sortingState === 'created_by_name' ? (
              <SortUpIcon />
            ) : sortingState === '-created_by_name' ? (
              <SortDownIcon />
            ) : (
              <SortDownIcon />
            )}
          </button>
        </>
      ),
      renderCell: item => <TextRender text={item.created_by_name || KDFM.NA} />,
      width: '10%',
      resize: true,
    },
    {
      label: KDFM.ACTIONS,
      renderCell: item => (
        <>
          {item?.sanity_record_id && (
            <IconButton onClick={() => handleCheckSanity(item)}>
              <OpenEyeIcon width={14} height={14} />
            </IconButton>
          )}
        </>
      ),

      width: '6%',
      resize: true,
    },
  ];

  useEffect(() => {
    dispatch(NamespacesActions.fetchNamespaceAudit(sortingState));
  }, [dispatch, sortingState]);

  const auditLogLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchNamespaceAudit')
  );
  const sanityLogLoading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchSanityReportAuditLog')
  );
  return (
    <>
      <FullPageLoader loading={auditLogLoading || sanityLogLoading} />
      <DataWrapper>
        <ScrollSetGrey className="scroll-set-grey pe-1">
          <Table data={namespaceAuditLog?.data || []} columns={COLUMNS} />
        </ScrollSetGrey>
      </DataWrapper>
      <SanityCheckAuditLogReportModal
        isSanityCheckModalOpen={isSanityCheckModalOpen}
        setIsSanitCheckModalOpen={setIsSanitCheckModalOpen}
      />
    </>
  );
};

// Add prop-types validation
AuditLog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  rowId: PropTypes.string,
  closePopup: PropTypes.func.isRequired,
};

export default AuditLog;
