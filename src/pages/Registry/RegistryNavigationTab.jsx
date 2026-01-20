/*eslint-disable*/
import React from 'react';
import { KDFM } from '../../constants';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { ClustersActions, ClustersSelectors } from '../../store';
import {
  ClusterDetailsIcon,
  GettingStartedIcon,
  ManageConfigIcon,
  ManageKubeClusterIcon,
} from '../../assets';
import { useLocation } from 'react-router-dom';
import { history } from '../../helpers/history';

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

const RegistryNavigationTab = ({ activeTab }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const createClusterVisKubernetes = useSelector(
    ClustersSelectors.getCreateClusterMethod
  );
  return (
    <NavTabs id="nav-tab" role="tablist">
      <NavButton
        active={pathname?.includes('/getting-started')}
        onClick={() => {
          history.push(`/registry-management/getting-started`);
        }}
      >
        <GettingStartedIcon height="25" width="25" />

        {KDFM.GETTING_STARTED}
      </NavButton>
      <NavButton
        active={pathname?.includes('/kube-config')}
        onClick={() => {
          history.push(`/registry-management/kube-config`);
        }}
      >
        <ManageKubeClusterIcon height="25" width="25" color={'black'} />
        Kubernetes Configuration
      </NavButton>
      <NavButton
        active={pathname?.includes('/configuration')}
        onClick={() => {
          history.push(`/registry-management/configuration`);
        }}
      >
        <ManageConfigIcon height="25" width="25" color={'black'} />
        Registry Configuration
      </NavButton>
      <NavButton
        active={pathname?.includes('/details')}
        onClick={() => {
          history.push(`/registry-management/details`);
        }}
      >
        <ClusterDetailsIcon height="25" width="25" color={'black'} />
        Registry Details
      </NavButton>
    </NavTabs>
  );
};
export default RegistryNavigationTab;
