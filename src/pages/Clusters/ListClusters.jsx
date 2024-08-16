import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import {
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
import { KDFM, REFRESH_OPTIONS, STATUS_OPTIONS } from '../../constants';
import { history } from '../../helpers/history';
import { ModalWithIcon } from '../../shared';
import { GridActions } from '../../store';
import { deleteCluster } from '../../store/index1';
import { useGlobalContext } from '../../utils';

const List = styled.div`
  position: absolute;
  top: 25%;
  left: 40px;
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
  width: 120px;
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
`;

export const ListClusters = () => {
  const dispatch = useDispatch();
  const [refreshState, setRefreshSelect] = useState(false);
  const intervalRef = useRef(null);
  const { state, setState } = useGlobalContext();
  const menuRef = useRef(null);
  const [menuState, setMenuState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    row: {},
  });

  const COLUMNS = [
    {
      label: 'Cluster Name',
      renderCell: item => <TextRender text={item.name} />,
      width: '18%',
    },
    {
      label: 'NiFi URL',
      renderCell: item => <UrlRender url={item.nifi_url} />,
      width: 'auto',
    },
    {
      label: 'Cluster Status',
      renderCell: item => (
        <ProgressBarRender
          is_active={item.is_active}
          count={item.connected_nodes}
          maxCount={item.total_nodes}
        />
      ),
      width: 'auto',
    },
    {
      label: 'Status',
      renderCell: item => <StatusRender status={item.status} />,
      width: 'auto',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <ActionRender handleMenuClick={handleMenuClick} item={item}>
          {menuState.isVisible && item.id == menuState.row.id && (
            <List ref={menuRef}>
              <Item onClick={() => handleClick('edit')}>
                <PencilIcon width={16} height={16} />
                <span>{KDFM.EDIT}</span>
              </Item>
              <Item onClick={() => handleClick('view')}>
                <OpenEyeIcon width={18} height={18} />
                <span>{KDFM.VIEW}</span>
              </Item>
              <Item onClick={() => handleClick('delete')}>
                <DeleteSmallIcon width={18} height={18} />
                <span>{KDFM.DELETE}</span>
              </Item>
            </List>
          )}
        </ActionRender>
      ),
      width: 'auto',
    },
  ];
  const deleteUserConfirmed = async () => {
    const response = await deleteCluster(state.selectedItem.id);
    if (response.status == 204) {
      dispatch(GridActions.fetchGrid({ module: 'clusters' }));
      toast.success('Cluster Deleted Successfully');
      setState({ ...state, clusterDeleteModal: false });
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

  const handleClick = type => {
    handleCloseMenu();
    if (type === 'edit') {
      history.push('/clusters/edit', { state: menuState.row });
    }
    if (type === 'view') {
      setState({
        ...state,
        nodeClusterId: menuState.row.id,
      });
      history.push('/clusters/summary');
    }
    if (type === 'delete') {
      setState({
        ...state,
        clusterDeleteModal: true,
        selectedItem: menuState.row,
      });
    }
  };

  const handleRefresh = event => {
    setRefreshSelect(event.value);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (refreshState !== false) {
      intervalRef.current = setInterval(
        () => dispatch(GridActions.fetchGrid({ module: 'clusters' })),
        refreshState
      );
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [dispatch, refreshState]);

  return (
    <>
      <ModalWithIcon
        title={KDFM.DELETE_CLUSTER}
        primaryButtonText={KDFM.DELETE}
        secondaryButtonText={KDFM.CANCEL}
        icon={<DeleteDustbinIcon />}
        isOpen={state.clusterDeleteModal}
        onSubmit={deleteUserConfirmed}
        onRequestClose={() => setState({ ...state, clusterDeleteModal: false })}
        primaryText={KDFM.DELETE_CLUSTER_WARNING}
        secondaryText={KDFM.DELETE_CLUSTER_DESCRIPTION}
      />
      <Grid
        module="clusters"
        title={KDFM.CLUSTER_LIST}
        buttonText={KDFM.ADD_NEW_CLUSTER}
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        refreshOptions={REFRESH_OPTIONS}
        placeholder={KDFM.SEARCH_CLUSTER_NAME_URL}
        handleRefresh={handleRefresh}
      />
    </>
  );
};
