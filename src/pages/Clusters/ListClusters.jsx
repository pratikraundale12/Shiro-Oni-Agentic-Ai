import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import { ModalWithIcon } from '../../shared';
import { fetchGridData, deleteCluster } from '../../store/index1';
import { useGlobalContext } from '../../utils';

import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  OpenEyeIcon,
  PencilIcon,
} from '../../assets';
import { REFRESH_OPTIONS, STATUS_OPTIONS } from '../../constants';
import { history } from '../../helpers/history';
import {
  ActionRender,
  Grid,
  ProgressBarRender,
  StatusRender,
  TextRender,
  UrlRender,
} from '../../components';

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
                <span>Edit</span>
              </Item>
              <Item onClick={() => handleClick('view')}>
                <OpenEyeIcon width={18} height={18} />
                <span>View</span>
              </Item>
              <Item onClick={() => handleClick('delete')}>
                <DeleteSmallIcon width={18} height={18} />
                <span>Delete</span>
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
      fetchGridData({ setState, module: 'clusters' });
      toast.success('cluster Deleted Successfully');
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

  const handleRefreshFunctionality = () => {
    fetchGridData({
      setState,
      module: 'clusters',
    });
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
        handleRefreshFunctionality,
        refreshState
      );
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [refreshState]);

  return (
    <>
      <ModalWithIcon
        title="Delete Cluster"
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={state.clusterDeleteModal}
        onSubmit={deleteUserConfirmed}
        onRequestClose={() => setState({ ...state, clusterDeleteModal: false })}
        primaryText="Are You Sure You Want to Delete This Cluster?"
        secondaryText="It Will Permanently Remove the Cluster"
      />

      <Grid
        module="clusters"
        title="Clusters List"
        buttonText="Add New Cluster"
        columns={COLUMNS}
        statusOptions={STATUS_OPTIONS}
        refreshOptions={REFRESH_OPTIONS}
        placeholder="Search Cluster Name, Status, URL"
        handleRefresh={handleRefresh}
      />
    </>
  );
};
