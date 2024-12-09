import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  CalenderIcon2,
  OpenEyeIcon,
  SmallNotThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import { Grid, IconButton, TextRender } from '../../components';
import { KDFM, REFRESH_OPTIONS } from '../../constants';
import { history } from '../../helpers/history';
import { NamespacesActions } from '../../store';
import { SchedularActions } from '../../store/schedular/redux';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';

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
  font-size: 15px;
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

const StatusDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: 400;
  background: none;
  display: inline-block;
  white-space: nowrap;
  // width: 28px;
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

export const ListNamespaces = () => {
  const dispatch = useDispatch();
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
    dispatch(NamespacesActions.setdeployRegistryFlow(false));
    dispatch(NamespacesActions.setRegistryDeployVariable([]));
    dispatch(NamespacesActions.setRegistryDeployParameterContext([]));
    dispatch(NamespacesActions.setregistryDetailsFlow(false));
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
      width: '22%',
      sort: { sortKey: 'name' },
    },
    // {
    //   label: KDFM.NAMESPACE_ID,
    //   renderCell: item => (
    //     <Flex>
    //       <TextRender text={item.id} />
    //       <span data-tooltip-id={`copy-board-namespace-list`}>
    //         <CopyToClipboard copyItem={item.id} />
    //       </span>

    //       <ReactTooltip
    //         id={`copy-board-namespace-list`}
    //         place="bottom"
    //         effect="solid"
    //         content={'Copy group Id'}
    //         style={{
    //           width: '125px',
    //           whiteSpace: 'normal',
    //           wordWrap: 'break-word',
    //           zIndex: 10000,
    //         }}
    //       />
    //     </Flex>
    //   ),
    //   width: '25%',
    // },
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
      label: KDFM.STATUS,
      renderCell: item => {
        return (
          <div className="d-flex align-items-center flex-wrap gap-1">
            <StatusDiv data-tooltip-id={`tooltip-running-${item.id}`}>
              <TriangleIcons
                width={13}
                height={16}
                color={
                  item?.runningCount
                    ? theme.colors.secondaryActive
                    : theme.colors.disabled
                }
              />
              <span className="me-1">{item?.runningCount}</span>
            </StatusDiv>
            <ReactTooltip
              id={`tooltip-running-${item.id}`}
              place="right"
              content="Running Components"
              style={{
                width: '180px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            />
            <StatusDiv data-tooltip-id={`tooltip-stopped-${item.id}`}>
              <SquareBoxIcon
                width={15}
                height={15}
                color={
                  item?.stoppedCount
                    ? theme.colors.primaryDisabled
                    : theme.colors.disabled
                }
              />
              <span>{item?.stoppedCount}</span>
            </StatusDiv>
            <ReactTooltip
              id={`tooltip-stopped-${item.id}`}
              place="right"
              content="Stopped Components"
              style={{
                width: '180px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            />
            <StatusDiv data-tooltip-id={`tooltip-invalid-${item.id}`}>
              <TriangleExclamationMarkIcon
                color={
                  item?.invalidCount
                    ? theme.colors.caution
                    : theme.colors.disabled
                }
              />
              <span>{item?.invalidCount}</span>
            </StatusDiv>
            <ReactTooltip
              id={`tooltip-invalid-${item.id}`}
              place="right"
              content="Invalid Components"
              style={{
                width: '160px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            />
            <StatusDiv data-tooltip-id={`tooltip-disabled-${item.id}`}>
              <SmallNotThunderIcon
                color={
                  item?.disabledCount
                    ? theme.colors.black
                    : theme.colors.disabled
                }
              />
              <span>{item?.disabledCount}</span>
            </StatusDiv>
            <ReactTooltip
              id={`tooltip-disabled-${item.id}`}
              place="right"
              content="Disabled Components"
              style={{
                width: '180px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            />
          </div>
        );
      },
      width: '18%',
    },

    {
      label: KDFM.ACTIONS,
      renderCell: item => (
        <div className="d-flex align-self-end gap-2">
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
            content={'Process Group Details'}
            style={{
              width: '120px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          <button
            onClick={() => handleScheduleClick(item)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
            data-tooltip-id={`tooltip-schedule-deployment`}
          >
            <IconButton>
              <CalenderIcon2 width={14} height={14} color="grey" />
            </IconButton>
          </button>
          <ReactTooltip
            id={`tooltip-schedule-deployment`}
            place="right"
            content={'Schedule Deployment'}
            style={{
              width: '120px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          <button
            type="button"
            disabled={!item?.permissions?.canWrite}
            className="btn btn-primary"
            onClick={() => handleSelect(item)}
            style={{
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
              borderRight: '1px solid #fff',
            }}
          >
            {KDFM.UPGRADE}
          </button>
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
        ...item,
      })
    );
    dispatch(NamespacesActions.setVersionSelect({ version: item.version }));
    dispatch(NamespacesActions.setDeployByRegistryFlow(false));
    dispatch(
      NamespacesActions.fetchVersionData({
        bucketId: item.bucketId,
        flowId: item.flowId,
      })
    );
    history.push('/process-group/flow-details', {
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
    </>
  );
};
