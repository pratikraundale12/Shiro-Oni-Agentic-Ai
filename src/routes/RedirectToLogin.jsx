import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { history } from '../helpers/history';
import { AuthenticationActions } from '../store';
import { theme } from '../styles';

const ErrorContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
`;

const ErrorTitle = styled.h2`
  color: ${theme.colors.primary};
  margin-bottom: 10px;
`;

const ErrorText = styled.p`
  margin: 5px 0;
`;

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  border: none;
  background-color: ${theme.colors.primary};
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
`;

const RedirectToLogin = () => {
  const dispatch = useDispatch();
  return (
    <ErrorContainer>
      <ErrorTitle>Something went wrong!</ErrorTitle>
      <ErrorText>We encountered an issue loading the page.</ErrorText>
      <div>
        <Button
          onClick={() => {
            history.push('/login');
            dispatch(AuthenticationActions.fetchSettingLogo());
          }}
        >
          Login
        </Button>
      </div>
    </ErrorContainer>
  );
};

export default RedirectToLogin;
