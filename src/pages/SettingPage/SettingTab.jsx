import React, { useState } from 'react';
import styled from 'styled-components';
import {
  AppIcon,
  DeploymentScheduleIcon,
  EmailConfigIcon,
  LDAPIcon,
  PropertyIcon,
  SSOLoginIcon,
  ServiceAccountIcon,
} from '../../assets';
import { AppSettings } from './AppSettings';
import { DeploymentScheduleSettings } from './DeploymentScheduleSettings';
import { EmailConfigurationSettings } from './EmailConfigurationSettings';
import FlowValidation from './FlowValidation';
import { LDAPSettings } from './LDAPSettings';
import { SSOLoginSettings } from './SSOLoginSettings';
import { ServiceAccountSettings } from './ServiceAccountSettings';
import { Setting } from './Setting';

const GreyBoxNamespace = styled.div`
  background-color: #ffffff;
  padding: 22px 19px;
  border-radius: 20px;
`;
const TabWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
  border-bottom: 1px solid rgba(221, 228, 240, 1);
  flex-wrap: nowrap; /* Prevents tabs from wrapping */
  align-items: center;
  border-bottom: 1px solid rgba(221, 228, 240, 1);
  min-width: max-content; /* Ensures it doesn't shrink below content width */
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  font: Red Hat Display;
  font-weight: 600;
  font-size: 16px;
  color: ${props =>
    props.active ? 'rgba(255, 122, 0, 1)' : 'rgba(68, 68, 69, 1)'};
  border-color: ${props =>
    props.active ? 'rgba(255, 122, 0, 1)' : 'transparent'};
  svg {
    stroke: ${props =>
      props.active ? 'rgba(255, 122, 0, 1)' : 'rgba(68, 68, 69, 1)'};
    transition: stroke 0.3s;
  }
  &:hover {
    color: rgba(255, 122, 0, 1);

    svg {
      stroke: rgba(255, 122, 0, 1);
    }
  }
`;

const TabsContainer = styled.div`
  width: 100%;
  overflow-x: auto; /* Enables horizontal scrolling */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
`;

const TabContent = styled.div`
  width: 100%;
  padding: 1rem;
  border-radius: 0.25rem;
  background-color: #ffffff;
`;

const IconContent = styled.div`
  display: inline;
  margin-right: 6px;
`;

const SettingTab = () => {
  const [activeTab, setActiveTab] = useState('AppSettings');
  const renderContent = () => {
    switch (activeTab) {
      case 'Setting':
        return <Setting />;
      case 'AppSettings':
        return <AppSettings />;
      case 'LDAPSettings':
        return <LDAPSettings />;
      case 'DeploymentScheduleSettings':
        return <DeploymentScheduleSettings />;
      case 'ServiceAccountSettings':
        return <ServiceAccountSettings />;
      case 'EmailConfigurationSettings':
        return <EmailConfigurationSettings />;
      case 'SSOLoginSettings':
        return <SSOLoginSettings />;
      case 'Flow Validation':
        return <FlowValidation />;
    }
  };
  return (
    <div>
      <GreyBoxNamespace className="w-100  mb-3">
        <TabsContainer>
          <TabWrapper className="nav">
            <Tab
              active={activeTab === 'AppSettings'}
              onClick={() => setActiveTab('AppSettings')}
              className="nav-item"
            >
              <IconContent className="nav-item">
                <AppIcon />
              </IconContent>
              App
            </Tab>
            <Tab
              active={activeTab === 'LDAPSettings'}
              onClick={() => setActiveTab('LDAPSettings')}
              className="nav-item"
            >
              <IconContent className="nav-item">
                <LDAPIcon />
              </IconContent>
              LDAP
            </Tab>
            <Tab
              active={activeTab === 'DeploymentScheduleSettings'}
              onClick={() => setActiveTab('DeploymentScheduleSettings')}
              className="nav-item"
            >
              <IconContent className="nav-item">
                <DeploymentScheduleIcon />
              </IconContent>
              Deployment Schedule
            </Tab>
            <Tab
              active={activeTab === 'ServiceAccountSettings'}
              onClick={() => setActiveTab('ServiceAccountSettings')}
              className="nav-item"
            >
              <IconContent className="nav-item">
                <ServiceAccountIcon />
              </IconContent>
              Service Account
            </Tab>
            <Tab
              active={activeTab === 'EmailConfigurationSettings'}
              onClick={() => setActiveTab('EmailConfigurationSettings')}
              className="nav-item"
            >
              <IconContent className="nav-item">
                <EmailConfigIcon />
              </IconContent>
              Email Configuration
            </Tab>
            <Tab
              active={activeTab === 'SSOLoginSettings'}
              onClick={() => setActiveTab('SSOLoginSettings')}
              className="nav-item"
            >
              <IconContent className="nav-item">
                <SSOLoginIcon />
              </IconContent>
              SSO Login
            </Tab>

            <Tab
              active={activeTab === 'Flow Validation'}
              onClick={() => setActiveTab('Flow Validation')}
              className="nav-item d-flex"
            >
              <IconContent className="nav-item">
                <PropertyIcon
                  height="18"
                  width="18"
                  color={
                    activeTab === 'Flow Validation' ? '#FF7A00' : '#444445'
                  }
                />
              </IconContent>
              Flow Validation
            </Tab>
          </TabWrapper>
        </TabsContainer>
        <TabContent>{renderContent()}</TabContent>
      </GreyBoxNamespace>
    </div>
  );
};

export default SettingTab;
