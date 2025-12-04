import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { DfmCollapsedIcon, KsolvesDataFlowIcon, LoginIcon } from '../assets';
import { CollapseSidebarIconLeft } from '../assets/Icons/CollapseSidebarIconLeft';
import { CollapseSidebarIconRight } from '../assets/Icons/CollapseSidebarIconRight';
import { PolicyIcon } from '../assets/Icons/PolicyIcon';
import { Container, Header, Item, KDFMVersion, List } from '../components';
import { history } from '../helpers/history';
import { PrivacyPolicy } from '../pages/PolicyAndTermsOfUse/PrivacyPolicy';
import { TermsOfUse } from '../pages/PolicyAndTermsOfUse/TermsOfUse';
import { SettingsSelectors } from '../store/settings';
import { theme } from '../styles';

const MainContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: ${props => props.theme.colors.lighter};
`;

const Content = styled.main`
  width: 100%;
  height: 100%;
  position: relative;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  background-color: ${props => props.theme.colors.white};
`;

const Wrapper = styled.div`
  height: calc(100% - ${props => props.theme.header});
  width: 100%;
  padding: 24px;
  overflow-y: auto;
`;

export const UNAUTHROUTES_MENU = [
  {
    name: 'Privacy Policy',
    path: '/policy/privacy-policy',
    icon: PolicyIcon,
    pages: [
      {
        path: '',
        component: <PrivacyPolicy />,
      },
    ],
  },
  {
    name: 'Terms of use',
    path: '/policy/terms-of-use',
    icon: PolicyIcon,
    pages: [
      {
        path: '',
        component: <TermsOfUse />,
      },
    ],
  },
];

const LoginButton = styled.li`
  padding: 1rem 32px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 600;
  gap: 20px;
`;

const UnAuthGuard = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [isToggleSidebar, setToggleSidebar] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const handleOpenSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };
  const handleToggleSidebar = () => {
    setToggleSidebar(!isToggleSidebar);
  };

  const settingsData = useSelector(SettingsSelectors.getSettings);
  const getImage = () => {
    if (settingsData?.logo)
      return (
        <img
          src={settingsData?.logo}
          alt="Logo"
          width={200}
          height={80}
          style={{ maxWidth: '100%', padding: '6px', textAlign: 'left' }}
        />
      );
    return (
      <>
        {isToggleSidebar ? (
          <DfmCollapsedIcon />
        ) : (
          <KsolvesDataFlowIcon width={200} height={80} />
        )}
      </>
    );
  };

  const handleRoute = path => {
    history.push(`${path}`);
  };

  return (
    <MainContainer>
      <Container
        className={`${isOpenSidebar ? 'menuOpen' : ''} ${isToggleSidebar ? 'toggleSidebar' : ''}`}
      >
        <button
          className="btn btn-hamburger d-lg-none"
          onClick={() => handleOpenSidebar()}
        >
          <img alt="menu" src="/img/Frame.png" />
        </button>
        <button
          className="btn btn-toggle d-none d-lg-block"
          onClick={() => handleToggleSidebar()}
        >
          {isToggleSidebar ? (
            <CollapseSidebarIconRight />
          ) : (
            <CollapseSidebarIconLeft />
          )}
        </button>
        {getImage()}
        <List className="sidebar-navigation">
          {UNAUTHROUTES_MENU.map(item => {
            const active = item.path === currentPath;
            return (
              <Item
                key={item.path}
                active={active}
                onClick={() => handleRoute(item.path)}
              >
                <item.icon
                  color={active ? theme.colors.white : theme.colors.darker}
                />
                <span className="nav-text">{item.name}</span>
              </Item>
            );
          })}
          <LoginButton
            className="loginAccountText"
            onClick={() => history.push('/login')}
          >
            <LoginIcon color={'#444445'} />
            <span className="nav-text">Login Account</span>
          </LoginButton>
        </List>
        <KDFMVersion>
          {/* FIX_ME: Later will come from API */}
          <span className="version-content">Version 3.0.1</span>
        </KDFMVersion>
      </Container>
      <Content>
        <Header isOpenSidebar={isOpenSidebar} currentRoute={currentPath} />
        <Wrapper>
          <Outlet />
        </Wrapper>
      </Content>
    </MainContainer>
  );
};

UnAuthGuard.propTypes = {
  state: PropTypes.shape({
    currentUser: PropTypes.shape({}),
  }),
};

export default UnAuthGuard;
