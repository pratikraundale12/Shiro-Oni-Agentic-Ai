import React from 'react';

import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { ROUTES_MENU } from '../routes';
import { KsolvesIcon } from '../assets';

const MenuItem = styled(Link)`
  display: block;
  padding: 10px;
  border-radius: 4px;
  color: ${props =>
    props.active ? props.theme.colors.white : props.theme.colors.darkGrey};
  background: ${props =>
    props.active ? props.theme.colors.primary : 'transparent'};
`;

const Logo = styled.div`
  padding: 1rem;
  margin-bottom: 2rem;
`;

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div>
      <Logo>
        <KsolvesIcon />
      </Logo>
      {ROUTES_MENU.map(item => (
        <MenuItem
          key={item.path}
          to={item.path}
          active={+location.pathname.includes(item.path)}
        >
          {item.name}
        </MenuItem>
      ))}
    </div>
  );
};
