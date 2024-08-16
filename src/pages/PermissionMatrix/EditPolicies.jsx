import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import { Button, InputField, Modal, SelectField } from '../../shared';
import { useGlobalContext } from '../../utils';
import { UserIcon } from '../../assets';
import {
  RolesSelectors,
  PoliciesActions,
  PoliciesSelectors,
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

export const EditPolicies = () => {
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
  const policies = useSelector(PoliciesSelectors.getPolicies);
  const policiesAccess = useSelector(PoliciesSelectors.getRolesPolicies);
  const permissionModal = useSelector(PoliciesSelectors.getPermissionModal);
  const [updatedPoliciesAccess, setUpdatedPoliciesAccess] = useState([]);

  const handlePermissionModal = () =>
    dispatch(PoliciesActions.permissionModal());

  // const openRoleModal = () => setState(prev => ({ ...prev, roleModal: true }));
  const closeRoleModal = () =>
    setState(prev => ({
      ...prev,
      roleModal: false,
    }));

  const handleChange = (role, value) => {
    setUpdatedPoliciesAccess(prev =>
      prev.map(item =>
        item.role_id === role.id ? { ...item, policies: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    const payload = { add: [], remove: [] };
    updatedPoliciesAccess.forEach(item => {
      const updated = item.policies;
      const updatedIds = updated?.map(c => c.value);
      const previousPoliciesAccess = policiesAccess.find(
        role => role.role_id === item.role_id
      )?.policies;
      const previousPoliciesAccessIds = previousPoliciesAccess?.map(
        c => c.value
      );
      const added = updated.filter(
        c => !previousPoliciesAccessIds?.includes(c.value)
      );
      const removed = previousPoliciesAccess?.filter(
        c => !updatedIds?.includes(c.value)
      );

      if (added?.length > 0) {
        added.forEach(c => {
          payload.add.push({
            role_id: item.role_id,
            policy_id: c.value,
          });
        });
      }

      if (removed?.length > 0) {
        removed.forEach(c => {
          payload.remove.push({
            role_id: item.role_id,
            policy_id: c.value,
          });
        });
      }
    });

    dispatch(PoliciesActions.updateRolesPolicies(payload));
  };

  useEffect(() => {
    dispatch(PoliciesActions.fetchPolicies());
    dispatch(PoliciesActions.fetchRolesPolicies());
  }, [dispatch]);

  useEffect(() => {
    setUpdatedPoliciesAccess(policiesAccess);
  }, [policiesAccess]);

  console.log(policiesAccess, updatedPoliciesAccess, policies);
  return (
    <div>
      <ButtonContainer>
        {/* <Button
          onClick={openRoleModal}
          variant="secondary"
          size="sm"
          icon={<PlusCircleIcon />}
        >
          Add New Role
        </Button> */}
        <Button onClick={handlePermissionModal} size="sm">
          Edit Permissions
        </Button>
      </ButtonContainer>
      <Modal
        title="Edit DFM Permissions"
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
                        updatedPoliciesAccess.find(
                          item => item.role_id === role.id
                        )?.policies
                      }
                      onChange={value => handleChange(role, value)}
                      options={policies}
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

EditPolicies.propTypes = {};
