import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import {
  Grid,
  ProgressBarRender,
  ActionRender,
  StatusRender,
  TextRender,
  UrlRender,
} from '../../components';
import { REFRESH_OPTIONS, STATUS_OPTIONS } from '../../utils';
import { DeleteSmallIcon, OpenEyeIcon, PencilIcon } from '../../assets';

const Container = styled.div`
  padding: 1.4rem;
  width: 100%;
  height: 100%;
`;

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
  padding: 8px;
  font-family: ${props => props.theme.fontNato};
  font-size: ${props => props.theme.size.md};
  color: ${props => props.theme.colors.darker};
  border: 1px solid ${props => props.theme.colors.border};

  &:hover {
    background-color: ${props => props.theme.colors.lightGrey};
  }
`;

const EyeIcon = styled(OpenEyeIcon)`
  margin: 0 6px 0 5px;
`;

const getX = x => 1790 > x < 1830 && 1446;

export const ListClusters = () => {
  const menuRef = useRef(null);
  const [menuState, setMenuState] = useState({
    isVisible: false,
    x: 0,
    y: 0,
    row: null,
  });
  const COLUMNS = [
    {
      label: 'Name',
      renderCell: item => <TextRender text={item.name} />,
      sort: { sortKey: 'NAME' },
      width: '20%',
    },
    {
      label: 'NiFi Url',
      renderCell: item => <UrlRender url={item.nifi_url} />,
    },
    {
      label: 'Cluster Status',
      renderCell: () => <ProgressBarRender count={1} maxCount={5} />,
      width: '20%',
    },
    {
      label: 'Status',
      renderCell: item => <StatusRender status={item.status} />,
      width: '10%',
    },
    {
      label: 'Actions',
      renderCell: item => (
        <ActionRender handleMenuClick={handleMenuClick} item={item} />
      ),
      width: '10%',
    },
  ];

  const SORT_FNS = {
    NAME: array => array.sort((a, b) => a.name.localeCompare(b.name)),
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
    console.log(type);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Container>
      <Grid
        module="clusters"
        title="Clusters List"
        buttonText="Add New Cluster"
        columns={COLUMNS}
        sortFns={SORT_FNS}
        statusOptions={STATUS_OPTIONS}
        refreshOptions={REFRESH_OPTIONS}
      />
      {menuState.isVisible && (
        <List ref={menuRef} top={menuState.y} left={getX(menuState.x)}>
          <Item onClick={() => handleClick('edit')}>
            <PencilIcon /> Edit
          </Item>
          <Item onClick={() => handleClick('view')}>
            <EyeIcon width={22} height={22} /> View
          </Item>
          <Item onClick={() => handleClick('delete')}>
            <DeleteSmallIcon /> Delete
          </Item>
        </List>
      )}
    </Container>
  );
};
