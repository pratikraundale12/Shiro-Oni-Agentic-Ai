import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { MailIcon, PhoneIcon, PlusCircleIcon, UserIcon } from '../../assets';
import {
  editUserSchema,
  userSchema,
} from '../../components/UserManagement/userValidation';
import { API_URL } from '../../constants';
import { Button, InputField, Modal, PasswordField } from '../../shared';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  GridActions,
  RolesActions,
  UsersActions,
  UsersSelectors,
} from '../../store';
import { createUserApi, editUserDataApi } from '../../store/index1';
import { useGlobalContext } from '../../utils';
import { ProfileUpload } from './ProfileUpload';

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
  margin-top: 10px;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
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

const StyledPasswordField = styled(PasswordField)`
  margin-bottom: 0.4rem;
`;

export const AddUserModal = props => {
  const dispatch = useDispatch();
  // const roles = useSelector(RolesSelectors.getRoles);
  const { state, setState } = useGlobalContext();
  const currentUser = state.currentUser;
  const currentUserData = useSelector(AuthenticationSelectors.getCurrentUser);
  const userModalOpen = useSelector(UsersSelectors.getUserModalOpen);
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

  const openModal = () => {
    setState({ ...state, userModal: true });
    dispatch(UsersActions.setUserModalOpen(true));
  };
  const closeModal = () => {
    setState({
      ...state,
      userModal: false,
      selectedItem: null,
    });
    dispatch(UsersActions.setUserModalOpen(false));
  };

  const password = watch('password');

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('first_name', data.first_name);
    formData.append('middle_name', data.middle_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    if (data.role === 'superadmin' && data?.password) {
      formData.append('password', data.password);
    }
    formData.append('phone', data.phone || null);
    formData.append('is_active', data.is_active !== false);
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
        dispatch(UsersActions.setUserModalOpen(false));
      } else {
        toast.error(response.message);
      }
    } else {
      const response = await editUserDataApi(state.selectedItem?.id, formData);
      if (response.status == 200) {
        dispatch(GridActions.fetchGrid({ module: 'users' }));
        (state?.label == 'Profile' ||
          response?.data?.id == currentUserData?.id) &&
          dispatch(AuthenticationActions.setCurrentUser(response?.data));
        toast.success('User Updated Successfully');
        setState({
          ...state,
          userModal: false,
          selectedItem: null,
        });
        dispatch(UsersActions.setUserModalOpen(false));
        if (response?.data?.id == currentUser?.id) {
          setState({
            ...state,
            currentUser: response.data,
            userModal: false,
            selectedItem: null,
          });
          dispatch(UsersActions.setUserModalOpen(false));
        }
      } else {
        toast.error(response.message);
      }
    }
  };

  useEffect(() => {
    dispatch(RolesActions.fetchRoles());

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
        title={state.selectedItem ? `Edit ${state.label}` : 'Add New User'}
        isOpen={userModalOpen}
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
            disabled={
              currentUserData?.role === 'superadmin' &&
              currentUserData?.id === state?.selectedItem?.id
                ? false
                : state.selectedItem
            }
          />
        </ImageContainer>
        <Continer>
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
                    disabled={
                      currentUserData?.role === 'superadmin' &&
                      currentUserData?.id === state?.selectedItem?.id
                        ? false
                        : state.selectedItem
                    }
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
                    disabled={
                      currentUserData?.role === 'superadmin' &&
                      currentUserData?.id === state?.selectedItem?.id
                        ? false
                        : state.selectedItem
                    }
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
                    disabled={
                      currentUserData?.role === 'superadmin' &&
                      currentUserData?.id === state?.selectedItem?.id
                        ? false
                        : state.selectedItem
                    }
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
                    disabled={
                      currentUserData?.role === 'superadmin' &&
                      currentUserData?.id === state?.selectedItem?.id
                        ? false
                        : state.selectedItem
                    }
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
                    disabled={
                      currentUserData?.role === 'superadmin' &&
                      currentUserData?.id === state?.selectedItem?.id
                        ? false
                        : state.selectedItem
                    }
                  />
                </div>
                {currentUserData.role === 'superadmin' && (
                  <>
                    {currentUserData?.id === state?.selectedItem?.id && (
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
                    )}
                    {(currentUserData?.id === state?.selectedItem?.id ||
                      password) && (
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
                  </>
                )}
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
                  <StyledInputField
                    name="phone"
                    type="text"
                    label="Mobile Number"
                    placeholder="Enter Mobile No"
                    register={register}
                    errors={errors}
                    icon={<PhoneIcon />}
                    disabled={
                      currentUserData?.role === 'superadmin' &&
                      currentUserData?.id === state?.selectedItem?.id
                        ? false
                        : state.selectedItem
                    }
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
