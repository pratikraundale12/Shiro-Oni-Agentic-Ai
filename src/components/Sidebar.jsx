import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  CollapseSidebarIconLeft,
  DfmCollapsedIcon,
  KsolvesDataFlowIcon,
} from '../assets';
// import { QuestionMarkIcon } from '../assets/Icons/QuestionMarkIcon';
// import { KDFM } from '../constants';
import { useLocation } from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { CollapseSidebarIconRight } from '../assets/Icons/CollapseSidebarIconRight';
import { history } from '../helpers/history';
import { ROUTES_MENU } from '../routes';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  LoadingSelectors,
  NamespacesActions,
} from '../store';
import { SettingsActions, SettingsSelectors } from '../store/settings';
import { theme } from '../styles';
import { Loader } from './Loader';

export const Container = styled.div`
  height: 100%;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => props.theme.colors.lighter};
  position: relative;
  width: ${props => props.theme.sidebar};
  .logo-small {
    display: none;
  }
  &.toggleSidebar {
    .sidebar-navigation {
      li {
        padding: 1rem 23px !important;
      }
    }
    .version-content {
      text-align: center;
      display: block;
    }
    @media (min-width: 992px) {
      max-width: 70px;
      .logo-large {
        display: none;
      }
      .logo-small {
        display: block;
      }
      .nav-text {
        display: none;
      }
    }
  }
  .btn-toggle {
    position: absolute;
    background: #fff !important;
    border: 1px solid #e9e0e0;
    width: 30px;
    height: 30px;
    padding: 0px;
    right: -18px;
    top: 5px;
    z-index: 7;
    &:hover {
      background: #f5f7fa !important;
    }
  }
  .btn-hamburger {
    background: #fff !important;
    border: 1px solid #e9e0e0;
    width: 30px;
    height: 30px;
    padding: 0px;
    margin-top: 5px;
    &:hover {
      background: #fff !important;
    }
  }
  @media (max-width: 992px) {
    position: fixed;
    transition: 0.3s;
    z-index: 99;
    left: -281px;
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
  padding: 1rem 32px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme, active }) =>
    active ? theme.colors.white : theme.colors.darker};
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primaryFocus : 'transparent'};
  cursor: pointer;
  // transition: all 0.3s ease-in-out;
  gap: 20px;

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

export const Sidebar = ({
  handleOpenSidebar,
  isOpenSidebar,
  toggleCollapse,
  collapsed,
}) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const route = useSelector(AuthenticationSelectors.getRoute);
  const settingsData = useSelector(SettingsSelectors.getSettings);
  const userPermissions = useSelector(AuthenticationSelectors.getPermissions);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'createSettings')
  );
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
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
    if (path === 'setting') {
      dispatch(SettingsActions.fetchSettings());
    }
    dispatch(AuthenticationActions.setRoute(path));
    history.push(`/${path}`);
    if (path === 'process-group') {
      dispatch(NamespacesActions.setSelectedNamespace({}));
    }
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
            style={{ maxWidth: '100%', padding: '6px', textAlign: 'left' }}
          />
        </StyleButton>
      );
    return (
      <StyleButton onClick={handleClick}>
        {collapsed ? (
          <DfmCollapsedIcon />
        ) : (
          <KsolvesDataFlowIcon width={200} height={LOGO_HEIGHT} />
        )}
      </StyleButton>
    );
  };

  return (
    <Container
      className={`${isOpenSidebar ? 'menuOpen' : ''} ${collapsed ? 'toggleSidebar' : ''}`}
    >
      <button
        className="btn btn-hamburger d-lg-none"
        onClick={() => handleOpenSidebar()}
      >
        <img alt="menu" src="/img/Frame.png" />
      </button>
      <button
        className="btn btn-toggle d-none d-lg-block"
        onClick={toggleCollapse}
      >
        {collapsed ? <CollapseSidebarIconRight /> : <CollapseSidebarIconLeft />}
      </button>
      {getImage()}
      <List className="sidebar-navigation">
        {ROUTES_MENU.filter(getFiltered).map(item => {
          const active = item.path === route;
          return (
            <>
              {currentUser.role === 'superadmin' ? (
                <div key={item.path}>
                  <Item
                    key={item.path}
                    active={active}
                    onClick={() => handleRoute(item.path)}
                    path={item.path}
                    data-tooltip-id={`tooltip-${item.path}`}
                  >
                    <item.icon
                      color={active ? theme.colors.white : theme.colors.darker}
                    />
                    <span className="nav-text">{item.name}</span>
                  </Item>
                  {collapsed && !isOpenSidebar && (
                    <ReactTooltip
                      id={`tooltip-${item.path}`}
                      place="right"
                      content={item.name}
                      style={{
                        whiteSpace: 'normal',
                        zIndex: 9999,
                      }}
                    />
                  )}
                </div>
              ) : item?.name !== 'Setting' ? (
                <div key={item.path}>
                  <Item
                    key={item.path}
                    active={active}
                    onClick={() => handleRoute(item.path)}
                    path={item.path}
                    data-tooltip-id={`tooltip-${item.path}`}
                  >
                    <item.icon
                      color={active ? theme.colors.white : theme.colors.darker}
                    />
                    <span className="nav-text">{item.name}</span>
                  </Item>
                  {collapsed && !isOpenSidebar && (
                    <ReactTooltip
                      id={`tooltip-${item.path}`}
                      place="right"
                      content={item.name}
                      style={{
                        whiteSpace: 'normal',
                        zIndex: 9999,
                      }}
                    />
                  )}
                </div>
              ) : null}
            </>
          );
        })}
      </List>

      <KDFMVersion>
        {/* FIX_ME: Later will come from API */}
        <span className="version-content">{`V${collapsed ? '' : 'ersion'} 2.1.22`}</span>
      </KDFMVersion>
    </Container>
  );
};

Sidebar.propTypes = {
  route: PropTypes.string,
  handleRoute: PropTypes.func,
  handleOpenSidebar: PropTypes.func,
  isOpenSidebar: PropTypes.bool,
  toggleCollapse: PropTypes.func,
  collapsed: PropTypes.bool,
};
Item.propTypes = {
  active: PropTypes.bool,
  path: PropTypes.string,
};
