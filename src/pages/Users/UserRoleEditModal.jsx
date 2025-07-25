import PropTypes from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { Modal } from '../../shared';
import { useDispatch, useSelector } from 'react-redux';
import {
  LoadingSelectors,
  RolesSelectors,
  UsersActions,
  UsersSelectors,
} from '../../store';
import RegistryMultiSelect from '../SettingPage/Multiselect';
import { useForm } from 'react-hook-form';
import { isEmpty, isEqual, sortBy } from 'lodash';
import { FullPageLoader } from '../../components';
import { SettingsActions } from '../../store/settings';
import { toast } from 'react-toastify';

export const UserRoleEditModal = ({ setRemoveSearch }) => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(UsersSelectors.getUserRoleEditModalOpen);
  const selectedUser = useSelector(UsersSelectors.getSingleUserForEdit);
  const { control, handleSubmit, reset, watch } = useForm();
  const roles = useSelector(RolesSelectors.getRoles);
  const currentSelected = watch('multiselect');

  const ROLES_OPTIONS = useMemo(() => {
    return roles?.map(ele => ({
      label: ele?.name,
      value: ele?.role_id,
    }));
  }, [roles]);

  const defaultSelectedRoles = useMemo(() => {
    if (!selectedUser?.role || !roles?.length) return [];

    return selectedUser?.role
      .map(role => {
        const matched = roles.find(r => r.role_id === role.role_id);
        return matched
          ? { label: matched.name, value: matched.role_id }
          : { label: role.role_name, value: role.role_id }; // fallback
      })
      .filter(Boolean);
  }, [selectedUser, roles]);

  useEffect(() => {
    if (selectedUser && roles?.length) {
      reset({
        multiselect: defaultSelectedRoles,
      });
    }
  }, [selectedUser, roles, reset, defaultSelectedRoles]);

  const areEqual = isEqual(
    sortBy(defaultSelectedRoles),
    sortBy(currentSelected)
  );

  const onSubmit = data => {
    const selectedIds = data?.multiselect?.map(ele => ele?.value);
    if (isEmpty(selectedIds)) {
      toast.info('Atleast one role must be selected.');
      return;
    }
    dispatch(
      SettingsActions.assignKeycloakRolesToUsers({
        isSingleRoleUpdate: true,
        users: [
          {
            username: selectedUser?.username,
            email: selectedUser?.email,
            first_name: selectedUser?.first_name,
            last_name: selectedUser?.last_name,
            role_ids: selectedIds,
          },
        ],
      })
    );
    setRemoveSearch(true);
  };

  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'assignKeycloakRolesToUsers')
  );

  return (
    <>
      <FullPageLoader loading={loading} />
      <Modal
        title={`${selectedUser?.first_name || ''} ${selectedUser?.middle_name || ''} ${selectedUser?.last_name || ''}: Role Edit`}
        isOpen={isModalOpen}
        onRequestClose={() =>
          dispatch(UsersActions.setuserRoleEditModalOpen(false))
        }
        size="sm"
        secondaryButtonText="Back"
        primaryButtonText={'Submit'}
        primaryButtonDisabled={areEqual}
        onSubmit={handleSubmit(onSubmit)}
        footerAlign="start"
        contentStyles={{ minWidth: '30%' }}
        primaryButtonProps={{ id: 'enable-cluster-submit-btn' }}
      >
        <div style={{ height: '300px' }}>
          <RegistryMultiSelect
            enableCheckboxes
            control={control}
            name={`multiselect`}
            placeholder={'Select Role'}
            options={ROLES_OPTIONS || []}
            customOnChange={(hookFormOnChange, selected) => {
              hookFormOnChange(selected);
            }}
          />
        </div>
      </Modal>
    </>
  );
};

UserRoleEditModal.propTypes = {
  setRemoveSearch: PropTypes.func,
};
