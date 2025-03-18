import React, { useState } from 'react';
import styled from 'styled-components';
import FlowValidation from './FlowValidation';
import { Setting } from './Setting';

const GreyBoxNamespace = styled.div`
  background-color: #f5f7fa;
  padding: 22px 19px;
  border-radius: 20px;
`;
const TabWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
  border-bottom: 1px solid rgba(221, 228, 240, 1);
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
  &:hover {
    color: rgba(255, 122, 0, 1);
  }
`;
const TabContent = styled.div`
  width: 100%;
  padding: 1rem;
  border-radius: 0.25rem;
  background-color: #f8f9fa;
`;

const SettingTab = () => {
  const [activeTab, setActiveTab] = useState('Setting');
  const renderContent = () => {
    switch (activeTab) {
      case 'Setting':
        return <Setting />;
      case 'Flow Validation':
        return <FlowValidation />;
    }
  };
  return (
    <div>
      <GreyBoxNamespace className="w-100  mb-3">
        <TabWrapper className="nav">
          <Tab
            active={activeTab === 'Setting'}
            onClick={() => setActiveTab('Setting')}
            className="nav-item"
          >
            Setting
          </Tab>
          <Tab
            active={activeTab === 'Flow Validation'}
            onClick={() => setActiveTab('Flow Validation')}
            className="nav-item"
          >
            Flow Validation
          </Tab>
        </TabWrapper>
        <TabContent>{renderContent()}</TabContent>
      </GreyBoxNamespace>
    </div>
  );
};

export default SettingTab;
