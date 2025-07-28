/*eslint-disable*/
import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { CLUSTER_MODULE_TABS, KDFM } from '../../../constants';
import styled from 'styled-components';
import { AuthenticationSelectors } from '../../../store';
import { useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

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
  setClusterFormData = () => {},
  certificateOption
}) => {
  const currentUserData = useSelector(AuthenticationSelectors.getCurrentUser);
  const isSuperAdmin = currentUserData?.role === 'superadmin';
  return (
    <NavTabs id="nav-tab" role="tablist">
      <NavButton
        active={activeTab === CLUSTER_MODULE_TABS.CLUSTER}
        onClick={() => {
          setActiveTab(CLUSTER_MODULE_TABS.CLUSTER);
          setNewRegistry(false);
          setClusterFormData();
        }}
      >
        {KDFM.CLUSTER_DETAILS}
      </NavButton>
      <>
        <NavButton
          active={activeTab === CLUSTER_MODULE_TABS.REGISTRY}
          onClick={() =>
            Object.keys(data || {})?.length
              ? data.id
                ? setActiveTab(CLUSTER_MODULE_TABS.REGISTRY)
                : {}
              : {}
          }
          disabled={isRegistryDetailDisable || isEmpty(data)}
          data-tooltip-id="navButtonTooltip"
        >
          {KDFM.REGISTRY_DETAILS}
        </NavButton>

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
      {data?.is_certificate_based_service_account === false && certificateOption === false &&
        isSuperAdmin &&
        data &&
        location?.pathname === '/clusters/edit' && (
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
    </NavTabs>
  );
};
export default ClusterNavigationTab;
