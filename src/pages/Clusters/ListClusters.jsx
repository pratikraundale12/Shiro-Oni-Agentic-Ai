import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  ActiveIcon,
  CopyIcon,
  DeleteDustbinIcon,
  DeleteSmallIcon,
  LogoutIcon,
  LogsIcon,
  ManageHostIcon,
  MetricsIcon,
  OpenEyeIcon,
  PencilIcon,
  RegistryIcon,
  SortDownIcon,
  SortUpIcon,
} from '../../assets';
import {
  ActionRender,
  Grid,
  ProgressBarRender,
  StatusRender,
  TextRender,
  UrlRender,
} from '../../components';
import { CLUSTER_STATUS, Cluster_STATUS_OPTIONS, KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { CheckboxField, Modal, ModalWithIcon } from '../../shared';
import {
  ClustersActions,
  ClustersSelectors,
  DashboardActions,
  GridActions,
  NamespacesActions,
} from '../../store';
import { deleteCluster, updateCluster } from '../../store/index1';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';
import { useGlobalContext } from '../../utils';
import ClusterSuccessModal from './components/ClusterSuccessModal';
import { AddOrEditClusterModal } from './components/AddOrEditClusterSetupModal';
import { ClusterRegistryAssociationModal } from './components/ClusterRegistryAssociationModal';
import AnimatedProgressBar from '../../shared/AnimatedProgressBar';
import { ClusterProcessDisplayModal } from './components/ClusterProcessDisplayModal';
import { ClusterLoginWithOutCredModal } from './components/ClusterLoginWithoutCredModal';

const List = styled.div`
  width: 165px;
  position: absolute;
  top: ${({ posY }) => posY}px;
  left: ${({ posX }) => posX}px;
  z-index: 1000;
  background: ${props => props.theme.colors.white};
  box-shadow: 0px 0px 5px 0px ${props => props.theme.colors.shadow};
  border-radius: 10px;

  & > div:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  & > div:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const DropdownPortal = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};

const Item = styled.div`
  width: 10rem;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 14px 12px;
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.md};
  color: ${props => props.theme.colors.darker};

  &:hover {
    background-color: ${props => props.theme.colors.lightGrey};
  }
  > span {
    margin-top: 2px;
    margin-left: 10px;
  }
  & > svg {
    flex-shrink: 0;
  }
`;

const StyledLink = styled.a`
  width: 8rem;
  color: #444445;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 14px 15px;
  text-decoration: none !important;
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.md};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  &:hover {
    background-color: ${props => props.theme.colors.lightGrey};
  }
  & > a {
    text-decoration: none !important;
    color: #444445;
  }
  & > svg {
    flex-shrink: 0;
    margin-right: 10px;
  }
`;

const MetricsIconContainer = styled.div`
  & > svg {
    margin-left: -1px !important;
    margin-right: 8px !important;
  }
