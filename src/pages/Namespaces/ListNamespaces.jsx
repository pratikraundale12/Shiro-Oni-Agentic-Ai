import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
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
import ProcessGroupSorting from './ProcessGroupSorting';

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
  const state = {
    sortKey: 'name',
    reverse: false,
  };

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
    dispatch(NamespacesActions.setFlowControlAfterUpgrade(false));
    dispatch(NamespacesActions.setNewlyAddedExternalServiceCS({}));
    dispatch(NamespacesActions.setScheduleByRegistry(false));
    dispatch(NamespacesActions.setFlowControlStateAtScheduleDeploy(null));
    dispatch(NamespacesActions.setRegistryFlowXCord(null));
    dispatch(NamespacesActions.setRegistryFlowYCord(null));
    dispatch(NamespacesActions.setFlowControlAfterDeploy(false));
    dispatch(NamespacesActions.setDeployFormData({}));
    dispatch(NamespacesActions.setVersionListData({}));
    dispatch(NamespacesActions.setDeployedModal(false));
    dispatch(NamespacesActions.setCsLocalData({}));
    dispatch(NamespacesActions.setIsLocalCsConfigured(false));
    dispatch(NamespacesActions.setPcLocalData({}));
    dispatch(NamespacesActions.setVariableLocalData([]));
    dispatch(NamespacesActions.setIsLocalPcUpdated(false));
    dispatch(NamespacesActions.setIsLocalVariableUpdated(false));
    dispatch(NamespacesActions.setRegistryDeployControllerService({}));
    dispatch(NamespacesActions.setRegistryDeployParameterContext([]));
    dispatch(NamespacesActions.setRegistryDeployVariable([]));
  }, []);

  const COLUMNS = [
    {
      label: (
        <>
          {' '}
          {KDFM.NAMESPACE}{' '}
          <ProcessGroupSorting sortProperty="name" module="namespaces" />
        </>
      ),
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
              width: 'auto',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </>
      ),
      width: '22%',
    },

    {
      label: (
        <>
          {KDFM.FLOW_NAME}
          <ProcessGroupSorting sortProperty="flowName" module="namespaces" />
        </>
      ),
      renderCell: item => (
        <>
          <FlowNameDiv data-tooltip-id={`tooltip-${item.flowName}1`}>
            {item.flowName || KDFM.NA}
          </FlowNameDiv>
          <ReactTooltip
            id={`tooltip-${item?.flowName}1`}
            place="right"
            content={item?.flowName}
            style={{
              width: 'auto',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </>
      ),
      width: '16%',
    },
    {
      label: (
        <>
          {KDFM.BUCKET_NAME}{' '}
          <ProcessGroupSorting sortProperty="bucketName" module="namespaces" />
        </>
      ),
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
              width: 'auto',
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
              content="Running Flows"
              style={{
                width: '125px',
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
              content="Stopped Flows"
              style={{
                width: '135px',
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
              content="Invalid Flows"
              style={{
                width: '125px',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              }}
            />
            <StatusDiv data-tooltip-id={`tooltip-disabled-${item.id}`}>
              <SmallNotThunderIcon
                width={14}
                height={16}
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
              content="Disabled Flows"
              style={{
                width: '130px',
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
            onClick={() => {
              history.push(`/process-group/${item.id}`);
              dispatch(NamespacesActions.setSelectedNamespace(item));
            }}
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
              width: '175px',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
          {item?.version && (
            <>
              <button
                onClick={() => handleScheduleClick(item)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: !item?.version ? 'not-allowed' : 'pointer',
                }}
                data-tooltip-id={`tooltip-schedule-deployment-list`}
                disabled={!item?.version}
              >
                <IconButton>
                  <CalenderIcon2 width={14} height={14} color="grey" />
                </IconButton>
              </button>
              <ReactTooltip
                id={`tooltip-schedule-deployment-list`}
                place="right"
                content={'Schedule Upgrade'}
                style={{
                  width: '180px',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }}
              />
            </>
          )}
          {!(!item?.permissions?.canWrite || !item?.version) && (
            <button
              type="button"
              disabled={!item?.permissions?.canWrite || !item?.version}
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
          )}
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
    dispatch(NamespacesActions.setSelectedNameSpaceForDetail({}));
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
        state={state}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};
