import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { LogoutIcon } from '../../assets';
import { CLUSTERS_TOKEN } from '../../constants';
import {
  ClustersActions,
  DashboardActions,
  GridActions,
  NamespacesActions,
  NamespacesSelectors,
} from '../../store';

const LogoutButtonContainer = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #fff;
  border: 1px solid #a51e1e;
  border-radius: 6px;
  color: #a51e1e;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #a51e1e;
    color: #fff;
    svg {
      fill: #fff;
    }
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const AgenticAiClusterLogoutButton = () => {
  const dispatch = useDispatch();
  const selectedCluster = useSelector(NamespacesSelectors.getSelectedCluster);

  const handleLogout = () => {
    if (!selectedCluster?.value) {
      toast.error('No active cluster found to logout from.');
      return;
    }

    const clusterId = selectedCluster.value;

    dispatch(GridActions.fetchGridSuccess({ module: 'namespaces', data: {} }));
    dispatch(DashboardActions.fetchDashboardSuccess({ data: {} }));

    const clustersToken =
      JSON.parse(localStorage.getItem(CLUSTERS_TOKEN)) || [];
    const updatedClustersToken = clustersToken.filter(t => t.id !== clusterId);
    const tokenObjToRemove = clustersToken.find(t => t.id === clusterId);

    if (tokenObjToRemove) {
      dispatch(
        ClustersActions.clusterLogout({
          id: clusterId,
          token: tokenObjToRemove.token,
        })
      );
    }

    if (updatedClustersToken.length > 0) {
      const nextCluster = updatedClustersToken[0];
      const newSelection = { label: nextCluster.name, value: nextCluster.id };
      localStorage.setItem('selected_cluster', JSON.stringify(newSelection));
      dispatch(NamespacesActions.setSelectedCluster(newSelection));
    } else {
      localStorage.removeItem('selected_cluster');
      dispatch(NamespacesActions.setSelectedCluster({ label: '', value: '' }));
    }

    localStorage.setItem(CLUSTERS_TOKEN, JSON.stringify(updatedClustersToken));
    toast.success('Disconnected from cluster successfully');
  };

  return (
    <LogoutButtonContainer onClick={handleLogout}>
      <LogoutIcon />
      Logout from {selectedCluster?.label || 'Cluster'}
    </LogoutButtonContainer>
  );
};
