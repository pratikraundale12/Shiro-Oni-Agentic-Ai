import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isEmpty } from 'lodash';

import { Header, Sidebar } from '../components';
import { useGlobalContext } from '../utils';
import { currentUser } from '../utils/services';

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
  const {
    state: { currentUser: user, activeRoute: route },
    setState,
  } = useGlobalContext();

  async function fetchCurrentUser() {
    const pathname = window.location.pathname;
    const response = await currentUser();
    if (response.status === 200) {
      setState(prev => ({
        ...prev,
        activeRoute: pathname.slice(1, pathname.length) || 'dashboard',
        currentUser: response.data,
      }));
    } else {
      setState(prev => ({ ...prev, activeRoute: 'login', currentUser: null }));
    }
  }

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (isEmpty(user)) {
    navigate('login');
  }

  return (
    <Container>
      <Sidebar />
      <Content>
        <Header route={route} />
        <Outlet />
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
