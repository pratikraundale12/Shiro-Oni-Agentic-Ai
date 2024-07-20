import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ROUTES_MENU } from '../routes';
import { theme } from '../styles';
import { KsolvesIcon } from '../assets';

const Container = styled.div`
  height: 100%;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.theme.colors.lighter};
`;

const List = styled.ul`
  width: max-content;
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

export const Sidebar = ({ route = {}, handleRouteClick }) => {
  const activeRoute = ROUTES_MENU.find(r => r.path === route.path);
  return (
    <Container>
      <KsolvesIcon />
      <List>
        {ROUTES_MENU.map(item => {
          const active = item.path === activeRoute.path;
          return (
            <Item
              key={item.path}
              active={active}
              onClick={() => handleRouteClick(item)}
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
  route: PropTypes.object,
  handleRouteClick: PropTypes.func,
};
