import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { OpenEyeIcon, SortDownIcon, SortUpIcon } from '../../assets';
import {
  FullPageLoader,
  IconButton,
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
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { StatusText } from '../ScheduleDeployment/StatusText';

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
  const toggleSorting = column => {
    setSortingState(prevState => {
      if (prevState === column) {
        return `-${column}`;
      }
      return column;
    });
  };

  const handleCheckSanity = (item, e) => {
    e.currentTarget.blur();
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
        <StatusText text={item?.status?.replace(/_/g, ' ')} item={item} />
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
        <TextRender text={item.formattedTimestamp || KDFM.NA} />
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
          {item?.sanity_data && (
            <>
              <IconButton
                onClick={e => handleCheckSanity(item, e)}
                data-tooltip-id={`${`tooltip-group-sanity-audit-icon`}`}
              >
                <OpenEyeIcon width={14} height={14} />
              </IconButton>
              <ReactTooltip
                id={`tooltip-group-sanity-audit-icon`}
                place="left"
                content={'View Sanity Report'}
                style={{
                  width: '180px',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              />
            </>
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
