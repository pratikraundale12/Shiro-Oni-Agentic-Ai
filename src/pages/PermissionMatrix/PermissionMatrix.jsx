import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Grid, IconButton, TextRender } from '../../components';
import { EditClusterAccess } from './EditClusterAccess';
import { CheckboxField } from '../../shared';
import { PencilIcon } from '../../assets';
import { EditPolicies } from './EditPolicies';
import { RolesActions, RolesSelectors } from '../../store';
import { useDispatch, useSelector } from 'react-redux';

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
  const dispatch = useDispatch();
  const roles = useSelector(RolesSelectors.getRoles);
  const selectedRole = useSelector(RolesSelectors.getSelectedRole);
  const accessType = useSelector(RolesSelectors.getAccessType);

  const onChange = event =>
    dispatch(RolesActions.setSelectedRole(event.target.value));

  const CLUSTER_ACCESS_COLUMNS = [
    {
      label: 'Cluster Access',
      renderCell: item => <TextRender text={item.cluster_name} />,
      width: '50%',
    },
    {
      label: (
        <GroupColumn>
          <Select onChange={onChange}>
            {roles?.map(g => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
          <IconButton
          // onClick={() => setState(prev => ({ ...prev, roleModal: true }))}
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
          <Select onChange={onChange}>
            {roles.map(g => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </Select>
          <IconButton
          // onClick={() => setState(prev => ({ ...prev, roleModal: true }))}
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

  useEffect(() => {
    dispatch(RolesActions.fetchRoles());
  }, [dispatch]);

  if (accessType.value === 'dfm_access') {
    return (
      <Grid
        module="policiesRolesAccess"
        title="Role Management"
        columns={DFM_ACCESS_COLUMNS}
        placeholder="Search cluster name..."
        addModal={EditPolicies}
      />
    );
  }

  return (
    <Grid
      module="clustersRolesAccess"
      title="Role Management"
      columns={CLUSTER_ACCESS_COLUMNS}
      placeholder="Search cluster name..."
      addModal={EditClusterAccess}
    />
  );
};

PropTypes.propTypes = {
  data: PropTypes.array,
};
