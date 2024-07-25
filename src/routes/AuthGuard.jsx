import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Header, Sidebar } from '../components';
import { ROUTES_MENU } from '.';
import SessionExpiredLabel from '../shared/SessionExpiredLabel';
import { getLicenseExpiresData } from '../utils/services';

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
  const [displaySessionTab, setDisplaySessionTab] = useState(false);
  const [expireData, setExpireData] = useState(null);
  const navigate = useNavigate();
  const [route, setRoute] = useState(ROUTES_MENU[0]);

  const handleRouteClick = route => {
    setRoute(route);
    navigate(`/${route.path}`);
  };
  const getLicenseData = async () => {
    const response = await getLicenseExpiresData();
    if (response.status >= 200 && response.status < 300) {
      const date = new Date(response?.data?.license);
      const istTime = date.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
      setExpireData(istTime);
    }
  };
  useEffect(() => {
    getLicenseData();
    const timer = setTimeout(() => {
      setDisplaySessionTab(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  const closeTab = () => {
    setDisplaySessionTab(false);
  };

  return (
    <Container>
      <Sidebar route={route} handleRouteClick={handleRouteClick} />
      <Content>
        <Header route={route} />
        {displaySessionTab && (
          <SessionExpiredLabel closeTab={closeTab} expireData={expireData} />
        )}
        <Outlet />
      </Content>
    </Container>
  );
};

export default AuthGuard;
