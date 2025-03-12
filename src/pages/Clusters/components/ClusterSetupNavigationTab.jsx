/*eslint-disable*/
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { CLUSTER_MODULE_TABS, KDFM } from '../../../constants';
import styled from 'styled-components';

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

const ClusterSetupNavigationTab = ({ activeTab, setAtiveTab }) => {
  return (
    <NavTabs id="nav-tab" role="tablist">
      <NavButton
        active={activeTab === 'getting_started'}
        onClick={() => {
          setAtiveTab('getting_started');
        }}
      >
        {KDFM.GETTING_STARTED}
      </NavButton>
      <>
        <NavButton
          active={activeTab === 'cluster_details'}
          onClick={() => setAtiveTab('cluster_details')}
          //   disabled={isRegistryDetailDisable}
        >
          {KDFM.CLUSTER_DETAILS}
        </NavButton>
      </>
    </NavTabs>
  );
};
export default ClusterSetupNavigationTab;
