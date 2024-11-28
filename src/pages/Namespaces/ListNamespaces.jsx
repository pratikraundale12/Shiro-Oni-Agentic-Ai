import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { ActivityHistoryIcon, BookIcon, OpenEyeIcon } from '../../assets';
import { Grid, IconButton, TextRender } from '../../components';
import { KDFM, REFRESH_OPTIONS } from '../../constants';
import { history } from '../../helpers/history';
import { DoubleButton } from '../../shared';
import CopyToClipboard from '../../shared/CopyToClipboard';
import { NamespacesActions } from '../../store';
import { SchedularActions } from '../../store/schedular/redux';
import { useGlobalContext } from '../../utils';
import AuditLog from './AuditLog';
// import { logout } from '../../store/authentication';

const StyledButton = styled.button`
  color: #ff7a00;
  cursor: pointer;
  background: none;
  border: none;
  text-decoration: underline;
  text-underline-offset: 3px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
  z-index: 3;
  font-size: 14px;
  font-weight: 400;
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;
const FlowNameDiv = styled.div`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 16px;
  font-weight: 400;
  text-transform: ${props => (props.capitalizeText ? 'capitalize' : 'none')};
  background: none;
  border: none;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 185px;
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-right: 0.5rem;
`;

export const ListNamespaces = () => {
  const dispatch = useDispatch();
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const { setState } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    dispatch(NamespacesActions.resetDeployData());
  }, []);

  const sortFns = {
    name: array => sortByNameWithVersionFilter(array),
  };
  const state = {
    sortKey: 'name',
    reverse: false,
  };

  function sortByNameWithVersionFilter(arr) {
    const objectsWithVersion = arr.filter(item => item.version !== undefined);
    const objectsWithoutVersion = arr.filter(
      item => item.version === undefined
    );
    const sortedWithVersion = objectsWithVersion.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    const sortedWithoutVersion = objectsWithoutVersion.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    return [...sortedWithVersion, ...sortedWithoutVersion];
  }

  const handleScheduleClick = item => {
    dispatch(SchedularActions.setScheduleFromList(true));
    handleSelect(item);
  };

  const handleControllerService = item => {
    dispatch(NamespacesActions.getControllerServiceList());
    history.push('process-group/controller');
    dispatch(
      NamespacesActions.setSelectedNamespace({
        label: item.name,
        value: item.id,
      })
    );
  };

  useEffect(() => {
    dispatch(SchedularActions.setScheduleFromList(false));
  }, []);

  const COLUMNS = [
    {
      label: KDFM.NAMESPACE,
      renderCell: item => (
        <>
          <StyledButton
            data-tooltip-id={`tooltip-${item?.name}`}
            key={item.flowId}
            tabIndex="0"
            onClick={() => {
              setState(prev => ({ ...prev, search: '' }));
              dispatch(NamespacesActions.setFlowPath(item.flowId));
              dispatch(
                NamespacesActions.setSelectedNamespace({
                  label: item.name,
                  value: item.id,
                })
              );
              setCurrentPage(1);
            }}
          >
            {item?.name}
          </StyledButton>
          <ReactTooltip
            id={`tooltip-${item?.name}`}
            place="right"
            // effect="solid"
            content={item?.name}
            style={{
              width: '320px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </>
      ),
      width: '16%',
      sort: { sortKey: 'name' },
    },
    {
      label: KDFM.NAMESPACE_ID,
      renderCell: item => (
        <Flex>
          <TextRender text={item.id} />
          <span data-tooltip-id={`copy-board-namespace-list`}>
            <CopyToClipboard copyItem={item.id} />
          </span>

          <ReactTooltip
            id={`copy-board-namespace-list`}
            place="bottom"
            effect="solid"
            content={'Copy group Id'}
            style={{
              width: '125px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              zIndex: 10000,
            }}
          />
        </Flex>
      ),
      width: '25%',
    },
    {
      label: KDFM.FLOW_NAME,
      renderCell: item => (
        <>
          <FlowNameDiv data-tooltip-id={`tooltip-${item.flowName}`}>
            {item.flowName || KDFM.NA}
          </FlowNameDiv>
          <ReactTooltip
            id={`tooltip-${item?.flowName}`}
            place="right"
            content={item?.flowName}
            style={{
              width: '320px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </>
      ),
      width: '16%',
    },
    {
      label: KDFM.BUCKET_NAME,
      renderCell: item => (
        <>
          <FlowNameDiv data-tooltip-id={`tooltip-${item.bucketName}`}>
            {item.bucketName || KDFM.NA}
          </FlowNameDiv>
          <ReactTooltip
            id={`tooltip-${item?.bucketName}`}
            place="right"
            content={item?.bucketName}
            style={{
              width: '320px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </>
      ),
      width: '16%',
    },
    {
      label: KDFM.VERSION,
      renderCell: item => <TextRender text={item.version || KDFM.NA} />,
      width: '10%',
    },
    {
      label: KDFM.ACTIONS,
      renderCell: item => (
        <div className="d-flex gap-2">
          <button
            onClick={() => {
              setIsAuditLogOpen(true);
              setSelectedRowId(item?.id);
              dispatch(NamespacesActions.setSourceNamespaceId(item.id));
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            aria-label={KDFM.OPEN_AUDIT_LOG}
            data-tooltip-id={`tooltip-audit-log1`}
          >
            <IconButton>
              <ActivityHistoryIcon width={14} height={14} />
            </IconButton>
          </button>
          <ReactTooltip
            id={`tooltip-audit-log1`}
            place="left"
            content={'Audit Logs'}
            style={{
              width: '120px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          <button
            onClick={() => history.push(`/process-group/${item.id}`)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            data-tooltip-id={`tooltip-group-details`}
          >
            <IconButton>
              <OpenEyeIcon width={14} height={14} />
            </IconButton>
          </button>
          <ReactTooltip
            id={`tooltip-group-details`}
            place="left"
            content={'Group Details'}
            style={{
              width: '120px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          <button
            onClick={() => handleControllerService(item)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            data-tooltip-id={`tooltip-controller-service`}
          >
            <IconButton>
              <BookIcon color="grey" />
            </IconButton>
          </button>
          <ReactTooltip
            id={`tooltip-controller-service`}
            place="right"
            content={'Controller Service'}
            style={{
              width: '120px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          <DoubleButton
            disable={
              !item.flowId ||
              !item.version ||
              item.flowId === KDFM.NA ||
              item.version === KDFM.NA
            }
            item={item}
            handleLeftClick={handleSelect}
            handleRightClick={handleScheduleClick}
            handleControllerService={handleControllerService}
          />
        </div>
      ),
    },
  ];

  const handleSelect = item => {
    dispatch(NamespacesActions.setFlowPath(item.flowId));
    dispatch(
      NamespacesActions.setSelectedNamespace({
        label: item.name,
        value: item.id,
      })
    );

    history.push('/process-group/deploy', {
      state: {
        id: item.id,
      },
    });
  };

  return (
    <>
      <Grid
        isNamespace={true}
        module="namespaces"
        title={KDFM.NAMESPACE_LIST}
        columns={COLUMNS}
        refreshOptions={REFRESH_OPTIONS}
        placeholder={KDFM.SEARCH_NAMESPACE_FLOW_BUCKET_NAME}
        sortFns={sortFns}
        state={state}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        // handleIconClick={handleIconClick}
      />
      {/* <Deploy /> */}
      {isAuditLogOpen && (
        <AuditLog
          key={selectedRowId}
          rowId={selectedRowId}
          isOpen={isAuditLogOpen}
          closePopup={() => setIsAuditLogOpen(false)}
        />
      )}
    </>
  );
};
