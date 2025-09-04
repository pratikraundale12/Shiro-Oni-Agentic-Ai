import React, { useState } from 'react';
import styled from 'styled-components';
import NiFiClusterAccessManagement from './components/NiFiClusterAccessManagement';
import NiFiProcessGroupAccessManagement from './components/NiFiProcessGroupAccessManagement';
import { ModuleAccess } from '.';

const OptionsContainer = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const OptionWrapper = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const RadioButton = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => (props.selected ? '#ff6b35' : '#d1d5db')};
  background: ${props => (props.selected ? '#ff6b35' : 'white')};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => (props.selected ? '#ff6b35' : '#9ca3af')};
  }
`;

const CheckIcon = styled.div`
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  opacity: ${props => (props.selected ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

const OptionText = styled.span`
  font-size: 14px;
  color: #374151;
  font-weight: 500;
`;

const HiddenInput = styled.input`
  display: none;
`;

const AccessManagementTypes = () => {
  const [selectedType, setSelectedType] = useState('dfm');

  const handleTypeChange = type => {
    setSelectedType(type);
  };

  const options = [
    {
      id: 'dfm',
      label: 'DFM Access Management',
      value: 'dfm',
    },
    {
      id: 'nifi-cluster',
      label: 'NiFi Cluster Access Management',
      value: 'nifi-cluster',
    },
    {
      id: 'nifi-process-group',
      label: 'NiFi Process Group Access Management',
      value: 'nifi-process-group',
    },
  ];

  return (
    <>
      <OptionsContainer>
        {options.map(option => (
          <OptionWrapper key={option.id}>
            <HiddenInput
              type="radio"
              name="accessType"
              value={option.value}
              checked={selectedType === option.value}
              onChange={() => handleTypeChange(option.value)}
            />
            <RadioButton selected={selectedType === option.value}>
              <CheckIcon selected={selectedType === option.value} />
            </RadioButton>
            <OptionText>{option.label}</OptionText>
          </OptionWrapper>
        ))}
      </OptionsContainer>

      <>
        {selectedType === 'dfm' && <ModuleAccess />}
        {selectedType === 'nifi-cluster' && <NiFiClusterAccessManagement />}
        {selectedType === 'nifi-process-group' && (
          <NiFiProcessGroupAccessManagement />
        )}
      </>
    </>
  );
};

export default AccessManagementTypes;
