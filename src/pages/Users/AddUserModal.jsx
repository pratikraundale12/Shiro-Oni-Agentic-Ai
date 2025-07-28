import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import { useDispatch, useSelector } from 'react-redux';
import { MailIcon, PhoneIcon, PlusCircleIcon, UserIcon } from '../../assets';
import {
  editUserSchema,
  userSchema,
} from '../../components/UserManagement/userValidation';
import { ACCESS_TOKEN, API_URL } from '../../constants';
import { Button, InputField, Modal, PasswordField } from '../../shared';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  GridActions,
  RolesSelectors,
  UsersActions,
  UsersSelectors,
} from '../../store';
import { createUserApi, editUserDataApi } from '../../store/index1';
import { useGlobalContext } from '../../utils';
import { ProfileUpload } from './ProfileUpload';
import MultiselectRoles from '../../shared/FormInputs/components/MultiselectFieldRole.jsx';

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

const DivLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const StyledInputField = styled(InputField)`
  margin-bottom: 0.4rem;
`;

const StyledPasswordField = styled(PasswordField)`
  margin-bottom: 0.4rem;
`;

export const AddUserModal = props => {
  const dispatch = useDispatch();
  const { state, setState } = useGlobalContext();
  const currentUser = state.currentUser;
  const currentUserData = useSelector(AuthenticationSelectors.getCurrentUser);
  const userModalOpen = useSelector(UsersSelectors.getUserModalOpen);
  const addUserCheck = useSelector(UsersSelectors.getAddNewUser);
  const userSchemaProvider = () => {
    return isEmpty(state?.selectedItem) ? userSchema : editUserSchema;
  };
  const roles = useSelector(RolesSelectors.getRoles);
  const ROLES_OPTIONS = useMemo(() => {
    return roles?.map(ele => ({
      label: ele?.name,
      value: ele?.role_id,
    }));
  }, [roles]);

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
    resolver: yupResolver(userSchemaProvider()),
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
    reset(DEFAULT_VALUES);
    dispatch(UsersActions.setAddNewUser(false));
  };

  const password = watch('password');

  const createFormData = data => {
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
    } else if (state.selectedItem && !data.photo) {
      formData.append('photo', null);
    }
    return formData;
  };

  const handleApiResponse = (response, successMessage) => {
    if (response.status === 200 || response.status === 201) {
      if (
        currentUserData?.permissions?.some(perm =>
          ['view_user', 'view_namespace'].includes(perm)
        )
      ) {
        dispatch(GridActions.fetchGrid({ module: 'users' }));
      }
      toast.success(successMessage);
      setState(prevState => ({
        ...prevState,
        userModal: false,
        selectedItem: null,
      }));
      dispatch(UsersActions.setUserModalOpen(false));
      return true;
    }
    toast.error(response.message);
    return false;
  };

  const onSubmit = async data => {
    if (addUserCheck) {
      const rolesArr = data?.role && data?.role?.map(ele => ele?.value);

      const formData = new FormData();
      formData.append('first_name', data?.first_name);
      formData.append('middle_name', data?.middle_name);
      formData.append('last_name', data?.last_name);
      formData.append('email', data?.email);
      formData.append('phone', data?.phone || null);
      formData.append('is_active', true);
      formData.append('username', data?.username);
      formData.append('role_ids', rolesArr);
      if (data?.photo && data?.photo?.size > 0) {
        formData.append('photo', data.photo);
      } else if (state.selectedItem && !data.photo) {
        formData.append('photo', null);
      }
      dispatch(UsersActions.createUserByDFM(formData));
      return;
    }
    const formData = createFormData(data);

    if (isEmpty(state.selectedItem)) {
      const response = await createUserApi(formData);
      handleApiResponse(response, 'User Created Successfully');
    } else {
      const response = await editUserDataApi(state.selectedItem?.id, formData);
      if (handleApiResponse(response, 'User Updated Successfully')) {
        if (
          state?.label === 'Profile' ||
          response?.data?.id === currentUserData?.id
        ) {
          dispatch(AuthenticationActions.setCurrentUser(response?.data));
        }
        if (response?.data?.id === currentUser?.id) {
          setState(prevState => ({
            ...prevState,
            currentUser: response.data,
          }));
        }
        localStorage.setItem(ACCESS_TOKEN, response.data.token);
      }
    }
  };

  useEffect(() => {
    if (state.userModal) {
      if (isEmpty(state.selectedItem)) {
        reset(DEFAULT_VALUES);
      } else {
        reset(state.selectedItem);
      }
    }
  }, [reset, state.userModal, state.selectedItem]);
  const userModalTitleProvider = () => {
    return state.selectedItem ? `Edit ${state.label}` : 'Add New User';
  };
  const isFieldsDisabled = () => {
    return currentUserData?.role === 'superadmin' &&
      currentUserData?.id === state?.selectedItem?.id
      ? false
      : state.selectedItem;
  };
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
        title={userModalTitleProvider()}
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
            disabled={isFieldsDisabled()}
          />
        </ImageContainer>
        <div className="d-flex justify-content-end mb-2">
          {addUserCheck && (
            <div className="col-4">
              <DivLabel className="mb-2">Select Role</DivLabel>
              <MultiselectRoles
                enableCheckboxes
                control={control}
                name={`role`}
                placeholder={'Select Role'}
                options={ROLES_OPTIONS || []}
                customOnChange={(hookFormOnChange, selected) => {
                  hookFormOnChange(selected);
                }}
              />
            </div>
          )}
        </div>
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
                    placeholder="Enter Your First Name"
                    required
                    register={register}
                    errors={errors}
                    icon={<UserIcon />}
                    disabled={isFieldsDisabled()}
                  />
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
                  <StyledInputField
                    name="middle_name"
                    type="text"
                    label="Middle Name"
                    placeholder="Enter Your Middle Name"
                    register={register}
                    errors={errors}
                    icon={<UserIcon />}
                    disabled={isFieldsDisabled()}
                  />
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
                  <StyledInputField
                    name="last_name"
                    type="text"
                    label="Last Name"
                    placeholder="Enter Your Last Name"
                    register={register}
                    errors={errors}
                    icon={<UserIcon />}
                    disabled={isFieldsDisabled()}
                  />
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
                  <StyledInputField
                    name="username"
                    type="text"
                    label="User Name"
                    placeholder="Enter Your User Name"
                    required
                    register={register}
                    errors={errors}
                    icon={<UserIcon />}
                    disabled={isFieldsDisabled()}
                  />
                </div>
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 form-ele">
                  <StyledInputField
                    name="email"
                    type="email"
                    label="E-mail Address"
                    placeholder="Enter Your Email Address"
                    required
                    register={register}
                    errors={errors}
                    icon={<MailIcon />}
                    disabled={isFieldsDisabled()}
                  />
                </div>
                {currentUserData.role === 'superadmin' && !addUserCheck && (
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
                    disabled={isFieldsDisabled()}
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
