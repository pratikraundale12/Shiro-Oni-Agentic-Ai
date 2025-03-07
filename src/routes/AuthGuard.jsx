import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { FullPageLoader, Header, Sidebar } from '../components';
import { TermsOfUse } from '../pages/PolicyAndTermsOfUse/TermsOfUse';
import { CheckboxField, Modal } from '../shared';
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
  width: calc(100% - 282px);
  height: 100%;
  position: relative;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  background-color: ${props => props.theme.colors.white};
  flex-grow: 1;
  @media (max-width: 992px) {
    width: 100%;
  }
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
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'fetchCurrentUser')
  );

  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(
    currentUser.has_accepted_terms || false
  );
  const hasTermsAndPoliciesAccepted = useSelector(
    AuthenticationSelectors.getHasTermsAndPoliciesAccepted
  );

  const handleOpenSidebar = () => {
    setIsOpenSidebar(!isOpenSidebar);
  };

  useEffect(() => {
    if (window.location.pathname === '/') {
      window.location.pathname = '/login';
    } else {
      dispatch(AuthenticationActions.fetchCurrentUser());
    }
  }, [dispatch]);

  if (loading || !isLoggedIn) {
    return <FullPageLoader loading={loading || !isLoggedIn} />;
  }

  const handleAcceptTerms = e => {
    setHasAcceptedTerms(e.target.checked);
  };

  const toggleCollapse = () => {
    setCollapsed(prevState => !prevState);
  };

  return (
    <Container>
      <Sidebar
        handleOpenSidebar={handleOpenSidebar}
        isOpenSidebar={isOpenSidebar}
        toggleCollapse={toggleCollapse}
        collapsed={collapsed}
      />
      <Content className={collapsed && 'toggleMain'}>
        <Header isOpenSidebar={isOpenSidebar} />
        <Wrapper>
          <Outlet />
        </Wrapper>
      </Content>

      <Modal
        size="lg"
        title="Terms of Use"
        isOpen={!hasTermsAndPoliciesAccepted}
        primaryButtonText="Accept"
        onSubmit={() => {
          const payload = new FormData();
          payload.append('has_accepted_terms', true);
          dispatch(AuthenticationActions.updateTermsAndPolicies(payload));
        }}
        footerAlign="start"
        contentStyles={{ minWidth: '65%' }}
        primaryButtonDisabled={!hasAcceptedTerms}
        closeIcon={false}
      >
        <>
          <TermsOfUse />
          <CheckboxField
            name="has_accepted_terms"
            label="I agree to the Terms and Conditions"
            defaultChecked={false}
            onChange={handleAcceptTerms}
          />
        </>
      </Modal>
    </Container>
  );
};

AuthGuard.propTypes = {
  state: PropTypes.shape({
    currentUser: PropTypes.shape({}),
  }),
};

export default AuthGuard;
