import { isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  ActiveIcon,
  DeleteDustbinIcon,
  DeleteSmallIcon,
  LogoutIcon,
  LogsIcon,
  MetricsIcon,
  OpenEyeIcon,
  PencilIcon,
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
import { ModalWithIcon } from '../../shared';
import {
  ClustersActions,
  ClustersSelectors,
  DashboardActions,
  GridActions,
  NamespacesActions,
} from '../../store';
import { deleteCluster, updateCluster } from '../../store/index1';
import { useGlobalContext } from '../../utils';
import ClusterSuccessModal from './components/ClusterSuccessModal';
import { AddOrEditClusterModal } from './components/AddOrEditClusterSetupModal';
import { SchedularActions, SchedularSelectors } from '../../store/schedular';

const List = styled.div`
  position: absolute;
  top: 25%;
  right: 100%;
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

const Item = styled.div`
  width: 8rem;
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

export const ListClusters = () => {
  const dispatch = useDispatch();
  const { state, setState } = useGlobalContext();
  const [deactiveId, setDeactiveId] = useState(null);
  const [deleteHardId, setDeleteHardId] = useState(null);
  const menuRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortingState, setSortingState] = useState('name');
  const hardDeleteModalOpen = useSelector(
    ClustersSelectors.getIsclusterHardDeleteModalOpen
  );
  const statusData = useSelector(SchedularSelectors.getStatusFilterData);
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

  useEffect(() => {
    dispatch(SchedularActions.setStatusFilterData(''));
  }, []);

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
        <ProgressBarRender
          is_active={item.is_active}
          count={item.connected_nodes}
          maxCount={item.total_nodes}
          status={item.status}
        />
      ),
      width: '15%',
      resize: true,
    },
    {
      label: KDFM.STATUS,
      renderCell: item => <StatusRender status={item.status} />,
      width: '10%',
      resize: true,
    },
    {
      label: KDFM.ACTIONS,
      renderCell: item => {
        return (
          <ActionRender handleMenuClick={handleMenuClick} item={item}>
            {menuState.isVisible && item.id === menuState.row.id && (
              <List ref={menuRef}>
                {item.is_active ? (
                  <>
                    {item.edit_cluster && !item?.created_by_ansible && (
                      <Item onClick={() => handleClick('edit')}>
                        <PencilIcon width={16} height={16} />
                        <span>{KDFM.EDIT}</span>
                      </Item>
                    )}

                    {item.edit_cluster && (
                      <Item onClick={() => handleClick('view', item?.id, item)}>
                        <OpenEyeIcon width={18} height={18} />
                        <span>{KDFM.VIEW}</span>
                      </Item>
                    )}
                    <>
                      {item.deactivate_cluster && (
                        <Item onClick={() => handleClick('delete', item.id)}>
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
                    {item.status === CLUSTER_STATUS.DISCONNECTED ? null : (
                      <>
                        {item?.deactivate_cluster && (
                          <Item onClick={() => handleClick('active', item.id)}>
                            <ActiveIcon />
                            <span>{KDFM.ACTIVATE}</span>
                          </Item>
                        )}
                        {item.delete_cluster && (
                          <Item
                            onClick={() => handleClick('deleteHard', item.id)}
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
            )}
          </ActionRender>
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
            page: 1,
            sort: 'name',
            limit: 10,
            ...(state?.search && { search: state?.search }),
            ...(statusData !== '' && { status: statusData }),
          },
        })
      );
    } else {
      toast.error('error occured');
    }
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
              page: 1,
              sort: 'name',
              limit: 10,
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
  }, [dispatch]);
  return (
    <>
      {' '}
      <AddOrEditClusterModal />
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
        primaryButtonText={'Delete'}
        secondaryButtonText={KDFM.CANCEL}
        icon={<DeleteDustbinIcon />}
        isOpen={hardDeleteModalOpen}
        onSubmit={() => handleDeleteHard()}
        onRequestClose={() =>
          dispatch(ClustersActions.setIsclusterHardDeleteModalOpen(false))
        }
        primaryText={KDFM.HARD_DELETE_CLUSTER_WARNING}
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
      />
      <ClusterSuccessModal />
    </>
  );
};
