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

const DFMAccessManagement = () => {
  const [formData, setFormData] = useState({
    accessLevel: 'read',
    permissions: {
      canView: true,
      canEdit: false,
      canDelete: false,
      canDeploy: false,
    },
    userGroups: '',
    expiryDate: '',
  });

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

  const handleSave = () => {
    console.log('DFM Access Management Settings:', formData);
    // Handle save logic here
  };

  return (
    <ComponentContainer>
      <SectionTitle>DFM Access Management Configuration</SectionTitle>

      <FormGroup>
        <Label>Access Level</Label>
        <Select
          value={formData.accessLevel}
          onChange={e => handleInputChange('accessLevel', e.target.value)}
        >
          <option value="read">Read Only</option>
          <option value="write">Read & Write</option>
          <option value="admin">Administrator</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Permissions</Label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canView}
              onChange={e =>
                handlePermissionChange('canView', e.target.checked)
              }
            />
            <CheckboxLabel>Can View Dashboard</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canEdit}
              onChange={e =>
                handlePermissionChange('canEdit', e.target.checked)
              }
            />
            <CheckboxLabel>Can Edit Configurations</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canDelete}
              onChange={e =>
                handlePermissionChange('canDelete', e.target.checked)
              }
            />
            <CheckboxLabel>Can Delete Resources</CheckboxLabel>
          </CheckboxContainer>

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              checked={formData.permissions.canDeploy}
              onChange={e =>
                handlePermissionChange('canDeploy', e.target.checked)
              }
            />
            <CheckboxLabel>Can Deploy Flows</CheckboxLabel>
          </CheckboxContainer>
        </div>
      </FormGroup>

      <FormGroup>
        <Label>User Groups (comma-separated)</Label>
        <Input
          type="text"
          placeholder="admin, developers, operators"
          value={formData.userGroups}
          onChange={e => handleInputChange('userGroups', e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label>Access Expiry Date</Label>
        <Input
          type="date"
          value={formData.expiryDate}
          onChange={e => handleInputChange('expiryDate', e.target.value)}
        />
      </FormGroup>

      <Button onClick={handleSave}>Save DFM Access Settings</Button>
    </ComponentContainer>
  );
};

export default DFMAccessManagement;
