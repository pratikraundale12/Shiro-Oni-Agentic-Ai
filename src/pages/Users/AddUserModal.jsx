import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { toast } from 'react-toastify';

import {
  Button,
  InputField,
  Modal,
  SelectField,
  PasswordField,
  PhoneField,
} from '../../shared';
import { PlusCircleIcon, UserIcon, MailIcon, PhoneIcon } from '../../assets';
import { createUserApi, editUserDataApi } from '../../utils/services';
import { API_URL, fetchGridData, useGlobalContext } from '../../utils';
import {
  userSchema,
  editUserSchema,
} from '../../components/UserManagement/userValidation';
import { ProfileUpload } from './ProfileUpload';
import { theme } from '../../styles';

const DEFAULT_VALUES = {
  username: '',
  email: '',
  first_name: '',
  middle_name: '',
  last_name: '',
  password: '',
  is_active: '',
  type: '',
  photo: '',
  phone: '',
  confirm_password: '',
};

const Continer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SelectFieldWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const FormWrapper = styled.div`
  width: 100%;
`;

const FormTitle = styled.h3`
  background-color: ${props => props.theme.colors.lightGrey};
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 14px;
  font-weight: 600;
  height: 44px;
  padding: 16px;
`;

const FormSection = styled.div`
  display: grid;
  gap: 1%;
  grid-template-columns: 32% 32% 32%;
  justify-content: center;
  padding: 0.8rem 0;
  border: 1px solid ${props => props.theme.colors.border};
  border-top: none;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
`;

const StyledInputField = styled(InputField)`
  margin-bottom: 0.4rem;
`;

const StyledSelectField = styled(SelectField)`
  margin-bottom: 0.9rem;
`;

const StyledPasswordField = styled(PasswordField)`
  margin-bottom: 0.4rem;
`;

const StyledPhoneField = styled(PhoneField)`
  margin-bottom: 0.4rem;
`;

const DropDownWrapper = styled.div`
  width: 15%;
  margin-right: 10px;
`;

export const AddUserModal = props => {
  const { state, setState } = useGlobalContext();
  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    resolver: yupResolver(
      isEmpty(state?.selectedItem) ? userSchema : editUserSchema
    ),
  });

  const openModal = () => setState({ ...state, userModal: true });
  const closeModal = () => {
    setState({
      ...state,
      userModal: false,
      selectedItem: null,
    });
  };

  const password = watch('password');
  const statusOption = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
  ];
  const roleOption = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ];

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('middle_name', data.middle_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phone', data.phone_number);
    formData.append('is_active', data.is_active !== false);
    formData.append('type', data?.type || 'user');
    formData.append('username', data.username);
    if (data.photo && data.photo.size > 0) {
      formData.append('photo', data.photo);
    }

    if (isEmpty(state.selectedItem)) {
      const response = await createUserApi(formData);
      if (response.status == 201) {
        fetchGridData({ setState, module: 'users' });
        toast.success('User Created Successfully');
        setState({
          ...state,
          userModal: false,
          selectedItem: null,
        });
      } else {
        toast.error(response.message);
      }
    } else {
      const response = await editUserDataApi(state.selectedItem?.id, formData);
      if (response.status == 200) {
        fetchGridData({ setState, module: 'users' });
        toast.success('User Updated Successfully');
        setState({
          ...state,
          userModal: false,
          selectedItem: null,
        });
      } else {
        toast.error(response.message);
      }
    }
  };

  useEffect(() => {
    if (state.userModal) {
      if (isEmpty(state.selectedItem)) reset(DEFAULT_VALUES);
      else reset(state.selectedItem);
    }
  }, [reset, state.userModal, state.selectedItem]);

  return (
    <div {...props}>
      <Button
        icon={<PlusCircleIcon width={20} height={20} color="white" />}
        onClick={openModal}
      >
        Add New User
      </Button>
      <Modal
        size="lg"
        title={state.selectedItem ? 'Edit User' : 'Add New User'}
        isOpen={state.userModal}
        onRequestClose={closeModal}
        secondaryButtonText="Cancel"
        primaryButtonText="Submit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ImageContainer>
          <ProfileUpload
            name="photo"
            control={control}
            watch={watch}
            setValue={setValue}
            errors={errors}
            url={`${API_URL}${state.selectedItem?.photo}`}
          />
        </ImageContainer>
        <Continer>
          <SelectFieldWrapper>
            <DropDownWrapper>
              <StyledSelectField
                name="is_active"
                size="sm"
                options={statusOption}
                errors={errors}
                control={control}
                placeholder="Status"
                backgroundColor={theme.colors.lightGrey}
                label="Status"
              />
            </DropDownWrapper>
            <DropDownWrapper>
              <StyledSelectField
                name="type"
                size="sm"
                options={roleOption}
                errors={errors}
                control={control}
                placeholder="Role"
                backgroundColor={theme.colors.lightGrey}
                label="Role"
              />
            </DropDownWrapper>
          </SelectFieldWrapper>
          <FormWrapper>
            <FormTitle>User Information</FormTitle>
            <FormSection>
              <StyledInputField
                name="first_name"
                type="text"
                label="First Name"
                placeholder="Enter your First Name"
                required
                register={register}
                errors={errors}
                icon={<UserIcon />}
              />
              <StyledInputField
                name="middle_name"
                type="text"
                label="Middle Name"
                placeholder="Enter your Middle Name"
                register={register}
                errors={errors}
                icon={<UserIcon />}
              />
              <StyledInputField
                name="last_name"
                type="text"
                label="Last Name"
                placeholder="Enter your Last Name"
                required
                register={register}
                errors={errors}
                icon={<UserIcon />}
              />
              <StyledInputField
                name="username"
                type="text"
                label="User Name"
                placeholder="Enter your User Name"
                required
                register={register}
                errors={errors}
                icon={<UserIcon />}
              />
              <StyledInputField
                name="email"
                type="email"
                label="E-mail Address"
                placeholder="Enter your First Name"
                required
                register={register}
                errors={errors}
                icon={<MailIcon />}
              />
              <StyledPasswordField
                name="password"
                register={register}
                required
                errors={errors}
                watch={watch}
                label="Password"
              />
              {(!state?.selectedItem || password) && (
                <StyledPasswordField
                  name="confirm_password"
                  register={register}
                  errors={errors}
                  watch={watch}
                  required
                  label="Confirm Password"
                />
              )}
              <StyledPhoneField
                name="phone_number"
                errors={errors}
                control={control}
                icon={<PhoneIcon />}
              />
            </FormSection>
          </FormWrapper>
        </Continer>
      </Modal>
    </div>
  );
};
