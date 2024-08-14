import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Grid, IconButton, TextRender } from '../../components';
import { EditPermissions } from './EditPermissions';
import { CheckboxField } from '../../shared';
import { PencilIcon } from '../../assets';
import { useGlobalContext } from '../../utils';
import { getRoles } from '../../store';
import { EditPolicies } from './EditPolicies';

const Select = styled.select`
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 16px;
  font-weight: 600;
  font-family: ${props => props.theme.fontRedHat};
  background-color: ${props => props.theme.colors.white};
  text-transform: capitalize;

  &:focus-visible {
    outline: none;
  }

  option {
    text-transform: capitalize;
  }
`;

const GroupColumn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Capitalize = styled(TextRender)`
  text-transform: capitalize;
`;

export const PermissionMatrix = () => {
  const {
    state: { accessType, roles },
    setState,
  } = useGlobalContext();
  const [selectedRole, setSelectedRole] = useState('');

  const CLUSTER_ACCESS_COLUMNS = [
    {
      label: 'Cluster Access',
      renderCell: item => <TextRender text={item.cluster_name} />,
      width: '50%',
    },
    {
      label: (
        <GroupColumn>
          <Select onChange={event => setSelectedRole(event.target.value)}>
            {roles?.map(g => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
          <IconButton
            onClick={() => setState(prev => ({ ...prev, roleModal: true }))}
          >
            <PencilIcon width={16} height={16} />
          </IconButton>
        </GroupColumn>
      ),
      renderCell: item => (
        <CheckboxField
          name="role"
          checked={item.roles.map(g => g.role_id).includes(selectedRole)}
        />
      ),
      width: '50%',
    },
  ];

  const DFM_ACCESS_COLUMNS = [
    {
      label: 'DFM Access',
      renderCell: item => (
        <Capitalize text={item.policy_name?.replaceAll('_', ' ')} />
      ),
      width: '50%',
    },
    {
      label: (
        <GroupColumn>
          <Select onChange={event => setSelectedRole(event.target.value)}>
            {roles.map(g => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
          <IconButton
            onClick={() => setState(prev => ({ ...prev, roleModal: true }))}
          >
            <PencilIcon width={16} height={16} />
          </IconButton>
        </GroupColumn>
      ),
      renderCell: item => (
        <CheckboxField
          name="role"
          checked={item.roles.map(g => g.role_id).includes(selectedRole)}
        />
      ),
      width: '50%',
    },
  ];

  const fetchRoles = async () => {
    const response = await getRoles();
    setState(prev => ({
      ...prev,
      roles: response.data || [],
    }));
    setSelectedRole(response.data[0].id);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <Grid
      module={
        accessType === 'cluster_access' ? 'clustersAccess' : 'policiesAccess'
      }
      title="Role Management"
      columns={
        accessType === 'cluster_access'
          ? CLUSTER_ACCESS_COLUMNS
          : DFM_ACCESS_COLUMNS
      }
      placeholder="Search cluster name..."
      addModal={
        accessType === 'cluster_access' ? EditPermissions : EditPolicies
      }
    />
  );
};

PropTypes.propTypes = {
  data: PropTypes.array,
};
