import React, { useState } from 'react';

import { Button, InputField, Modal } from '../../shared';
import {
  PlusCircleIcon,
  UserIcon,
  MailIcon,
  UpArrowImageIcon,
} from '../../assets';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import UserIconUploadIcon from '../../assets/Icons/UserImageUploadIcon';
import { SelectField, PasswordField, PhoneField } from '../../shared';
import { createUserApi } from '../../utils/services';
import { toast } from 'react-toastify';

const Content = styled.div`
  padding: 35px 16px 25px;
  width: 100%;
`;
const Continer = styled.div`
  display: flex;
  justify-content: center !important;
  align-items: center !important;
  flex-direction: column !important;
`;
const UploadImageContainer = styled.div`
  background: #f5f7fa;
  border: 1px solid transparent;
  border-radius: 50%;
  padding: 28px;
  position: relative;
`;
const DropDownContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end !important;
  align-items: center !important;
  margin-bottom: 11px;
`;
const FormWrapper = styled.div`
  width: 100%;
`;
const FormHeader = styled.div`
  background-color: #f5f7fa;
  border-radius: 16px 16px 0 0;
  border: 1px solid transparent;
  padding: 18px 15px;
`;
const FormTitle = styled.h3`
  ont-family: 'Red Hat Display', sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 21.17px;
  letter-spacing: -0.005em;
  text-align: left;
  color: #444445;
`;
const FormBody = styled.div`
  border-width: 0px 1px 1px 1px;
  border-style: solid;
  border-color: #dde4f0;
  border-radius: 0 0 16px 16px;
  background-color: transparent;
  padding: 12px 16px;
  max-height: 295px;
  overflow: auto;
`;
const FormInnerSection = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const InputContainer = styled.div`
  width: 33.33%;
  padding-right: calc(1.5rem * 0.5);
  padding-left: calc(1.5rem * 0.5);
`;

const FileInputLabel = styled.label``;

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
  const [isOpen, setIsOpen] = useState(false);
  const [photo, setPhoto] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm();

  const statusOption = [
    { value: 'true', label: 'Active' },
    { value: 'false', label: 'Inactive' },
  ];
  const roleOption = [{ value: 'admin', label: 'Admin' }];
  const handleFileChange = event => {
    const selectedFile = event.target.files[0];
    event.target.value = null;
    setPhoto(selectedFile);
  };
  const removeUploadedImage = () => {
    setPhoto(null);
  };
  const onSubmit = async data => {
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
    formData.append('type', data.type || 'user');
    formData.append('username', data.first_name);

    if (photo) {
      formData.append('photo', photo);
    }

    const [response, error] = await createUserApi(formData);
    if (response) {
      setIsOpen(false);
      toast.success('Created');
    } else if (error) {
      toast.error('error occured');
    }
  };

  return (
    <div>
      <Button
        icon={<PlusCircleIcon width={20} height={20} color="white" />}
        onClick={() => setIsOpen(true)}
      >
        Add New User
      </Button>
      <Modal
        title="Add User"
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        size="lg"
        secondaryButtonText="Cancel"
        primaryButtonText="Add"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Content>
          <Continer>
            {!photo && (
              <UploadImageContainer>
                <FileInputLabel htmlFor="file-input">
                  <UserIconUploadIcon />
                </FileInputLabel>
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
                  <StyledImage src={URL.createObjectURL(photo)} alt="img" />{' '}
                </ImageContainer>{' '}
                <UpArrowIcon onClick={removeUploadedImage}>
                  <UpArrowImageIcon />
                </UpArrowIcon>
              </UploadImageContainer>
            )}

            <DropDownContainer>
              <DropDownWrapper>
                <SelectField
                  options={statusOption}
                  name="is_active"
                  errors={errors}
                  control={control}
                  label="Status"
                />
              </DropDownWrapper>
              <DropDownWrapper>
                <SelectField
                  options={roleOption}
                  name="type"
                  errors={errors}
                  control={control}
                  label="Role"
                />
              </DropDownWrapper>
            </DropDownContainer>
            <FormWrapper>
              <FormHeader>
                <FormTitle>User Information</FormTitle>
              </FormHeader>
              <FormBody>
                <FormInnerSection>
                  <InputContainer>
                    <InputField
                      name="first_name"
                      type="text"
                      label="First Name"
                      placeholder="Enter your First Name"
                      required="First Name is required"
                      register={register}
                      errors={errors}
                      icon={<UserIcon />}
                    />{' '}
                  </InputContainer>
                  <InputContainer>
                    <InputField
                      name="middle_name"
                      type="text"
                      label="Middle Name"
                      placeholder="Enter your Middle Name"
                      register={register}
                      errors={errors}
                      icon={<UserIcon />}
                    />{' '}
                  </InputContainer>
                  <InputContainer>
                    <InputField
                      name="last_name"
                      type="text"
                      label="Last Name"
                      placeholder="Enter your Last Name"
                      required="Last Name is required"
                      register={register}
                      errors={errors}
                      icon={<UserIcon />}
                    />{' '}
                  </InputContainer>
                  <InputContainer>
                    <InputField
                      name="username"
                      type="text"
                      label="User Name"
                      placeholder="Enter your User Name"
                      required="User Name is required"
                      register={register}
                      errors={errors}
                      icon={<UserIcon />}
                    />{' '}
                  </InputContainer>
                  <InputContainer>
                    <InputField
                      name="email"
                      type="email"
                      label="E-mail Address"
                      placeholder="Enter your First Name"
                      required="Email is required"
                      register={register}
                      errors={errors}
                      icon={<MailIcon />}
                    />{' '}
                  </InputContainer>
                  <InputContainer>
                    <PasswordField
                      name="password"
                      register={register}
                      errors={errors}
                      watch={watch}
                      required="Password is required"
                      label="Password"
                    />
                  </InputContainer>
                  <InputContainer>
                    <PasswordField
                      name="confirm_password"
                      register={register}
                      errors={errors}
                      watch={watch}
                      required="Password is required"
                      label="Confirm Password"
                    />
                  </InputContainer>
                  <InputContainer>
                    <PhoneField
                      name="phone_number"
                      errors={errors}
                      control={control}
                    />
                  </InputContainer>
                </FormInnerSection>
              </FormBody>
            </FormWrapper>
          </Continer>
        </Content>
      </Modal>
    </div>
  );
};
