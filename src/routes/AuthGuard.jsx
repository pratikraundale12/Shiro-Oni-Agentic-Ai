import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Header, Sidebar } from '../components';
import { ROUTES_MENU } from '.';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: ${props => props.theme.colors.lighter};
`;

const Content = styled.main`
  width: 100%;
  overflow: hidden;
  position: relative;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  background-color: ${props => props.theme.colors.white};
`;

const AuthGuard = () => {
  const navigate = useNavigate();
  const [route, setRoute] = useState(ROUTES_MENU[0]);

  const handleRouteClick = route => {
    setRoute(route);
    navigate(`/${route.path}`);
  };

  return (
    <Container>
      <Sidebar route={route} handleRouteClick={handleRouteClick} />
      <Content>
        <Header route={route} />
        <Outlet />
      </Content>
    </Container>
  );
};

export default AuthGuard;
