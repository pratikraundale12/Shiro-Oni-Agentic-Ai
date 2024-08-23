import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { KsolvesDataFlowIcon } from '../assets';
import { QuestionMarkIcon } from '../assets/Icons/QuestionMarkIcon';
import { KDFM } from '../constants';
import { history } from '../helpers/history';
import { ROUTES_MENU } from '../routes';
import { AuthenticationActions, AuthenticationSelectors } from '../store';
import { theme } from '../styles';

const Container = styled.div`
  height: 100%;
  min-width: ${props => props.theme.sidebar};
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.theme.colors.lighter};
  button {
    background-color: transparent;
    border: none;
    padding: 0 10px;
    display: none;
    top: 22px;
  }
  left: -250px;
  @media (max-width: 992px) {
    position: fixed;
    transition: 0.3s;
    z-index: 99;
    &.menuOpen {
      left: 0px;
    }
    button {
      display: block;
      position: absolute;
      margin-left: calc(100% + 55px);
    }
  }
`;

const List = styled.ul`
  width: 100%;
  margin-top: 20px;
  padding-left: 0;
  overflow-y: auto;
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

const HelpSupportConatiner = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: auto;
  width: 100%;
`;

const KDFMVersion = styled.div`
  color: ${props => props.theme.colors.darker};
  font-size: 14px;
  font-weight: 500;
`;

export const Sidebar = ({ handleOpenSidebar, isOpenSidebar }) => {
  const dispatch = useDispatch();
  const route = useSelector(AuthenticationSelectors.getRoute);
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);

  const handleRoute = path => {
    dispatch(AuthenticationActions.setRoute(path));
    history.push(`/${path}`);
  };

  const getFiltered = item => {
    if (item.path === 'dashboard') return true;
    return !item.hidden && userPermissions.includes(item.permission);
  };

  return (
    <Container className={isOpenSidebar && 'menuOpen'}>
      <button onClick={() => handleOpenSidebar()}>
        <img alt="menu" src="/img/Frame.png" />
      </button>
      <KsolvesDataFlowIcon width={200} height={80} />
      <List>
        {ROUTES_MENU.filter(item => !item.hidden && !item.isSideBarHidden).map(
          item => {
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
          }
        )}
      </List>

      <HelpSupportConatiner>
        <Item active={false}>
          <QuestionMarkIcon />
          <span>{KDFM.HELP_AND_SUPPORT}</span>
        </Item>
      </HelpSupportConatiner>
      <KDFMVersion>
        {/* FIX_ME: Later will come from API */}
        <span>Version 1.0.0</span>
      </KDFMVersion>
    </Container>
  );
};

Sidebar.propTypes = {
  route: PropTypes.string,
  handleRoute: PropTypes.func,
  handleOpenSidebar: PropTypes.func,
  isOpenSidebar: PropTypes.bool,
};
