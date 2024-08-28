/*eslint-disable*/
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { Container, Header, Item, KDFMVersion, List, } from '../components';
import { useSelector } from 'react-redux';
import { PrivacyPolicy } from '../pages/PolicyAndTermsOfUse/PrivacyPolicy';
import {  KsolvesDataFlowIcon, LoginIcon } from '../assets';
import { TermsOfUse } from '../pages/PolicyAndTermsOfUse/TermsOfUse';
import { SettingsSelectors } from '../store/settings';
import { useLocation } from 'react-router-dom';
import { theme } from '../styles';
import { history } from '../helpers/history';
import { PolicyIcon } from '../assets/Icons/PolicyIcon';

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

const LoginButton = styled.div`
    margin-top: auto;
    margin-bottom: 20px;
    cursor: pointer;
    font-weight: 600;
`

const UnAuthGuard = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const handleOpenSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  const settingsData = useSelector(SettingsSelectors.getSettings);
  const getImage = () => {
    if (settingsData?.logo)
      return (
        <img src={settingsData?.logo} alt="Logo" width={200} height={80} />
      );
    return <KsolvesDataFlowIcon width={200} height={80} />;
  };

  const handleRoute = path => {
    history.push(`${path}`);
  };

  return (
    <MainContainer>
      <Container className={isOpenSidebar && 'menuOpen'}>
        <button onClick={() => handleOpenSidebar()}>
          <img alt="menu" src="/img/Frame.png" />
        </button>
        {getImage()}
        <List>
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
                <span>{item.name}</span>
              </Item>
            );
          })}
        </List>
        <LoginButton onClick={() => history.push('/login')}>
          <LoginIcon color={"#444445"} />
          <span style={{
            marginLeft: "10px",
          }}>Login Account</span>
        </LoginButton>
        <KDFMVersion>
          {/* FIX_ME: Later will come from API */}
          <span>Version 1.0.0</span>
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
