import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { isEmpty } from 'lodash';

import { AuthenticationSelectors, NamespacesSelectors } from '../../store';

const IconCusterButton = styled.button`
  min-width: 50px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 32px;
  gap: 10px;
  padding: 0 12px;
  background-color: #f5f7fa;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
  max-width: 220px;
  overflow: hidden;
  display: flex;
  align-items: center;
  flex-shrink: 1;

  &:hover {
    background-color: #ebedf0;
  }
`;

const NameDiv = styled.div`
  font-family: ${props => props.theme.fontNato};
  color: ${props => props.theme.colors.darker};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
`;

const ClusterLabel = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusDiv = styled.div`
  width: 8px;
  height: 8px;
  background-color: #0cbf59;
  border-radius: 50%;
  margin-right: 6px;
`;

export const ShowLoggedInCluster = () => {
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);
  const currentUser = useSelector(AuthenticationSelectors.getCurrentUser);

  const canViewCluster =
    !isEmpty(currentUser?.permissions) &&
    currentUser?.permissions?.includes('view_cluster');

  if (!canViewCluster) return null;
  if (!selectedCluster?.label) return null;
  return (
    <IconCusterButton id="modal-cluster-icon-btn" type="button">
      <NameDiv>
        {selectedCluster?.label ? (
          <>
            <StatusDiv style={{ flexShrink: 0 }} />
            <ClusterLabel>{selectedCluster.label}</ClusterLabel>
          </>
        ) : null}
      </NameDiv>
    </IconCusterButton>
  );
};
