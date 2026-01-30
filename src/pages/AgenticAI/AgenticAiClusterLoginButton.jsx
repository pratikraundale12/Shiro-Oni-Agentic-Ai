import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  AuthenticationActions,
  ClustersActions,
  ClustersSelectors,
} from '../../store';
import { useDispatch, useSelector } from 'react-redux';

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

export const AgenticAiClusterLoginButton = ({ clusterId = null }) => {
  const dispatch = useDispatch();
  const clusters = useSelector(ClustersSelectors.getAllClustersList);

  const handleLoginClick = e => {
    e.preventDefault();
    e.stopPropagation();

    const targetCluster = clusterId && clusters.find(c => c.id === clusterId);

    if (targetCluster) {
      dispatch(
        AuthenticationActions.setClusterLogin({
          label: targetCluster?.name,
          value: targetCluster?.id,
        })
      );
    } else {
      dispatch(AuthenticationActions.setClusterLogin(true));
    }

    dispatch(ClustersActions.setIsLoggedInFromAgent(true));
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

AgenticAiClusterLoginButton.propTypes = {
  clusterId: PropTypes.string,
};
