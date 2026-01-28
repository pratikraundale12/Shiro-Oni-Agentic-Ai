/*eslint-disable*/
import React from 'react';
import { KDFM } from '../../../constants';
import styled from 'styled-components';
import {
  ClusterDetailTabIcon,
  CubeIcon,
  ManageHostIcon,
  NotePadIcon,
} from '../../../assets';
import { useGlobalContext } from '../../../utils';

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

const ClusterSummaryNavigationTab = ({
  activeTab,
  setActiveTab,
  createdByAnsible,
}) => {
  const { state } = useGlobalContext();

  return (
    <NavTabs id="nav-tab" role="tablist">
      <NavButton
        active={activeTab === 'summary'}
        onClick={() => {
          setActiveTab('summary');
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <NotePadIcon
            color={activeTab === 'summary' ? '#FF7A00' : '#444445'}
            width={22}
            height={22}
          />
          {KDFM.CLUSTER_SUMMARY}
        </div>
      </NavButton>

      {/* {state?.is_kube_cluster && state?.isRegistrySecured && (
        <NavButton
          active={activeTab === 'registry_cert'}
          onClick={() => {
            setActiveTab('registry_cert');
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <NotePadIcon
              color={activeTab === 'registry_cert' ? '#FF7A00' : '#444445'}
              width={22}
              height={22}
            />
            Registry
          </div>
        </NavButton>
      )} */}

      {createdByAnsible && (
        <NavButton
          active={activeTab === 'status'}
          onClick={() => {
            setActiveTab('status');
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <ManageHostIcon
              color={activeTab === 'status' ? '#FF7A00' : '#444445'}
              width={22}
              height={22}
            />
            Cluster {KDFM.STATUS}
          </div>
        </NavButton>
      )}
    </NavTabs>
  );
};
export default ClusterSummaryNavigationTab;