`;

const PrimaryText = styled.h5`
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 14px;
`;

export const ListClusters = () => {
  const dispatch = useDispatch();
  const { state, setState } = useGlobalContext();
  const [deactiveId, setDeactiveId] = useState(null);
  const [deleteHardId, setDeleteHardId] = useState(null);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const menuRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingState, setSortingState] = useState('name');
  const hardDeleteModalOpen = useSelector(
    ClustersSelectors.getIsclusterHardDeleteModalOpen
  );
  const ansibleClusterNiFiDeleteOpen = useSelector(
    ClustersSelectors.getisAnsibleClusterDeleteFrimNiFiModalOpen
  );
  const failedClusterNiFiDeleteOpen = useSelector(
    ClustersSelectors.getIsFailedClusterDeleteModalOpen
  );
  const [unInstallNiFi, setUninstallNiFi] = useState(true);

  const [selectedCluster, setSelectedCluster] = useState({});
  const isCopyClusterModalOpen = useSelector(
    ClustersSelectors.getIsCopyClusterModalOpen
  );
  const copyClusterData = useSelector(ClustersSelectors.getCopyClusterData);
  const originalClusterName = useSelector(
    ClustersSelectors.getOriginalClusterName
  );
  const statusData = useSelector(SchedularSelectors.getStatusFilterData);
  const itemPerClusterList = useSelector(ClustersSelectors.getClusterListItems);
  const toggleSorting = column => {
    setSortingState(prevState => {
      if (prevState === column) {
        return `-${column}`; // Toggle to descending
      } else if (prevState === `-${column}`) {
        return column; // Toggle back to ascending
      }
      return column; // Default to ascending
    });
  };

  const [menuState, setMenuState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    row: {},
  });

  const handleEditAnsibleCluster = item => {
    dispatch(ClustersActions.setansibleClucterToEdit(item?.id));
    dispatch(ClustersActions.setActiveTabClusterSetup('cluster_details'));

    history.push(`/clusters/setup-cluster`);
  };
  const handleupdateNodesAnsibleCluster = item => {
    dispatch(ClustersActions.setAnsibleClusterNodeUpdate(item?.id));
    dispatch(ClustersActions.setActiveTabClusterSetup('cluster_details'));

    history.push(`/clusters/setup-cluster`);
  };

  useEffect(() => {
    dispatch(SchedularActions.setStatusFilterData(''));
    dispatch(ClustersActions.setansibleClucterToEdit(''));
    dispatch(ClustersActions.setAnsibleClusterData({}));
    dispatch(ClustersActions.setAnsibleClusterNodeUpdate(''));
    dispatch(ClustersActions.fetchClusters());
  }, [dispatch]);

  const handleHardDeleteAnsibleCluster = item => {
    handleCloseMenu();
    setSelectedCluster(item);
    setDeleteHardId(item?.id);
    dispatch(ClustersActions.setisAnsibleClusterDeleteFrimNiFiModalOpen(true));
  };
  const handleHardDeleteFailedAnsibleCluster = item => {
    handleCloseMenu();
    setSelectedCluster(item);
    setDeleteHardId(item?.id);
    dispatch(ClustersActions.setIsFailedClusterDeleteModalOpen(true));
  };
  const handleAnsibleClusterNiFiDeleteConfirmation = () => {
    handleCloseMenu();
    dispatch(
      ClustersActions.deleteAnsibleClusterHard({
        clusterId: selectedCluster?.id,
        payload: { deleteType: 'nifi_uninstall' },
      })
    );
    setSelectedCluster({});
    setUninstallNiFi(false);
  };

  const handleOpenProgressModal = item => {
    setIsProcessModalOpen(true);
    dispatch(ClustersActions.setProgressTrackingModalOpen(true));
    setSelectedCluster(item);
  };
  const COLUMNS = [
    {
      label: (
        <>
          <button
            onClick={() => toggleSorting('name')}
            style={{ background: 'none' }}
          >
            {KDFM.CLUSTER_NAME}{' '}
            {sortingState === '-name' ? (
              <SortDownIcon />
            ) : sortingState === 'name' ? (
              <SortUpIcon />
            ) : (
              <SortUpIcon />
            )}
          </button>
        </>
      ),
      renderCell: item => (
        <TextRender text={item.name} capitalizeText={false} />
      ),
      width: '18%',
      sort: { sortKey: 'name' },
      resize: true,
    },
    {
      label: KDFM.NIFI_URL,
      renderCell: item => {
        const updatedUrl = item.nifi_url.endsWith('/nifi')
          ? item.nifi_url
          : `${item.nifi_url}/nifi`;

        return (
          <UrlRender
            tooltipId={'cluster-url-tooltip'}
            copy_btn_tooltip={'Copy Cluster URL'}
            url={updatedUrl}
          />
        );
      },
      width: '40%',
      resize: true,
    },
    {
      label: KDFM.CLUSTER_STATUS,
      renderCell: item => (
        <>
          {item?.process_initiated ? (
            <div
              onClick={() => handleOpenProgressModal(item)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleOpenProgressModal(item);
                }
              }}
              className="bg-transparent p-0 w-100"
              role="button"
              tabIndex={0}
            >
              <AnimatedProgressBar id={item?.id} />
            </div>
          ) : (
            <ProgressBarRender
              is_active={item.is_active}
              count={item.connected_nodes}
              maxCount={item.total_nodes}
              status={item.status}
            />
          )}
        </>
      ),
      width: '15%',
      resize: true,
    },
    {
      label: KDFM.STATUS,
      renderCell: item => (
        <>
          {!item?.created_by_ansible ? (
            <StatusRender status={item.status} />
          ) : (
            <StatusRender
              status={
                item?.process_initiated &&
                item?.state != 'FAILED' &&
                item?.process_name == 'delete'
                  ? 'Deleting'
                  : item?.process_initiated && item?.state != 'FAILED'
                    ? 'Inprogress'
                    : !item?.process_intiated && item?.state == 'FAILED'
                      ? 'Failed'
                      : item.status
              }
            />
          )}
        </>
      ),
      width: '10%',
      resize: true,
    },
    {
      label: KDFM.ACTIONS,
      renderCell: item => {
        return (
          <>
            {
              <ActionRender
                handleMenuClick={handleMenuClick}
                item={item}
                handleHardDeleteFailedAnsibleCluster={
                  handleHardDeleteFailedAnsibleCluster
                }
                handleOpenProgressModal={handleOpenProgressModal}
              >
                {menuState.isVisible && item.id === menuState.row.id && (
                  <DropdownPortal>
                    <List
                      ref={menuRef}
                      posX={menuState.x - 180}
                      posY={menuState.y}
                    >
                      {item.is_active ? (
                        <>
                          {item.edit_cluster && (
                            <Item onClick={() => handleClick('edit')}>
                              <PencilIcon width={16} height={16} />
                              <span>{KDFM.EDIT}</span>
                            </Item>
                          )}

                          {item.edit_cluster && (
                            <Item
                              onClick={() =>
                                handleClick('view', item?.id, item)
                              }
                            >
                              <OpenEyeIcon width={18} height={18} />
                              <span>{KDFM.VIEW}</span>
                            </Item>
                          )}
                          {item.edit_cluster && item?.created_by_ansible && (
                            <Item
                              onClick={() => handleEditAnsibleCluster(item)}
                            >
                              <PencilIcon width={16} height={16} />
                              <span>Upgrade</span>
                            </Item>
                          )}
                          {item.edit_cluster && item?.created_by_ansible && (
                            <Item
                              onClick={() =>
                                handleupdateNodesAnsibleCluster(item)
                              }
                            >
                              <ManageHostIcon width={18} height={18} />
                              <span>Manage Nodes</span>
                            </Item>
                          )}
                          {item?.edit_cluster &&
                            item?.created_by_ansible &&
                            item?.status !== CLUSTER_STATUS.DISCONNECTED &&
                            !item?.registry_id && (
                              <Item
                                onClick={() => {
                                  handleCloseMenu();
                                  setSelectedCluster(item);
                                  dispatch(
                                    ClustersActions.setIsRegitryAssociationModalOpen(
                                      true
                                    )
                                  );
                                }}
                              >
                                <RegistryIcon
                                  width={18}
                                  height={18}
                                  color="black"
                                />
                                <span>{KDFM.REGISTRY}</span>
                              </Item>
                            )}
                          <>
                            {item.deactivate_cluster && (
                              <Item
                                onClick={() => handleClick('delete', item.id)}
                              >
                                <LogoutIcon color="black" />
                                <span>{KDFM.DEACTIVATE}</span>
                              </Item>
                            )}
                            {!isEmpty(item?.metrics_url) && (
                              <StyledLink
                                target="_blank"
                                rel="noopener noreferrer"
                                href={item?.metrics_url}
                              >
                                <MetricsIconContainer>
                                  <MetricsIcon />
                                </MetricsIconContainer>
                                <a
                                  href={item?.metrics_url}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  {KDFM.METRICS}
                                </a>
                              </StyledLink>
                            )}
                            {!isEmpty(item?.logs_url) && (
                              <StyledLink
                                target="_blank"
                                rel="noopener noreferrer"
                                href={item?.logs_url}
                              >
                                <MetricsIconContainer>
                                  {' '}
                                  <LogsIcon />
                                </MetricsIconContainer>
                                <a
                                  href={item?.logs_url}
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  {KDFM.LOGS}
                                </a>
                              </StyledLink>
                            )}
                          </>
                        </>
                      ) : (
                        <>
                          {item.status ===
                          CLUSTER_STATUS.DISCONNECTED ? null : (
                            <>
                              {item?.deactivate_cluster && (
                                <Item
                                  onClick={() => handleClick('active', item.id)}
                                >
                                  <ActiveIcon />
                                  <span>{KDFM.ACTIVATE}</span>
                                </Item>
                              )}
                              {item.delete_cluster &&
                                !item.created_by_ansible && (
                                  <Item
                                    onClick={() =>
                                      handleClick('deleteHard', item.id)
                                    }
                                  >
                                    <DeleteSmallIcon width={18} height={18} />
                                    <span> Delete</span>
                                  </Item>
                                )}
                              {item.delete_cluster &&
                                item.created_by_ansible && (
                                  <Item
                                    onClick={() =>
                                      handleHardDeleteAnsibleCluster(item)
                                    }
                                  >
                                    <DeleteSmallIcon width={18} height={18} />
                                    <span> Delete</span>
                                  </Item>
                                )}
                            </>
                          )}
                        </>
                      )}
                    </List>
                  </DropdownPortal>
                )}
              </ActionRender>
            }
          </>
        );
      },
      resize: true,
      width: '17%',
    },
  ];

  const sortFns = {
    name: data => data.sort((a, b) => a?.name?.localeCompare(b?.name)),
  };
  const handleDeleteHard = async () => {
    const response = await deleteCluster(deleteHardId);
    if (response?.status == 200) {
      toast.success(response?.data?.message);
      dispatch(
        GridActions.fetchGrid({
          module: 'clusters',
          params: {
            page: 1,
            sort: 'name',
            limit: 10,
            ...(state?.search && { search: state?.search }),
            ...(statusData !== '' && { status: statusData }),
          },
        })
      );
    } else {
      toast.error(response?.message);
    }
    dispatch(ClustersActions.setIsclusterHardDeleteModalOpen(false));
    dispatch(ClustersActions.setisAnsibleClusterDeleteFrimNiFiModalOpen(false));
    dispatch(ClustersActions.setIsclusterHardDeleteModalOpen(false));
    setUninstallNiFi(false);
  };

  const updateClusterStatus = async id => {
    const clusters = JSON.parse(localStorage.getItem('clusters')) || [];
    const response = await updateCluster(id, {
      is_active: true,
    });
    if (response) {
      const updatedClusters = clusters.filter(cluster => cluster.id !== id);
      localStorage.setItem('clusters', JSON.stringify(updatedClusters));
      toast.success('The cluster is now activated successfully.');
      dispatch(
        GridActions.fetchGrid({
          module: 'clusters',
          params: {
            page: currentPage || 1,
            sort: 'name',
            limit: itemPerClusterList || 10,
            ...(state?.search && { search: state?.search }),
            ...(statusData !== '' && { status: statusData }),
          },
        })
      );
    } else {
      toast.error('error occured');
    }
  };

  // const gridData = useSelector(state =>
  //   GridSelectors.getGridData(state, 'clusters')
  // );

  // const handleCopyClusterClick = () => {
  //   const copiedData = {
  //     ...menuState.row,
  //     id: undefined,
  //     name: getNextUniqueName(menuState?.row?.name, gridData),
  //   };
  //   dispatch(
  //     ClustersActions.setCopyClusterData({
  //       data: copiedData,
  //       originalName: menuState.row.name,
  //     })
  //   );
  //   dispatch(ClustersActions.setCopyClusterModalOpen(true));
  //   handleCloseMenu();
  // };

  const handleCopyClusterConfirm = () => {
    history.push('/clusters/add', { state: copyClusterData });
    dispatch(ClustersActions.setCopyClusterModalOpen(false));
    dispatch(ClustersActions.setCopyClusterData(null));
  };

  const handleMenuClick = (event, item) => {
    event.stopPropagation();
    setMenuState({
      isVisible: true,
      x: event.clientX,
      y: event.clientY,
      row: item,
    });
  };

  const handleClickOutside = event => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      handleCloseMenu();
    }
  };

  const handleCloseMenu = () => {
    setMenuState({ isVisible: false, x: 0, y: 0, row: null });
  };

  const deleteUserConfirmed = async id => {
    try {
      const response = await updateCluster(id, {
        is_active: false,
      });

      if (response) {
        toast.success('The cluster is now deactivated successfully.');
        dispatch(
          GridActions.fetchGrid({
            module: 'clusters',
            params: {
              page: currentPage || 1,
              sort: 'name',
              limit: itemPerClusterList || 10,
              ...(state?.search && { search: state?.search }),
              ...(statusData !== '' && { status: statusData }),
            },
          })
        );
        setState({ ...state, clusterDeleteModal: false });
        const clusterItem = localStorage.getItem('selected_cluster');
        if (clusterItem) {
          const cluster = JSON.parse(clusterItem);
          if (cluster.value === id) {
            localStorage.removeItem('selected_cluster');
            dispatch(
              NamespacesActions.setSelectedCluster({
                label: '',
                value: '',
              })
            );
            dispatch(
              GridActions.fetchGridSuccess({ module: 'namespaces', data: {} })
            );
            dispatch(DashboardActions.fetchDashboardSuccess({ data: {} }));
          }
        }
      } else {
        toast.error('Error occurred while Deactivated the cluster');
      }
    } catch (error) {
      toast.error('An error occurred during the Deactivated process');
    }
  };

  const handleClick = (type, id, item = {}) => {
    handleCloseMenu();
    if (type === 'edit') {
      history.push('/clusters/edit', { state: menuState.row });
    }
    if (type === 'view') {
      setState({
        ...state,
        nodeClusterId: menuState.row.id,
        created_by_ansible: item?.created_by_ansible,
      });
      history.push(`/clusters/${menuState.row.id}`, {
        clusterSummaryPage: true,
      });
    }

    if (type === 'active') {
      updateClusterStatus(id);
    }
    if (type === 'delete') {
      setState({ ...state, clusterDeleteModal: true });
      setDeactiveId(id);
    }
    if (type === 'deleteHard') {
      dispatch(ClustersActions.setIsclusterHardDeleteModalOpen(true));
      setDeleteHardId(id);
      setSelectedCluster({});
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    dispatch(ClustersActions.setActiveTabClusterSetup('getting_started'));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      GridActions.fetchGridSuccess({
        module: 'nodes',
        nodes: {},
      })
    );
    dispatch(ClustersActions.setRegistryNodesData({}));
    dispatch(ClustersActions.setClusterSetupSelectedNiFiVersion(null));
    return () => {
      dispatch(ClustersActions.setLastVisitedTab('cluster'));
    };
  }, [dispatch]);

  return (
    <>
      {' '}
      <AddOrEditClusterModal />
      <ModalWithIcon
        title={'Delete Cluster'}
        primaryButtonText={'Delete NiFi Cluster'}
        secondaryButtonText={KDFM.CANCEL}
        icon={<DeleteDustbinIcon />}
        isOpen={failedClusterNiFiDeleteOpen}
        onSubmit={() => handleAnsibleClusterNiFiDeleteConfirmation()}
        onRequestClose={() => {
          dispatch(ClustersActions.setIsFailedClusterDeleteModalOpen(false));
          setSelectedCluster({});
        }}
        primaryText={KDFM.HARD_DELETE_CLUSTER_WARNING}
        secondaryText={'This is will clean the hosts of failed cluster'}
      />
      <ClusterRegistryAssociationModal
        selectedCluster={selectedCluster}
        setSelectedCluster={setSelectedCluster}
      />
      <ModalWithIcon
        title={KDFM.DEACTIVATE_CLUSTER}
        primaryButtonText={KDFM.DEACTIVATE}
        secondaryButtonText={KDFM.CANCEL}
        icon={<DeleteDustbinIcon />}
        isOpen={state.clusterDeleteModal}
        onSubmit={() => deleteUserConfirmed(deactiveId)}
        onRequestClose={() => setState({ ...state, clusterDeleteModal: false })}
        primaryText={KDFM.DELETE_CLUSTER_WARNING}
      />
      <ModalWithIcon
        title={'Delete Cluster'}
        primaryButtonText={'Delete from DFM'}
        secondaryButtonText={KDFM.CANCEL}
        icon={<DeleteDustbinIcon />}
        isOpen={hardDeleteModalOpen}
        onSubmit={() => handleDeleteHard()}
        onRequestClose={() =>
          dispatch(ClustersActions.setIsclusterHardDeleteModalOpen(false))
        }
        primaryText={KDFM.HARD_DELETE_CLUSTER_WARNING}
      />
      <Modal
        isOpen={ansibleClusterNiFiDeleteOpen}
        title={'Delete Cluster'}
        secondaryButtonText="Back"
        primaryButtonText="Delete"
        primaryButtonDisabled={false}
        onSubmit={() => {
          unInstallNiFi
            ? handleAnsibleClusterNiFiDeleteConfirmation()
            : handleDeleteHard();
        }}
        onSecondarySubmit={() => {
          dispatch(
            ClustersActions.setisAnsibleClusterDeleteFrimNiFiModalOpen(false)
          );
          setSelectedCluster({});
        }}
        onRequestClose={() => {
          dispatch(
            ClustersActions.setisAnsibleClusterDeleteFrimNiFiModalOpen(false)
          );
          setSelectedCluster({});
        }}
        footerAlign="center"
      >
        <div className=" row d-flex justify-content-center">
          <div style={{ textAlign: 'center' }}>
            <DeleteDustbinIcon />
          </div>
          <PrimaryText>{KDFM.HARD_DELETE_CLUSTER_WARNING}</PrimaryText>
          <div className="d-flex justify-content-center">
            <CheckboxField
              name="check"
              label="Do you also want to uninstall NiFi and reuse hosts?"
              checked={unInstallNiFi}
              onChange={e => setUninstallNiFi(e.target.checked)}
            />
          </div>
        </div>
      </Modal>
      <ModalWithIcon
        title={'Copy Cluster'}
        primaryButtonText={'Copy'}
        secondaryButtonText={KDFM.CANCEL}
        icon={<CopyIcon width={150} height={150} />}
        isOpen={isCopyClusterModalOpen}
        onSubmit={handleCopyClusterConfirm}
        onRequestClose={() => {
          dispatch(ClustersActions.setCopyClusterModalOpen(false));
        }}
        primaryText={`Are you sure you want to copy cluster "${originalClusterName}"?`}
      />
      <Grid
        module="clusters"
        title={KDFM.CLUSTER_LIST}
        buttonText={KDFM.ADD_NEW_CLUSTER}
        columns={COLUMNS}
        statusOptions={Cluster_STATUS_OPTIONS}
        placeholder={KDFM.SEARCH_CLUSTER_NAME_URL}
        sortFns={sortFns}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sortingState={sortingState}
        setSortingState={setSortingState}
      />
      <ClusterSuccessModal />
      <ClusterProcessDisplayModal
        isProcessModalOpen={isProcessModalOpen}
        setIsProcessModalOpen={setIsProcessModalOpen}
        setSelectedCluster={setSelectedCluster}
        selectedCluster={selectedCluster}
        sortingState={sortingState}
      />
      <ClusterLoginWithOutCredModal />
    </>
  );
};
