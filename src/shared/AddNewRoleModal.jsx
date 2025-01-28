import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from './Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InputField } from './FormInputs';
import { UserIcon } from '../assets';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RolesActions, RolesSelectors, LoadingSelectors } from '../store';
import { isEmpty } from 'lodash';

const RoleFormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const schema = yup.object().shape({
  roleName: yup
    .string()
    .required('Role Name is required')
    .max(30, 'Role Name cannot exceed 30 characters')
    .matches(
      /^[A-Za-z]+( [A-Za-z]+)*$/,
      'Role Name must contain only letters and spaces'
    ),
});

const AddNewRoleModal = ({ selectedOption, ldapGroupName }) => {
  const dispatch = useDispatch();
  const openRoleModal = useSelector(RolesSelectors.getRoleModal);
  const selectedItem = useSelector(RolesSelectors.getRoleListSelectedItem);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { roleName: selectedOption || '' },
  });
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'createNewRole')
  );

  const onSubmit = data => {
    if (!isEmpty(selectedItem)) {
      dispatch(RolesActions.editRole({ name: data?.roleName }));
      dispatch(RolesActions.setIsRoleListModalOpen(true));
      return;
    }
    const payload = {
      name: data.roleName,
      ldapGroupName: ldapGroupName,
    };

    dispatch(RolesActions.createNewRole(payload));
    dispatch(RolesActions.roleModal(false));
  };

  useEffect(() => {
    if (selectedOption) {
      reset({ roleName: selectedOption });
    }
  }, [reset, selectedOption]);

  useEffect(() => {
    if (!isEmpty(selectedItem)) {
      reset({ roleName: selectedItem?.name });
    }
  }, [reset, selectedItem]);

  const capitalizeFirstLetter = text => {
    if (!text) return '';

    text = text.toLowerCase();

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Modal
      title={
        isEmpty(selectedItem)
          ? 'Add New Role'
          : `Edit ${capitalizeFirstLetter(selectedItem?.name)}`
      }
      isOpen={openRoleModal}
      onRequestClose={() => {
        dispatch(RolesActions.roleModal(false));
        dispatch(RolesActions.setIsRoleListModalOpen(true));
      }}
      secondaryButtonText="Back"
      primaryButtonText="Submit"
      onSubmit={handleSubmit(onSubmit)}
      footerAlign="start"
      contentStyles={{
        minHeight: '30%',
        minWidth: '30%',
        maxHeight: '50%',
        maxWidth: '30%',
      }}
      loading={loading}
    >
      <RoleFormContainer>
        <InputField
          label="Role Name"
          name="roleName"
          placeholder="Enter Role Name "
          icon={<UserIcon />}
          register={register}
          required={true}
          errors={errors}
        />
      </RoleFormContainer>
    </Modal>
  );
};

AddNewRoleModal.propTypes = {
  selectedOption: PropTypes.string,
  setOpenRoleModal: PropTypes.func.isRequired,
  ldapGroupName: PropTypes.string,
};

export default AddNewRoleModal;
