import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styled from 'styled-components';
import {
  CalenderIcon2,
  DeleteDustbinIcon,
  DeleteSmallIcon,
  OpenEyeIcon,
  SmallNotThunderIcon,
  SquareBoxIcon,
  TriangleExclamationMarkIcon,
  TriangleIcons,
} from '../../assets';
import { FullPageLoader, Grid, IconButton, TextRender } from '../../components';
import { KDFM, REFRESH_OPTIONS } from '../../constants';
import { history } from '../../helpers/history';
import { ModalWithIcon } from '../../shared/Modal/ModalWithIcon';
import {
  ClustersSelectors,
  LoadingSelectors,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';
import { SchedularActions } from '../../store/schedular/redux';
import { SettingsSelectors } from '../../store/settings';
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
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 400;
  font-size: 15px;
  display: block;
  width: 100%;
  text-align: left;

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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  const {
    state: { search },
    setState,
  } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    dispatch(NamespacesActions.resetDeployData());
  }, []);
  const state = {
    sortKey: 'name',
    reverse: false,
  };
  const settingsData = useSelector(SettingsSelectors.getSettings);
  const clustersList = useSelector(ClustersSelectors.getAllClustersList);
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const selectedClusterObj = clustersList.filter(
    item => item?.id === selectedCluster?.value
  );

  const selectedClusterString = localStorage.getItem('selected_cluster');
  const parsedSelectedCluster = JSON.parse(selectedClusterString);

  useEffect(() => {
    if (
      (!isEmpty(settingsData) &&
        isEmpty(settingsData?.username) &&
        isEmpty(selectedClusterObj) &&
        isEmpty(parsedSelectedCluster?.value)) ||
      (!isEmpty(settingsData) &&
        isEmpty(settingsData?.username) &&
        !isEmpty(selectedClusterObj) &&
        !selectedClusterObj?.[0]?.has_custom_service_account &&
        !isEmpty(parsedSelectedCluster?.value))
    ) {
      toast.info(
        isEmpty(selectedCluster?.value)
          ? 'Please login to cluster'
          : 'The service account has not been configured. Please complete the configuration to proceed.',
        { toastId: 'login-service-account-toast', autoClose: 5000 }
      );
    } else if (
      !isEmpty(settingsData) &&
      !isEmpty(settingsData?.username) &&
      isEmpty(parsedSelectedCluster?.value)
    ) {
      toast.info('Please login to cluster', {
        toastId: 'login-cluster-toast',
        autoClose: 5000,
      });
    }
  }, [settingsData?.username, selectedClusterObj, parsedSelectedCluster]);
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
    dispatch(NamespacesActions.setVersionListReduxData([]));
    dispatch(NamespacesActions.setAlreadyFetchedLsIdentifierForUpgrade([]));
    dispatch(NamespacesActions.setLocalServiceInUpgrade([]));
  }, []);

  const ListForTooltip = item => {
    return (
      <>
        {item?.name && (
          <>
            <li>Name : {item?.name}</li>
            {<li>ID : {item?.id}</li>}
            {!isEmpty(search) && item?.parent && (
              <li>Parent : {item.parent}</li>
            )}
          </>
        )}
      </>
    );
  };
  const COLUMNS = [
    {
      label: (
        <>
          <ProcessGroupSorting
            sortProperty="name"
            module="namespaces"
            clickableName={KDFM.NAMESPACE}
          />
        </>
      ),
      renderCell: item => (
        <>
          <StyledButton
            data-tooltip-id={`${item?.id}-name`}
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
            id={`${item?.id}-name`}
            place="right"
            // effect="solid"
            content={ListForTooltip(item)}
            style={{
              width: 'auto',
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
        </>
      ),
      width: '22%',
      resize: true,
    },

    {
      label: (
        <>
          <ProcessGroupSorting
            sortProperty="flowName"
            module="namespaces"
            clickableName={KDFM.FLOW_NAME}
          />
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
      resize: true,
    },
    {
      label: (
        <>
          <ProcessGroupSorting
            sortProperty="bucketName"
            module="namespaces"
            clickableName={KDFM.BUCKET_NAME}
          />
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
      resize: true,
    },
    {
      label: KDFM.VERSION,
      renderCell: item => <TextRender text={item.version || KDFM.NA} />,
      width: '10%',
      resize: true,
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
      resize: true,
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
          {item?.permissions?.canWrite && (
            <button
              onClick={e => handleDeleteClick(item, e)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              data-tooltip-id={`tooltip-delete-${item.id}`}
            >
              <IconButton>
                <DeleteSmallIcon width={14} height={14} />
              </IconButton>
            </button>
          )}
          <ReactTooltip
            id={`tooltip-delete-${item.id}`}
            place="right"
            content={`Delete ${item?.name} Process Group`}
            style={{
              whiteSpace: 'normal',
              wordWrap: 'break-word',
            }}
          />
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
      resize: true,
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

  const handleDeleteClick = (item, e) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
    e.currentTarget.blur();
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      dispatch(NamespacesActions.deleteNamespace(itemToDelete.id));
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'deleteNamespace')
  );

  return (
    <>
      <FullPageLoader loading={loading} />
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

      <ModalWithIcon
        title={`Delete : ${itemToDelete?.name}`}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={deleteModalOpen}
        onRequestClose={handleCancelDelete}
        primaryText={`Are you sure you want to delete ${itemToDelete?.name} process group?`}
        onSubmit={handleConfirmDelete}
      />
    </>
  );
};
