import React from 'react';
import styled from 'styled-components';
import { AuthenticationActions, ClustersActions } from '../../store';
import { useDispatch } from 'react-redux';

const LoginButtonWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-start;
`;

const StyledButton = styled.button`
  background-color: #ff7a00;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 2px 4px rgba(255, 122, 0, 0.2);

  &:hover {
    background-color: #e66e00;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const AgenticAiClusterLoginButton = () => {
  const dispatch = useDispatch();

  const handleLoginClick = e => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(AuthenticationActions.setClusterLogin(true));
    dispatch(ClustersActions.fetchClusters({ params: { page: 1 } }));
  };

  return (
    <LoginButtonWrapper>
      <StyledButton onClick={handleLoginClick}>
        Click here to login to the cluster
      </StyledButton>
    </LoginButtonWrapper>
  );
};
