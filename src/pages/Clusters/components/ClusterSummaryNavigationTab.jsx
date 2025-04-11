/*eslint-disable*/
import React from 'react';
import { KDFM } from '../../../constants';
import styled from 'styled-components';
import { ClusterDetailTabIcon, CubeIcon } from '../../../assets';

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

const ClusterSummaryNavigationTab = ({ activeTab, setActiveTab }) => {
  return (
    <NavTabs id="nav-tab" role="tablist">
      <NavButton
        active={activeTab === 'summary'}
        onClick={() => {
          setActiveTab('summary');
        }}
      >
        <ClusterDetailTabIcon
          color={activeTab === 'summary' ? '#FF7A00' : '#444445'}
        />{' '}
        {KDFM.CLUSTER_SUMMARY}
      </NavButton>
      <NavButton
        active={activeTab === 'status'}
        onClick={() => {
          setActiveTab('status');
        }}
      >
        <CubeIcon
          color={activeTab === 'status' ? '#FF7A00' : '#444445'}
          height={18}
          width={18}
        />{' '}
        {KDFM.STATUS}
      </NavButton>
    </NavTabs>
  );
};
export default ClusterSummaryNavigationTab;
