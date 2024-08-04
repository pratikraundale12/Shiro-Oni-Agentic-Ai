import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { theme } from '../styles';
import { ROUTES_MENU } from '../routes';
import { KsolvesIcon } from '../assets';
import { useGlobalContext } from '../utils';

const Container = styled.div`
  height: 100%;
  min-width: 240px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  background-color: ${props => props.theme.colors.lighter};
`;

const List = styled.ul`
  width: 100%;
  margin-top: 20px;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  padding: 20px 32px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme, active }) =>
    active ? theme.colors.white : theme.colors.darker};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primaryFocus : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    width: 6px;
    height: 40px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: ${({ theme, active }) =>
      active ? theme.colors.white : 'transparent'};
  }

  > svg {
    margin-right: 20px;
  }
`;

export const Sidebar = () => {
  const navigate = useNavigate();
  const {
    state: { activeRoute: route },
    setState,
  } = useGlobalContext();

  const handleRoute = path => {
    setState(prev => ({ ...prev, activeRoute: path }));
    navigate(path);
  };

  return (
    <Container>
      <KsolvesIcon />
      <List>
        {ROUTES_MENU.map(item => {
          const active = item.path === route;
          return (
            <Item
              key={item.path}
              active={active}
              onClick={() => handleRoute(item.path)}
            >
              <item.icon
                color={active ? theme.colors.white : theme.colors.darker}
              />
              <span>{item.name}</span>
            </Item>
          );
        })}
      </List>
    </Container>
  );
};

Sidebar.propTypes = {
  route: PropTypes.string,
  handleRoute: PropTypes.func,
};
