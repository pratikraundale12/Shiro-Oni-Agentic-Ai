import React, { useState } from 'react';
import styled from 'styled-components';
import NiFiClusterAccessManagement from './components/NiFiClusterAccessManagement';
import NiFiProcessGroupAccessManagement from './components/NiFiProcessGroupAccessManagement';
import { ModuleAccess } from '.';
import { RadioField } from '../../shared/FormInputs';

const OptionsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
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
          <RadioField
            key={option.id}
            name="accessType"
            label={option.label}
            value={option.value}
            checked={selectedType === option.value}
            onChange={() => handleTypeChange(option.value)}
            register={() => {}} // Empty function since we're handling state manually
          />
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
