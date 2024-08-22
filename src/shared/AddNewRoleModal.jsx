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
// import { RolesActions, RolesSelectors, LoadingSelectors } from '../store/roles';
import { RolesActions, RolesSelectors, LoadingSelectors } from '../store';

const RoleFormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const schema = yup.object().shape({
  roleName: yup.string().required('Role Name is required'),
});

const AddNewRoleModal = ({ selectedOption, ldapGroupName }) => {
  console.log(ldapGroupName, 'lll');
  const dispatch = useDispatch();
  const openRoleModal = useSelector(RolesSelectors.getRoleModal);
  console.log(selectedOption, 'data');
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
    console.log(data);
    const payload = {
      name: data.roleName,
      ldapGroupName: ldapGroupName,
    };
    dispatch(RolesActions.createNewRole(payload));
  };

  useEffect(() => {
    if (selectedOption) {
      reset({ roleName: selectedOption });
    }
  }, [reset, selectedOption]);

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
      loading={loading}
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

AddNewRoleModal.propTypes = {
  selectedOption: PropTypes.string,
  setOpenRoleModal: PropTypes.func.isRequired,
  ldapGroupName: PropTypes.string,
};

export default AddNewRoleModal;
