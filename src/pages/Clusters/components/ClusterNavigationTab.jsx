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
import { useGlobalContext } from '../../../utils';
import { history } from '../../../helpers/history';

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
  const dispatch = useDispatch();
  const currentUserData = useSelector(AuthenticationSelectors.getCurrentUser);
  const sshDataAdded = useSelector(ClustersSelectors.getsshAddedStatus);
  const isSuperAdmin = currentUserData?.role === 'superadmin';
  const { state } = useGlobalContext();

  useEffect(() => {
    if (data?.id && !state?.is_kube_cluster) {
      dispatch(ClustersActions.fetchSSHstatus(data?.id));
    }
  }, [data?.id, activeTab]);

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
        {!data?.created_by_ansible && !data?.is_kube_cluster && (
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
      {data && !state?.is_kube_cluster && (
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
      {
        <>
          <NavButton
            active={activeTab === CLUSTER_MODULE_TABS.CUSTOM_PROCESSOR}
            onClick={() =>
              Object.keys(data || {})?.length
                ? setActiveTab(CLUSTER_MODULE_TABS.CUSTOM_PROCESSOR)
                : {}
            }
            disabled={
              state?.is_kube_cluster ? false : !sshDataAdded?.sshCredsAvailable
            }
            data-tooltip-id="custom_processor"
          >
            {CLUSTER_MODULE_TABS.CUSTOM_PROCESSOR}
          </NavButton>
          {!sshDataAdded?.sshCredsAvailable && (
            <ReactTooltip
              id="custom_processor"
              place="right"
              effect="solid"
              content="Add Processor details"
              style={{
                whiteSpace: 'normal',
                zIndex: 9999,
              }}
              event="focus"
              eventOff="blur"
            />
          )}
        </>
      }
      {
        <>
          <NavButton
            active={activeTab === CLUSTER_MODULE_TABS.CUSTOM_SCRIPTS}
            onClick={() =>
              Object.keys(data || {})?.length
                ? setActiveTab(CLUSTER_MODULE_TABS.CUSTOM_SCRIPTS)
                : {}
            }
            disabled={
              state?.is_kube_cluster ? false : !sshDataAdded?.sshCredsAvailable
            }
            data-tooltip-id="custom_scripts"
          >
            {CLUSTER_MODULE_TABS.CUSTOM_SCRIPTS}
          </NavButton>
          {!sshDataAdded?.sshCredsAvailable && (
            <ReactTooltip
              id="custom_scripts"
              place="right"
              effect="solid"
              content="Add Scripts"
              style={{
                whiteSpace: 'normal',
                zIndex: 9999,
              }}
              event="focus"
              eventOff="blur"
            />
          )}
        </>
      }

      {
        <NavButton
          active={activeTab === CLUSTER_MODULE_TABS.DRIVERS}
          onClick={() =>
            Object.keys(data || {})?.length
              ? setActiveTab(CLUSTER_MODULE_TABS.DRIVERS)
              : {}
          }
          disabled={
            state?.is_kube_cluster ? false : !sshDataAdded?.sshCredsAvailable
          }
          data-tooltip-id="drivers"
        >
          {CLUSTER_MODULE_TABS.DRIVERS}
        </NavButton>
      }
      {!sshDataAdded?.sshCredsAvailable && (
        <ReactTooltip
          id="drivers"
          place="right"
          effect="solid"
          content="Add SSH details"
          style={{
            whiteSpace: 'normal',
            zIndex: 9999,
          }}
          event="focus"
          eventOff="blur"
        />
      )}
      {state?.is_kube_cluster && (
        <>
          <NavButton
            onClick={() => {
              if (state?.is_kube_cluster) {
                dispatch(ClustersActions.setCreateClusterMethod('Kubernetes'));
                // if (item?.is_azure_cluster) {
                // }  CHANGEHERE
                dispatch(ClustersActions.setAzureCluster(true));
              }
              dispatch(
                ClustersActions.setansibleClucterToEdit(state?.nodeClusterId)
              );
              dispatch(
                ClustersActions.setActiveTabClusterSetup('cluster_details')
              );

              history.push(`/clusters/setup-cluster`);
            }}
            disabled={
              state?.is_kube_cluster ? false : !sshDataAdded?.sshCredsAvailable
            }
            data-tooltip-id="cluster_upgarde_navigate"
          >
            Cluster Upgrade
          </NavButton>
          {!sshDataAdded?.sshCredsAvailable && (
            <ReactTooltip
              id="cluster_upgarde_navigate"
              place="right"
              effect="solid"
              content="Navigate to Upgrade"
              style={{
                whiteSpace: 'normal',
                zIndex: 9999,
              }}
              event="focus"
              eventOff="blur"
            />
          )}
        </>
      )}
      {false && (
        <NavButton
          active={activeTab === CLUSTER_MODULE_TABS.FLOW_GZ}
          onClick={() =>
            Object.keys(data || {})?.length
              ? setActiveTab(CLUSTER_MODULE_TABS.FLOW_GZ)
              : {}
          }
          disabled={true}
          data-tooltip-id="flow_gz"
        >
          {CLUSTER_MODULE_TABS.FLOW_GZ}
        </NavButton>
      )}
      {!sshDataAdded?.sshCredsAvailable && (
        <ReactTooltip
          id="flow_gz"
          place="right"
          effect="solid"
          content="Add SSH details"
          style={{
            whiteSpace: 'normal',
            zIndex: 9999,
          }}
          event="focus"
          eventOff="blur"
        />
      )}
    </NavTabs>
  );
};
export default ClusterNavigationTab;
