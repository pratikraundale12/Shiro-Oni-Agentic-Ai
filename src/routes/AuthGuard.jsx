import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isEmpty } from 'lodash';

import { Header, Sidebar } from '../components';
import { useGlobalContext } from '../utils';
import { currentUser } from '../store';

const Container = styled.div`
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

const AuthGuard = () => {
  const navigate = useNavigate();
  const {
    state: { currentUser: user, activeRoute: route },
    setState,
  } = useGlobalContext();

  async function fetchCurrentUser() {
    let pathname = window.location.pathname;
    pathname = pathname.split('/')[1];
    const response = await currentUser();
    if (response.status === 200) {
      const date = new Date(response?.data?.license);
      const istTime = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
      setState(prev => ({
        ...prev,
        activeRoute: pathname || 'dashboard',
        currentUser: response.data,
        licenseTimeStamp: istTime,
      }));
    } else {
      setState(prev => ({ ...prev, activeRoute: 'login', currentUser: null }));
    }
  }

  useEffect(() => {
    fetchCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isEmpty(user)) {
    navigate('login');
  }

  return (
    <Container>
      <Sidebar />
      <Content>
        <Header route={route} />
        <Wrapper>
          <Outlet />
        </Wrapper>
      </Content>
    </Container>
  );
};

AuthGuard.propTypes = {
  state: PropTypes.shape({
    currentUser: PropTypes.shape({}),
  }),
};

export default AuthGuard;
