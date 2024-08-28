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
import { createUserApi, editUserDataApi } from '../../store/index1';
import { useGlobalContext } from '../../utils';
import {
  userSchema,
  editUserSchema,
} from '../../components/UserManagement/userValidation';
import { ProfileUpload } from './ProfileUpload';
import { theme } from '../../styles';
import { API_URL } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { GridActions, RolesSelectors } from '../../store';

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
  margin-top: 20px;
`;

const FormWrapper = styled.div`
  width: 100%;
`;

const FormTitle = styled.h5`
  background-color: ${props => props.theme.colors.lightGrey};
  color: ${props => props.theme.colors.darker};
  font-family: ${props => props.theme.fontNato};
  font-size: 16px;
  font-weight: 600;
  padding: 26px 16px;
  line-height: 13px;
`;

const FormSection = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-top: none;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  max-width: 100%;
  padding-top: 1rem;
  // .form-ele {
  //   min-height: 100px;
  // }
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
  min-width: 15%;
  margin-right: 10px;
`;

export const AddUserModal = props => {
  const dispatch = useDispatch();
  const roles = useSelector(RolesSelectors.getRoles);
  const { state, setState } = useGlobalContext();
  const currentUser = state.currentUser;
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
  const rolesOption = roles?.map(role => ({
    value: role.role_id,
    label: role.name,
  }));

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('middle_name', data.middle_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phone', data.phone_number);
    formData.append('is_active', data.is_active !== false);
    formData.append('role_id', data?.role_id);
    formData.append('username', data.username);
    if (data.photo && data.photo.size > 0) {
      formData.append('photo', data.photo);
    }
    if (state.selectedItem && !data.photo) {
      formData.append('photo', null);
    }

    if (isEmpty(state.selectedItem)) {
      const response = await createUserApi(formData);
      if (response.status == 201) {
        dispatch(GridActions.fetchGrid({ module: 'users' }));
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
        dispatch(GridActions.fetchGrid({ module: 'users' }));
        toast.success('User Updated Successfully');
        setState({
          ...state,
          userModal: false,
          selectedItem: null,
        });
        if (response?.data?.id == currentUser?.id) {
          setState({
            ...state,
            currentUser: response.data,
            userModal: false,
            selectedItem: null,
          });
        }
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
        icon={<PlusCircleIcon width={16} height={16} color="white" />}
        onClick={openModal}
        size="sm"
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
        footerAlign="start"
        contentStyles={{ minWidth: '65%' }}
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
                title="Select Status"
              />
            </DropDownWrapper>
            <DropDownWrapper>
              <StyledSelectField
                name="role_id"
                size="sm"
                options={rolesOption}
                errors={errors}
                control={control}
                placeholder="Role"
                backgroundColor={theme.colors.lightGrey}
                title="Select Role"
              />
            </DropDownWrapper>
          </SelectFieldWrapper>
          <FormWrapper>
            <FormTitle className="mb-0">User Information</FormTitle>
            <FormSection className="container">
              <div className="row">
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
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
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
                  <StyledInputField
                    name="middle_name"
                    type="text"
                    label="Middle Name"
                    placeholder="Enter your Middle Name"
                    register={register}
                    errors={errors}
                    icon={<UserIcon />}
                  />
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
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
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
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
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
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
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
                  <StyledPasswordField
                    name="password"
                    register={register}
                    required
                    errors={errors}
                    watch={watch}
                    label="Password"
                  />
                </div>
                {(!state?.selectedItem || password) && (
                  <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
                    <StyledPasswordField
                      name="confirm_password"
                      register={register}
                      errors={errors}
                      watch={watch}
                      required
                      label="Confirm Password"
                    />
                  </div>
                )}
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
                  <StyledPhoneField
                    name="phone_number"
                    errors={errors}
                    control={control}
                    register={register}
                    icon={<PhoneIcon />}
                  />
                </div>
              </div>
            </FormSection>
          </FormWrapper>
        </Continer>
      </Modal>
    </div>
  );
};
