/*eslint-disable*/
import React from 'react';
import { KDFM } from '../../../constants';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ClustersActions, ClustersSelectors } from '../../../store';
import {
  ActivityHistoryIcon,
  ClusterDetailTabIcon,
  CubeIcon,
  ManageHostIcon,
  SettingSmallIcon,
} from '../../../assets';

const NavTabs = styled.div`
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
`;
const NavButton = styled.button`
  border: 0;
  background: none;
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
  font-family: ${props => props.theme.fontNato};
  color: ${props =>
    props.active ? props.theme.colors.primary : props.theme.colors.darkGrey2};
  cursor: ${({ disabled }) =>
    disabled ? 'not-allowed !important' : 'pointer !important'};
  opacity: ${({ disabled }) => (disabled ? '0.5 !important' : '1')};
  transition:
    color 0.3s,
    border-bottom 0.3s;
  ${props =>
    props.active &&
    `border-bottom: 1px solid ${props.theme.colors.primaryActive};`}
`;

const ClusterSetupNavigationTab = ({ activeTab }) => {
  const dispatch = useDispatch();
  const createClusterVisKubernetes = useSelector(
    ClustersSelectors.getCreateClusterMethod
  );
  return (
    <NavTabs id="nav-tab" role="tablist">
      <NavButton
        active={activeTab === 'getting_started'}
        onClick={() => {
          dispatch(ClustersActions.setActiveTabClusterSetup('getting_started'));
        }}
      >
        <CubeIcon
          color={activeTab === 'getting_started' ? '#FF7A00' : '#444445'}
        />{' '}
        {KDFM.GETTING_STARTED}
      </NavButton>
      <NavButton
        active={activeTab === 'manage_host'}
        onClick={() => {
          dispatch(ClustersActions.setActiveTabClusterSetup('manage_host'));
        }}
      >
        <ManageHostIcon
          color={activeTab === 'manage_host' ? '#FF7A00' : '#444445'}
        />{' '}
        {createClusterVisKubernetes === 'VM'
          ? KDFM.MANAGE_HOST
          : 'Manage Kube Cluster'}
      </NavButton>
      <NavButton
        active={activeTab === 'manage_config'}
        onClick={() => {
          dispatch(ClustersActions.setActiveTabClusterSetup('manage_config'));
        }}
      >
        <SettingSmallIcon
          color={activeTab === 'manage_config' ? '#FF7A00' : '#444445'}
          height={18}
          width={18}
        />{' '}
        {KDFM.MANAGE_CONFIG}
      </NavButton>
      <NavButton
        active={activeTab === 'cluster_details'}
        onClick={() => {
          dispatch(ClustersActions.setActiveTabClusterSetup('cluster_details'));
        }}
      >
        <ClusterDetailTabIcon
          color={activeTab === 'cluster_details' ? '#FF7A00' : '#444445'}
        />{' '}
        {KDFM.CLUSTER_DETAILS}
      </NavButton>
    </NavTabs>
  );
};
export default ClusterSetupNavigationTab;
