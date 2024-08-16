import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { Button, InputField, Modal, SelectField } from '../../shared';
import { useGlobalContext } from '../../utils';
import { PlusCircleIcon, UserIcon } from '../../assets';
import {
  ClustersActions,
  ClustersSelectors,
  RolesActions,
  RolesSelectors,
} from '../../store';

const TableContainer = styled.div`
  flex: 1;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  tr {
    &:nth-of-type(even) {
      background-color: #f5f7fa;
    }

    td:first-child {
      padding: 1rem 0;
      padding-left: 1rem;
      width: 15%;
      min-width: 15%;
      max-width: 15%;
      text-transform: capitalize;
    }
    td:last-child {
      padding: 1rem 0;
      padding-right: 1rem;
      min-width: 85%;
      max-width: 85%;
    }
  }
`;

const StyledSelectField = styled(SelectField)`
  margin-bottom: 0;

  .react-select__control {
    border-radius: 8px;
  }

  .react-select__value-container {
    padding: 2px;
  }

  .react-select__multi-value {
    background-color: ${props => props.theme.colors.lightGrey};
    border-radius: 6px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

const RoleFormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const EditClusterAccess = () => {
  const dispatch = useDispatch();
  const {
    state: { roleModal },
    setState,
  } = useGlobalContext();
  const {
    register,
    formState: { errors },
  } = useForm();
  const roles = useSelector(RolesSelectors.getRoles);
  const clusters = useSelector(ClustersSelectors.getClusters);
  const clustersAccess = useSelector(RolesSelectors.getRolesClusters);
  const permissionModal = useSelector(RolesSelectors.getPermissionModal);
  const [updatedClustersAccess, setUpdatedClustersAccess] = useState([]);

  const handlePermissionModal = () => dispatch(RolesActions.permissionModal());

  const openRoleModal = () => setState(prev => ({ ...prev, roleModal: true }));
  const closeRoleModal = () =>
    setState(prev => ({
      ...prev,
      roleModal: false,
    }));

  const handleChange = (role, value) => {
    setUpdatedClustersAccess(prev =>
      prev.map(item =>
        item.role_id === role.id ? { ...item, clusters: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    const payload = { add: [], remove: [] };
    updatedClustersAccess.forEach(item => {
      const updated = item.clusters;
      const updatedIds = updated?.map(c => c.value);
      const previousclustersAccess = clustersAccess.find(
        role => role.role_id === item.role_id
      )?.clusters;
      const previousclustersAccessIds = previousclustersAccess?.map(
        c => c.value
      );
      const added = updated.filter(
        c => !previousclustersAccessIds?.includes(c.value)
      );
      const removed = previousclustersAccess?.filter(
        c => !updatedIds?.includes(c.value)
      );

      if (added?.length > 0) {
        added.forEach(c => {
          payload.add.push({
            role_id: item.role_id,
            cluster_id: c.value,
          });
        });
      }

      if (removed?.length > 0) {
        removed.forEach(c => {
          payload.remove.push({
            role_id: item.role_id,
            cluster_id: c.value,
          });
        });
      }
    });

    dispatch(RolesActions.updateRolesClusters(payload));
  };

  useEffect(() => {
    dispatch(ClustersActions.fetchClusterList());
    dispatch(RolesActions.fetchRolesClusters());
  }, [dispatch]);

  useEffect(() => {
    setUpdatedClustersAccess(clustersAccess);
  }, [clustersAccess]);

  return (
    <div>
      <ButtonContainer>
        <Button
          onClick={openRoleModal}
          variant="secondary"
          size="sm"
          icon={<PlusCircleIcon />}
        >
          Add New Role
        </Button>
        <Button onClick={handlePermissionModal} size="sm">
          Edit Permissions
        </Button>
      </ButtonContainer>
      <Modal
        title="Edit Cluster Permissions"
        isOpen={permissionModal}
        onRequestClose={handlePermissionModal}
        secondaryButtonText="Back"
        primaryButtonText="Submit"
        footerAlign="start"
        contentStyles={{
          minHeight: '75%',
          minWidth: '60%',
          maxHeight: '75%',
          maxWidth: '60%',
        }}
        onSubmit={handleSubmit}
      >
        <TableContainer>
          <Table>
            <tbody>
              {roles.map(role => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>
                    <StyledSelectField
                      value={
                        updatedClustersAccess.find(
                          item => item.role_id === role.id
                        )?.clusters
                      }
                      onChange={value => handleChange(role, value)}
                      options={clusters}
                      size="sm"
                      isMulti
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Modal>
      <Modal
        title="Add New Role"
        isOpen={roleModal}
        onRequestClose={closeRoleModal}
        secondaryButtonText="Back"
        primaryButtonText="Submit"
        onSubmit={() => null}
        footerAlign="start"
        contentStyles={{
          minHeight: '50%',
          minWidth: '30%',
          maxHeight: '50%',
          maxWidth: '30%',
        }}
      >
        <RoleFormContainer>
          <InputField
            label="Role Name"
            name="roleName"
            placeholder="Enter Role Name"
            icon={<UserIcon />}
            register={register}
            errors={errors}
          />
          <InputField
            label="LDAP Role Name"
            name="ldapRoleName"
            placeholder="Enter LDAP Role Name"
            icon={<UserIcon />}
            register={register}
            errors={errors}
          />
        </RoleFormContainer>
      </Modal>
    </div>
  );
};

EditClusterAccess.propTypes = {};
