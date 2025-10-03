/* eslint-disable */
import React, { useEffect } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { CLUSTER_MODULE_TABS, KDFM } from '../../../constants';
import styled from 'styled-components';
import {
  AuthenticationSelectors,
  ClustersActions,
  ClustersSelectors,
} from '../../../store';
import { useDispatch, useSelector } from 'react-redux';

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

const ClusterNavigationTab = ({
  activeTab,
  setActiveTab,
  setNewRegistry,
  isRegistryDetailDisable,
  data,
}) => {
  const dispatch = useDispatch();
  const currentUserData = useSelector(AuthenticationSelectors.getCurrentUser);
  const sshDataAdded = useSelector(ClustersSelectors.getsshAddedStatus);
  const isSuperAdmin = currentUserData?.role === 'superadmin';
  useEffect(() => {
    if (data?.id) {
      dispatch(ClustersActions.fetchSSHstatus(data?.id));
    }
  }, [data?.id]);

  return (
    <NavTabs id="nav-tab" role="tablist">
      <NavButton
        active={activeTab === CLUSTER_MODULE_TABS.CLUSTER}
        onClick={() => {
          setActiveTab(CLUSTER_MODULE_TABS.CLUSTER);
          setNewRegistry(false);
        }}
      >
        {KDFM.CLUSTER_DETAILS}
      </NavButton>
      <>
        {!data?.created_by_ansible && (
          <NavButton
            active={activeTab === CLUSTER_MODULE_TABS.REGISTRY}
            onClick={() =>
              Object.keys(data || {})?.length
                ? setActiveTab(CLUSTER_MODULE_TABS.REGISTRY)
                : {}
            }
            disabled={isRegistryDetailDisable}
            data-tooltip-id="navButtonTooltip"
          >
            {KDFM.REGISTRY_DETAILS}
          </NavButton>
        )}

        {isRegistryDetailDisable && (
          <ReactTooltip
            id="navButtonTooltip"
            place="right"
            effect="solid"
            content="You have unsaved changes on Cluster Details"
            style={{
              whiteSpace: 'normal',
              zIndex: 9999,
            }}
            event="focus"
            eventOff="blur"
          />
        )}
      </>
      {isSuperAdmin && data && (
        <NavButton
          active={activeTab === CLUSTER_MODULE_TABS.SERVICE_ACCOUNT}
          onClick={() =>
            Object.keys(data || {})?.length
              ? setActiveTab(CLUSTER_MODULE_TABS.SERVICE_ACCOUNT)
              : {}
          }
          disabled={isRegistryDetailDisable}
          data-tooltip-id="navButtonTooltip"
        >
          {KDFM.SERVICE_ACCOUNT}
        </NavButton>
      )}
      {data && (
        <NavButton
          active={activeTab === CLUSTER_MODULE_TABS.SSH_DETAILS}
          onClick={() =>
            Object.keys(data || {})?.length
              ? setActiveTab(CLUSTER_MODULE_TABS.SSH_DETAILS)
              : {}
          }
          disabled={isRegistryDetailDisable}
          data-tooltip-id="navButtonTooltip"
        >
          SSH Details
        </NavButton>
      )}
      {sshDataAdded?.sshCredsAvailable && (
        <NavButton
          active={activeTab === CLUSTER_MODULE_TABS.CUSTOM_PROCESSOR}
          onClick={() =>
            Object.keys(data || {})?.length
              ? setActiveTab(CLUSTER_MODULE_TABS.CUSTOM_PROCESSOR)
              : {}
          }
          disabled={isRegistryDetailDisable}
          data-tooltip-id="navButtonTooltip"
        >
          {CLUSTER_MODULE_TABS.CUSTOM_PROCESSOR}
        </NavButton>
      )}
      {sshDataAdded?.sshCredsAvailable && (
        <NavButton
          active={activeTab === CLUSTER_MODULE_TABS.DRIVERS}
          onClick={() =>
            Object.keys(data || {})?.length
              ? setActiveTab(CLUSTER_MODULE_TABS.DRIVERS)
              : {}
          }
          disabled={isRegistryDetailDisable}
          data-tooltip-id="navButtonTooltip"
        >
          {CLUSTER_MODULE_TABS.DRIVERS}
        </NavButton>
      )}
      {sshDataAdded?.sshCredsAvailable && (
        <NavButton
          active={activeTab === CLUSTER_MODULE_TABS.FLOW_GZ}
          onClick={() =>
            Object.keys(data || {})?.length
              ? setActiveTab(CLUSTER_MODULE_TABS.FLOW_GZ)
              : {}
          }
          disabled={isRegistryDetailDisable}
          data-tooltip-id="navButtonTooltip"
        >
          {CLUSTER_MODULE_TABS.FLOW_GZ}
        </NavButton>
      )}
    </NavTabs>
  );
};
export default ClusterNavigationTab;
