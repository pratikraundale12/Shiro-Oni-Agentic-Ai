import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { ModalWithIcon } from '../../shared';
import { fetchGridData, deleteCluster } from '../../store';
import { REFRESH_OPTIONS, STATUS_OPTIONS, useGlobalContext } from '../../utils';

import {
  Grid,
  ProgressBarRender,
  ActionRender,
  StatusRender,
  TextRender,
  UrlRender,
  EnableClusterRender,
} from '../../components';
import {
  DeleteDustbinIcon,
  DeleteSmallIcon,
  OpenEyeIcon,
  PencilIcon,
} from '../../assets';

const List = styled.div`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
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

const getX = x => 1790 > x < 1830 && 1446;

export const ListClusters = () => {
  const [refreshState, setRefreshSelect] = useState(false);
  const [hoveredItemId, setHoveredItemId] = useState(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const { state, setState } = useGlobalContext();
  const menuRef = useRef(null);
  const [menuState, setMenuState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    row: {},
  });
  const handleMouseEnter = id => {
    setHoveredItemId(id);
  };

  const handleMouseLeave = () => {
    setHoveredItemId(null);
  };

  const COLUMNS = [
    {
      label: 'Cluster Name',
      renderCell: item => (
        <Item
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <TextRender text={item.name} />
        </Item>
      ),
      width: '18%',
    },
    {
      label: 'NiFi URL',
      renderCell: item => (
        <Item
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <UrlRender url={item.nifi_url} />
        </Item>
      ),
      width: '44%',
    },
    {
      label: 'Cluster Status',
      renderCell: item => (
        <Item
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <ProgressBarRender
            is_active={item.is_active}
            count={item.connected_nodes}
            maxCount={item.total_nodes}
          />
        </Item>
      ),
      width: '12%',
    },
    {
      label: 'Status',
      renderCell: item => (
        <Item
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          {' '}
          <StatusRender status={item.status} />
        </Item>
      ),
      width: '12%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <Item
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          <ActionRender handleMenuClick={handleMenuClick} item={item} />
        </Item>
      ),
      width: '14%',
    },
    {
      renderCell: item => (
        <Item
          onMouseEnter={() => handleMouseEnter(item.id)}
          onMouseLeave={handleMouseLeave}
        >
          {!item.is_active && (
            <EnableClusterRender hoveredItemId={hoveredItemId} item={item} />
          )}
        </Item>
      ),
      width: '14%',
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
      navigate('/cluster/edit', { state: menuState.row });
    }
    if (type === 'view') {
      setState({
        ...state,
        nodeClusterId: menuState.row.id,
      });
      navigate('/cluster/summary');
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
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        icon={<DeleteDustbinIcon />}
        isOpen={state.clusterDeleteModal}
        onSubmit={deleteUserConfirmed}
        onRequestClose={() => setState({ ...state, clusterDeleteModal: false })}
        primaryText="Are You Sure You Want to Delete This Cluster"
        secondaryText="It Will Temporary Remove the Cluster"
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
      {menuState.isVisible && (
        <List ref={menuRef} top={menuState.y} left={getX(menuState.x)}>
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
    </>
  );
};
