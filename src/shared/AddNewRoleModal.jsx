import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from './Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InputField } from './FormInputs';
import { UserIcon } from '../assets';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RolesActions, RolesSelectors } from '../store/roles';

const RoleFormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
// Validation schema using yup
const schema = yup.object().shape({
  roleName: yup.string().required('Role Name is required'),
});

const AddNewRoleModal = () => {
  const dispatch = useDispatch();
  const openRoleModal = useSelector(RolesSelectors.getRoleModal);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = data => {
    const payload = {
      name: data.roleName,
    };
    dispatch(RolesActions.createNewRole(payload));
  };

  return (
    <Modal
      title="Add New Role"
      isOpen={openRoleModal}
      onRequestClose={() => {
        dispatch(RolesActions.roleModal());
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
      </RoleFormContainer>
    </Modal>
  );
};

// Adding PropTypes for type checking
AddNewRoleModal.propTypes = {
  openRoleModal: PropTypes.bool.isRequired,
  setOpenRoleModal: PropTypes.func.isRequired,
};

export default AddNewRoleModal;
