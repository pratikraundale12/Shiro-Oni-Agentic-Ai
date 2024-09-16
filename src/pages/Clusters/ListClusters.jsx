import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
  ActiveIcon,
  DeleteDustbinIcon,
  DeleteSmallIcon,
  OpenEyeIcon,
  PencilIcon,
} from '../../assets';
import {
  ActionRender,
  Grid,
  ProgressBarRender,
  StatusRender,
  TextRender,
  UrlRender,
} from '../../components';
import {
  // CLUSTERS_TOKEN,
  // CLUSTERS_TOKEN,
  CLUSTER_STATUS,
  Cluster_STATUS_OPTIONS,
  KDFM,
} from '../../constants';
import { history } from '../../helpers/history';
import { ModalWithIcon } from '../../shared';
import { GridActions } from '../../store';
import { updateCluster } from '../../store/index1';
import { useGlobalContext } from '../../utils';
import ClusterSuccessModal from './components/ClusterSuccessModal';

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
  // border: 1px solid ${props => props.theme.colors.border};

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

const StyledTag = styled.div`
  background-color: rgb(218, 216, 216);
  display: flex;
  padding: 1px 6px;
  border-radius: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 70px;
`;
const StyledTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex-wrap: nowrap;
  overflow: auto;
  width: 100%;
`;

export const ListClusters = () => {
  const dispatch = useDispatch();
  const { state, setState } = useGlobalContext();
  const [deactiveId, setDeactiveId] = useState(null);
  const menuRef = useRef(null);
  const [menuState, setMenuState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    row: {},
  });

  const COLUMNS = [
    {
      label: KDFM.CLUSTER_NAME,
      renderCell: item => (
        <TextRender text={item.name} capitalizeText={false} />
      ),
      width: '15%',
      sort: { sortKey: 'name' },
    },
    {
      label: KDFM.NIFI_URL,
      renderCell: item => {
        const updatedUrl = item.nifi_url.endsWith('/nifi')
          ? item.nifi_url
          : `${item.nifi_url}/nifi`;

        return <UrlRender url={updatedUrl} />;
      },
      width: '35%',
    },
    {
      label: KDFM.TAG,
      renderCell: item =>
        item?.tag ? (
          <StyledTagContainer>
            {item.tag.split(',').map((tag, index) => (
              <StyledTag key={index}>
                <TextRender text={tag.trim()} capitalizeText={false} />
              </StyledTag>
            ))}
          </StyledTagContainer>
        ) : null,
      width: '20%',
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
    },
    {
      label: KDFM.STATUS,
      renderCell: item => <StatusRender status={item.status} />,
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
                    {item.edit_cluster && (
                      <Item onClick={() => handleClick('edit')}>
                        <PencilIcon width={16} height={16} />
                        <span>{KDFM.EDIT}</span>
                      </Item>
                    )}

                    <>
                      {item.status !== CLUSTER_STATUS.DISCONNECTED && (
                        <Item onClick={() => handleClick('view')}>
                          <OpenEyeIcon width={18} height={18} />
                          <span>{KDFM.VIEW}</span>
                        </Item>
                      )}
                      {item.delete_cluster && (
                        <Item onClick={() => handleClick('delete', item.id)}>
                          <DeleteSmallIcon width={18} height={18} />
                          <span>{KDFM.DEACTIVATE}</span>
                        </Item>
                      )}
                    </>
                  </>
                ) : (
                  <>
                    {item.status === CLUSTER_STATUS.DISCONNECTED ? null : (
                      <Item onClick={() => handleClick('active', item.id)}>
                        <ActiveIcon />
                        <span>{KDFM.ACTIVATE}</span>
                      </Item>
                    )}
                  </>
                )}
              </List>
            )}
          </ActionRender>
        );
      },
    },
  ];

  const sortFns = {
    name: data => data.sort((a, b) => a.name.localeCompare(b.name)),
  };

  const updateClusterStatus = async id => {
    const response = await updateCluster(id, {
      is_active: true,
    });
    if (response) {
      toast.success('Cluster Activated Successfully');
      dispatch(GridActions.fetchGrid({ module: 'clusters' }));
    } else {
      toast.error('error occured');
    }
  };

  const handleMenuClick = (event, item) => {
    event.stopPropagation(); // Prevent triggering row click if any
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
        toast.success('Cluster Deactivated Successfully');
        dispatch(GridActions.fetchGrid({ module: 'clusters' }));
        setState({ ...state, clusterDeleteModal: false });
      } else {
        toast.error('Error occurred while Deactivated the cluster');
      }
    } catch (error) {
      toast.error('An error occurred during the Deactivated process');
    }
  };

  const handleClick = (type, id) => {
    handleCloseMenu();
    if (type === 'edit') {
      history.push('/clusters/edit', { state: menuState.row });
    }
    if (type === 'view') {
      setState({
        ...state,
        nodeClusterId: menuState.row.id,
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
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ModalWithIcon
        title={KDFM.DEACTIVATE_CLUSTER}
        primaryButtonText={KDFM.DEACTIVATE}
        secondaryButtonText={KDFM.CANCEL}
        icon={<DeleteDustbinIcon />}
        isOpen={state.clusterDeleteModal}
        onSubmit={() => deleteUserConfirmed(deactiveId)}
        onRequestClose={() => setState({ ...state, clusterDeleteModal: false })}
        primaryText={KDFM.DELETE_CLUSTER_WARNING}
        secondaryText={KDFM.DELETE_CLUSTER_DESCRIPTION}
      />
      <Grid
        module="clusters"
        title={KDFM.CLUSTER_LIST}
        buttonText={KDFM.ADD_NEW_CLUSTER}
        columns={COLUMNS}
        statusOptions={Cluster_STATUS_OPTIONS}
        placeholder={KDFM.SEARCH_CLUSTER_NAME_URL}
        sortFns={sortFns}
      />
      <ClusterSuccessModal />
    </>
  );
};
