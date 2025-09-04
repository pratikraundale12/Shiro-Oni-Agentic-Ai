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

// const Input = styled.input`
//   padding: 10px 12px;
//   border: 1px solid #d1d5db;
//   border-radius: 6px;
//   font-size: 14px;
//   transition: border-color 0.2s ease;

//   &:focus {
//     outline: none;
//     border-color: #ff6b35;
//     box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
//   }
// `;

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

const ClusterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
`;

const ClusterCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ff6b35;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  ${props =>
    props.selected &&
    `
    border-color: #ff6b35;
    background: #fff7f3;
  `}
`;

const ClusterName = styled.div`
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
`;

const ClusterStatus = styled.div`
  font-size: 12px;
  color: ${props => (props.status === 'active' ? '#059669' : '#dc2626')};
`;

const NiFiClusterAccessManagement = () => {
  const [formData, setFormData] = useState({
    selectedClusters: [],
    accessType: 'read',
    permissions: {
      canManageNodes: false,
      canViewMetrics: true,
      canManageUsers: false,
      canAccessRegistry: false,
    },
    customPolicies: '',
    notificationSettings: {
      emailAlerts: true,
      slackAlerts: false,
    },
  });

  const availableClusters = [
    { id: 'cluster1', name: 'Production Cluster', status: 'active' },
    { id: 'cluster2', name: 'Development Cluster', status: 'active' },
    { id: 'cluster3', name: 'Testing Cluster', status: 'inactive' },
    { id: 'cluster4', name: 'Staging Cluster', status: 'active' },
  ];

  const handleClusterSelection = clusterId => {
    setFormData(prev => ({
      ...prev,
      selectedClusters: prev.selectedClusters.includes(clusterId)
        ? prev.selectedClusters.filter(id => id !== clusterId)
        : [...prev.selectedClusters, clusterId],
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

  const handleNotificationChange = (setting, checked) => {
    setFormData(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [setting]: checked,
      },
    }));
  };

  const handleSave = () => {
    console.log('NiFi Cluster Access Management Settings:', formData);
    // Handle save logic here
  };

  return (
    <ComponentContainer>
      <SectionTitle>NiFi Cluster Access Management</SectionTitle>

      <FormGroup>
        <Label>Select Clusters</Label>
        <ClusterGrid>
          {availableClusters.map(cluster => (
            <ClusterCard
              key={cluster.id}
              selected={formData.selectedClusters.includes(cluster.id)}
              onClick={() => handleClusterSelection(cluster.id)}
            >
              <ClusterName>{cluster.name}</ClusterName>
              <ClusterStatus status={cluster.status}>
                {cluster.status === 'active' ? '● Active' : '● Inactive'}
              </ClusterStatus>
            </ClusterCard>
          ))}
        </ClusterGrid>
      </FormGroup>

      <FormGroup>
        <Label>Access Type</Label>
        <Select
          value={formData.accessType}
          onChange={e => handleInputChange('accessType', e.target.value)}
        >
          <option value="read">Read Only</option>
          <option value="write">Read & Write</option>
          <option value="admin">Cluster Administrator</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Cluster Permissions</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canManageNodes}
              onChange={e =>
                handlePermissionChange('canManageNodes', e.target.checked)
              }
            />
            <CheckboxLabel>Can Manage Cluster Nodes</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canViewMetrics}
              onChange={e =>
                handlePermissionChange('canViewMetrics', e.target.checked)
              }
            />
            <CheckboxLabel>Can View Cluster Metrics</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canManageUsers}
              onChange={e =>
                handlePermissionChange('canManageUsers', e.target.checked)
              }
            />
            <CheckboxLabel>Can Manage Cluster Users</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canAccessRegistry}
              onChange={e =>
                handlePermissionChange('canAccessRegistry', e.target.checked)
              }
            />
            <CheckboxLabel>Can Access Registry</CheckboxLabel>
          </CheckboxContainer>
        </div>
      </FormGroup>

      <FormGroup>
        <Label>Custom Policies (JSON)</Label>
        <TextArea
          placeholder='{"policy1": "value1", "policy2": "value2"}'
          value={formData.customPolicies}
          onChange={e => handleInputChange('customPolicies', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label>Notification Settings</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.notificationSettings.emailAlerts}
              onChange={e =>
                handleNotificationChange('emailAlerts', e.target.checked)
              }
            />
            <CheckboxLabel>Email Alerts</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.notificationSettings.slackAlerts}
              onChange={e =>
                handleNotificationChange('slackAlerts', e.target.checked)
              }
            />
            <CheckboxLabel>Slack Alerts</CheckboxLabel>
          </CheckboxContainer>
        </div>
      </FormGroup>

      <Button onClick={handleSave}>Save Cluster Access Settings</Button>
    </ComponentContainer>
  );
};

export default NiFiClusterAccessManagement;
