/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { isEmpty } from 'lodash';
import { Button, InputField, Modal } from '../../shared';
import {
  PlusCircleIcon,
  UserIcon,
  MailIcon,
  UpArrowImageIcon,
  PhoneIcon,
} from '../../assets';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import UserIconUploadIcon from '../../assets/Icons/UserImageUploadIcon';
import { SelectField, PasswordField, PhoneField } from '../../shared';
import { createUserApi, editUserDataApi } from '../../utils/services';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../../utils';
import {
  userSchema,
  editUserSchema,
} from '../../components/UserManagement/userValidation';

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

const UploadImageContainer = styled.div`
  background: ${props => props.theme.colors.lightGrey};
  border-radius: 50%;
  padding: 14px;
`;

const FieldsWrapper = styled.div`
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
  margin-bottom: 0.6rem;
`;

const StyledPasswordField = styled(PasswordField)`
  margin-bottom: 0.4rem;
`;

const StyledPhoneField = styled(PhoneField)`
  margin-bottom: 0.4rem;
`;

const FileInputField = styled.input`
  display: none;
`;
const ImageContainer = styled.div`
  height: 115px;
  width: 115px;
  border-radius: 50%;
  object-fit: cover;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  height: 115px;
  width: 115px;
  border-radius: 50%;
  object-fit: cover;
`;
const UpArrowIcon = styled.div`
  position: absolute;
  bottom: 20px;
  right: 15px;
`;
const DropDownWrapper = styled.div`
  width: 15%;
  margin-right: 10px;
`;
export const AddUserModal = () => {
  const [photo, setPhoto] = useState(null);
  const [photoUpdate, setPhotoUpdated] = useState(false);
  const { state, setState } = useGlobalContext();
  const {
    register,
    reset,
    handleSubmit,
    watch,
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
    setPhoto(null);
    setPhotoUpdated(false);
  };

  const password = watch('password');
  const statusOption = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];
  const roleOption = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ];
  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    event.target.value = null;
    setPhoto(selectedFile);
  };
  const removeUploadedImage = () => {
    setPhoto(null);
    setPhotoUpdated(true);
  };

  const addUserAPIcall = async data => {
    const formData = new FormData();

    formData.append('first_name', data.first_name);
    formData.append('middle_name', data.middle_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phone', data.phone_number);
    if (data?.is_active) {
      formData.append('is_active', JSON.parse(data?.is_active));
    } else {
      formData.append('is_active', true);
    }
    formData.append('type', data?.type || 'user');
    formData.append('username', data.username);

    if (photo) {
      formData.append('photo', photo);
    }

    const response = await createUserApi(formData);
    if (response.status == 201) {
      setState({
        ...state,
        userModal: false,
        selectedItem: null,
      });
      toast.success('User Created Successfully');
    } else {
      toast.error('error occured');
    }
  };

  const editUserAPIcall = async data => {
    const formData = new FormData();

    formData.append('first_name', data.first_name);
    formData.append('middle_name', data.middle_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('phone', data.phone_number);
    if (data?.password) {
      formData.append('password', data.password);
    }
    if (data?.is_active) {
      formData.append('is_active', JSON.parse(data?.is_active));
    } else {
      formData.append('is_active', true);
    }
    formData.append('type', data.type || 'user');
    formData.append('username', data.username);
    formData.append('photo', photo);
    const response = await editUserDataApi(state.selectedItem?.id, formData);
    if (response.status == 200) {
      setState({
        ...state,
        userModal: false,
        selectedItem: null,
      });
      toast.success('User Updated Successfully');
    } else {
      toast.error('error occured');
    }
    setPhoto(null);
    setPhotoUpdated(false);
  };

  const onSubmit = async data => {
    if (isEmpty(state.selectedItem)) {
      addUserAPIcall(data);
    } else {
      editUserAPIcall(data);
    }
  };
  const getImageSource = () => {
    if (isEmpty(state?.selectedItem) && photo) {
      return URL.createObjectURL(photo);
    }

    if (!isEmpty(state?.selectedItem) && photoUpdate) {
      return URL.createObjectURL(photo);
    }

    return `${photo}`;
  };

  useEffect(() => {
    if (state.userModal) {
      if (isEmpty(state.selectedItem)) reset(DEFAULT_VALUES);
      else reset(state.selectedItem);
    }
    if (state?.selectedItem && state?.selectedItem?.photo) {
      setPhoto(`media/users/${state?.selectedItem?.id}.png`);
    }
  }, [reset, state.userModal, state.selectedItem]);
  return (
    <div>
      <Button
        icon={<PlusCircleIcon width={20} height={20} color="white" />}
        onClick={openModal}
      >
        Add New User
      </Button>
      <Modal
        title={state.selectedItem ? 'Edit User' : 'Add New User'}
        isOpen={state.userModal}
        onRequestClose={closeModal}
        size="lg"
        secondaryButtonText="Cancel"
        primaryButtonText="Submit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Continer>
          {!photo && (
            <UploadImageContainer>
              <label htmlFor="file-input">
                <UserIconUploadIcon />
              </label>
              <FileInputField
                id="file-input"
                type="file"
                onChange={handleFileChange}
              />
            </UploadImageContainer>
          )}
          {photo && (
            <UploadImageContainer>
              <ImageContainer>
                <StyledImage src={getImageSource()} alt="img" />{' '}
              </ImageContainer>{' '}
              <UpArrowIcon onClick={removeUploadedImage}>
                <UpArrowImageIcon />
              </UpArrowIcon>
            </UploadImageContainer>
          )}

          <FieldsWrapper>
            <DropDownWrapper>
              <StyledSelectField
                options={statusOption}
                name="is_active"
                errors={errors}
                control={control}
                label="Status"
              />
            </DropDownWrapper>
            <DropDownWrapper>
              <StyledSelectField
                options={roleOption}
                name="type"
                errors={errors}
                control={control}
                label="Role"
              />
            </DropDownWrapper>
          </FieldsWrapper>
          <FormWrapper>
            <FormTitle>User Information</FormTitle>
            <FormSection>
              <StyledInputField
                name="first_name"
                type="text"
                label="First Name"
                placeholder="Enter your First Name"
                required="First Name is required"
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
                required="Last Name is required"
                register={register}
                errors={errors}
                icon={<UserIcon />}
              />
              <StyledInputField
                name="username"
                type="text"
                label="User Name"
                placeholder="Enter your User Name"
                required="User Name is required"
                register={register}
                errors={errors}
                icon={<UserIcon />}
              />
              <StyledInputField
                name="email"
                type="email"
                label="E-mail Address"
                placeholder="Enter your First Name"
                required="Email is required"
                register={register}
                errors={errors}
                icon={<MailIcon />}
              />
              <StyledPasswordField
                name="password"
                register={register}
                errors={errors}
                watch={watch}
                // required="Password is required"
                label="Password"
              />

              {(!state?.selectedItem || password) && (
                <StyledPasswordField
                  name="confirm_password"
                  register={register}
                  errors={errors}
                  watch={watch}
                  required="Password is required"
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
