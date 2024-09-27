import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import { ActivityHistoryIcon, OpenEyeIcon } from '../../assets';
import { Grid, IconButton, TextRender } from '../../components';
import { KDFM, REFRESH_OPTIONS } from '../../constants';
import { history } from '../../helpers/history';
import { DoubleButton } from '../../shared';
import CopyToClipboard from '../../shared/CopyToClipboard';
import { NamespacesActions } from '../../store';
import { SchedularActions } from '../../store/schedular/redux';
import { useGlobalContext } from '../../utils';
import AuditLog from './AuditLog';

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
`;
const FlowNameDiv = styled.div`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.lg};
  font-weight: 400;
  text-transform: ${props => (props.capitalizeText ? 'capitalize' : 'none')};
  background: none;
  border: none;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 185px;
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
          <CopyToClipboard copyItem={item.id} />
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
            // effect="solid"
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
        <div className="d-flex gap-3">
          <button
            onClick={() => {
              setIsAuditLogOpen(true);
              setSelectedRowId(item?.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            aria-label={KDFM.OPEN_AUDIT_LOG}
          >
            <IconButton>
              <ActivityHistoryIcon width={16} height={16} />
            </IconButton>
          </button>
          <button
            onClick={() => history.push(`/process-group/${item.id}`)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <IconButton>
              <OpenEyeIcon width={16} height={16} />
            </IconButton>
          </button>
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
