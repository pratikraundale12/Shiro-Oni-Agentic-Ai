import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { KsolvesDataFlowIcon } from '../assets';
// import { QuestionMarkIcon } from '../assets/Icons/QuestionMarkIcon';
// import { KDFM } from '../constants';
import { useLocation } from 'react-router-dom';
import { history } from '../helpers/history';
import { ROUTES_MENU } from '../routes';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  LoadingSelectors,
} from '../store';
import { SettingsSelectors } from '../store/settings';
import { theme } from '../styles';
import { Loader } from './Loader';

export const Container = styled.div`
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
  left: -281px;
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

export const List = styled.ul`
  max-height: calc(100vh - 250px);
  width: 100%;
  margin-top: 20px;
  padding-left: 0;
  overflow-y: auto;
`;

export const Item = styled.li`
  position: relative;
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

  ${props =>
    props.path === 'help-&-support' &&
    `
      position: absolute;
      bottom: 50px;
      width: 100%;
    `}

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
  @media screen and (max-width: 1400px) {
    font-size: 14px !important;
  }
`;

export const KDFMVersion = styled.div`
  color: ${props => props.theme.colors.darker};
  font-size: 14px;
  font-weight: 500;
  margin-top: auto;
  @media screen and (max-width: 1400px) {
    font-size: 12px !important;
  }
`;

const StyleButton = styled.div`
  cursor: pointer;
`;

const LOGO_HEIGHT = 80;

export const Sidebar = ({ handleOpenSidebar, isOpenSidebar }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const route = useSelector(AuthenticationSelectors.getRoute);
  const settingsData = useSelector(SettingsSelectors.getSettings);
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'createSettings')
  );

  const getFiltered = item => {
    if (item.path === 'dashboard') return true;
    if (item.path === 'help-&-support') return true;

    return (
      !item.hidden &&
      !item.isSideBarHidden &&
      userPermissions.includes(item.permission)
    );
  };

  useEffect(() => {
    if (!route || !pathname) return;
    function extractFirstPart(path) {
      const parts = path.split('/');
      return parts[1] || '';
    }
    if (pathname !== route) {
      dispatch(AuthenticationActions.setRoute(extractFirstPart(pathname)));
    }
  }, [pathname, dispatch, route]);

  const handleRoute = path => {
    dispatch(AuthenticationActions.setRoute(path));
    history.push(`/${path}`);
  };

  const getImage = () => {
    const handleClick = () => {
      history.push('/dashboard');
    };
    if (loading)
      return (
        <div style={{ height: LOGO_HEIGHT }}>
          <Loader />
        </div>
      );
    if (settingsData?.logo)
      return (
        <StyleButton onClick={handleClick}>
          <img
            src={settingsData?.logo}
            alt="Logo"
            width={200}
            height={LOGO_HEIGHT}
          />
        </StyleButton>
      );
    return (
      <StyleButton onClick={handleClick}>
        <KsolvesDataFlowIcon width={200} height={LOGO_HEIGHT} />
      </StyleButton>
    );
  };

  return (
    <Container className={isOpenSidebar && 'menuOpen'}>
      <button onClick={() => handleOpenSidebar()}>
        <img alt="menu" src="/img/Frame.png" />
      </button>
      {getImage()}
      <List>
        {ROUTES_MENU.filter(getFiltered).map(item => {
          const active = item.path === route;
          return (
            <Item
              key={item.path}
              active={active}
              onClick={() => handleRoute(item.path)}
              path={item.path}
            >
              <item.icon
                color={active ? theme.colors.white : theme.colors.darker}
              />
              <span>{item.name}</span>
            </Item>
          );
        })}
      </List>

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
