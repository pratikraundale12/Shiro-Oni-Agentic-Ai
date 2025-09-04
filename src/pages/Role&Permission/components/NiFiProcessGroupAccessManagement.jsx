import React, { useState } from 'react';
import styled from 'styled-components';

const ComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`;

const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #ff6b35;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

const Button = styled.button`
  background: #ff6b35;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  align-self: flex-start;

  &:hover {
    background: #e55a2b;
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
`;

const ProcessGroupTree = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 16px;
  background: white;
  max-height: 200px;
  overflow-y: auto;
`;

const ProcessGroupItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const ProcessGroupName = styled.div`
  font-size: 14px;
  color: #374151;
  flex: 1;
`;

const ProcessGroupStatus = styled.div`
  font-size: 12px;
  color: ${props => (props.status === 'running' ? '#059669' : '#dc2626')};
  margin-left: auto;
`;

// const AccessLevelBadge = styled.span`
//   padding: 2px 8px;
//   border-radius: 12px;
//   font-size: 12px;
//   font-weight: 500;
//   background: ${props => {
//     switch (props.level) {
//       case 'read':
//         return '#dbeafe';
//       case 'write':
//         return '#fef3c7';
//       case 'admin':
//         return '#fecaca';
//       default:
//         return '#f3f4f6';
//     }
//   }};
//   color: ${props => {
//     switch (props.level) {
//       case 'read':
//         return '#1e40af';
//       case 'write':
//         return '#92400e';
//       case 'admin':
//         return '#dc2626';
//       default:
//         return '#6b7280';
//     }
//   }};
// `;

const NiFiProcessGroupAccessManagement = () => {
  const [formData, setFormData] = useState({
    selectedProcessGroups: [],
    accessLevel: 'read',
    permissions: {
      canStartStop: false,
      canModifyFlow: false,
      canViewData: true,
      canManageConnections: false,
      canAccessDataProvenance: false,
    },
    dataRetention: '30',
    customAttributes: '',
    monitoringSettings: {
      enableMetrics: true,
      enableAlerts: false,
      logLevel: 'INFO',
    },
  });

  const availableProcessGroups = [
    { id: 'pg1', name: 'Data Ingestion Flow', status: 'running' },
    { id: 'pg2', name: 'Data Processing Pipeline', status: 'stopped' },
    { id: 'pg3', name: 'Data Validation Flow', status: 'running' },
    { id: 'pg4', name: 'Data Export Flow', status: 'running' },
    { id: 'pg5', name: 'Error Handling Flow', status: 'stopped' },
  ];

  const handleProcessGroupSelection = groupId => {
    setFormData(prev => ({
      ...prev,
      selectedProcessGroups: prev.selectedProcessGroups.includes(groupId)
        ? prev.selectedProcessGroups.filter(id => id !== groupId)
        : [...prev.selectedProcessGroups, groupId],
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePermissionChange = (permission, checked) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: checked,
      },
    }));
  };

  const handleMonitoringChange = (setting, value) => {
    setFormData(prev => ({
      ...prev,
      monitoringSettings: {
        ...prev.monitoringSettings,
        [setting]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log('NiFi Process Group Access Management Settings:', formData);
    // Handle save logic here
  };

  return (
    <ComponentContainer>
      <SectionTitle>NiFi Process Group Access Management</SectionTitle>

      <FormGroup>
        <Label>Select Process Groups</Label>
        <ProcessGroupTree>
          {availableProcessGroups.map(group => (
            <ProcessGroupItem key={group.id}>
              <Checkbox
                type="checkbox"
                checked={formData.selectedProcessGroups.includes(group.id)}
                onChange={() => handleProcessGroupSelection(group.id)}
              />
              <ProcessGroupName>{group.name}</ProcessGroupName>
              <ProcessGroupStatus status={group.status}>
                {group.status === 'running' ? '● Running' : '● Stopped'}
              </ProcessGroupStatus>
            </ProcessGroupItem>
          ))}
        </ProcessGroupTree>
      </FormGroup>

      <FormGroup>
        <Label>Access Level</Label>
        <Select
          value={formData.accessLevel}
          onChange={e => handleInputChange('accessLevel', e.target.value)}
        >
          <option value="read">Read Only</option>
          <option value="write">Read & Write</option>
          <option value="admin">Full Control</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Process Group Permissions</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canStartStop}
              onChange={e =>
                handlePermissionChange('canStartStop', e.target.checked)
              }
            />
            <CheckboxLabel>Can Start/Stop Process Groups</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canModifyFlow}
              onChange={e =>
                handlePermissionChange('canModifyFlow', e.target.checked)
              }
            />
            <CheckboxLabel>Can Modify Flow Configuration</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canViewData}
              onChange={e =>
                handlePermissionChange('canViewData', e.target.checked)
              }
            />
            <CheckboxLabel>Can View Flow Data</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canManageConnections}
              onChange={e =>
                handlePermissionChange('canManageConnections', e.target.checked)
              }
            />
            <CheckboxLabel>Can Manage Connections</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canAccessDataProvenance}
              onChange={e =>
                handlePermissionChange(
                  'canAccessDataProvenance',
                  e.target.checked
                )
              }
            />
            <CheckboxLabel>Can Access Data Provenance</CheckboxLabel>
          </CheckboxContainer>
        </div>
      </FormGroup>

      <FormGroup>
        <Label>Data Retention (days)</Label>
        <Input
          type="number"
          min="1"
          max="365"
          value={formData.dataRetention}
          onChange={e => handleInputChange('dataRetention', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label>Custom Attributes (JSON)</Label>
        <TextArea
          placeholder='{"attribute1": "value1", "attribute2": "value2"}'
          value={formData.customAttributes}
          onChange={e => handleInputChange('customAttributes', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label>Monitoring Settings</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.monitoringSettings.enableMetrics}
              onChange={e =>
                handleMonitoringChange('enableMetrics', e.target.checked)
              }
            />
            <CheckboxLabel>Enable Metrics Collection</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.monitoringSettings.enableAlerts}
              onChange={e =>
                handleMonitoringChange('enableAlerts', e.target.checked)
              }
            />
            <CheckboxLabel>Enable Performance Alerts</CheckboxLabel>
          </CheckboxContainer>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Label style={{ margin: 0, minWidth: '80px' }}>Log Level:</Label>
            <Select
              value={formData.monitoringSettings.logLevel}
              onChange={e => handleMonitoringChange('logLevel', e.target.value)}
              style={{ flex: 1 }}
            >
              <option value="DEBUG">DEBUG</option>
              <option value="INFO">INFO</option>
              <option value="WARN">WARN</option>
              <option value="ERROR">ERROR</option>
            </Select>
          </div>
        </div>
      </FormGroup>

      <Button onClick={handleSave}>Save Process Group Access Settings</Button>
    </ComponentContainer>
  );
};

export default NiFiProcessGroupAccessManagement;
