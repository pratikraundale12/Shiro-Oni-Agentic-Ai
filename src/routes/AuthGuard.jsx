import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import { FullPageLoader, Header, Sidebar } from '../components';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  LoadingSelectors,
} from '../store';

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
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(AuthenticationSelectors.getIsLoggedIn);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchCurrentUser')
  );
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);

  const handleOpenSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  useEffect(() => {
    dispatch(AuthenticationActions.fetchCurrentUser());
  }, [dispatch]);

  if (loading || !isLoggedIn) {
    return <FullPageLoader loading={loading || !isLoggedIn} />;
  }

  return (
    <Container>
      <Sidebar
        handleOpenSidebar={handleOpenSidebar}
        isOpenSidebar={isOpenSidebar}
      />
      <Content>
        <Header isOpenSidebar={isOpenSidebar} />
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
