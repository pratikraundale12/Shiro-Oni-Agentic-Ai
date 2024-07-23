import React from 'react';
import styled from 'styled-components';
import { Dropdown, InputField, PasswordField, PhoneField } from '../../shared';
import { MailIcon, UserIcon } from '../../assets';
import UserIconUploadIcon from '../../assets/Icons/UserImageUploadIcon';
import PropTypes from 'prop-types';

const Content = styled.div`
  padding: 35px 16px 25px;
  width: 100%;
  height: 100%;
`;
const Continer = styled.div`
  display: flex;
  justify-content: center !important;
  align-items: center !important;
  flex-direction: column !important;
`;
const UploadImageContainer = styled.div`
    background: #F5F7FA;
    border: 1px solid transparent;
    border-radius: 50%;
    padding: 28px;
}`;
const DropDownContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end !important;
  align-items: center !important;
  margin-bottom: 11px;
`;
const FormWrapper = styled.form`
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
  max-height: 217px;
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

const CreateUser = ({ watch, register, control, errors }) => {
  const option = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
    { value: 'option5', label: 'Option 5' },
    { value: 'option6', label: 'Option 6' },
    { value: 'option7', label: 'Option 7' },
    { value: 'option8', label: 'Option 8' },
    { value: 'option9', label: 'Option 9' },
    { value: 'option10', label: 'Option 10' },
  ];

  return (
    <Content>
      <Continer>
        <UploadImageContainer>
          <UserIconUploadIcon />
        </UploadImageContainer>
        <DropDownContainer>
          {' '}
          <Dropdown options={option} placeholder="Status" label="Status" />
          <Dropdown options={option} placeholder="Status" label="Status" />
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
                  required="Middle Name is required"
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
                  // helperText="Must be 8 characters at least"
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
                  // helperText="Must be 8 characters at least"
                />
              </InputContainer>
              <InputContainer>
                <PhoneField
                  name="phone_number"
                  errors={errors}
                  required="Phone Number is required"
                  control={control}
                />
              </InputContainer>
            </FormInnerSection>
          </FormBody>
        </FormWrapper>
      </Continer>
    </Content>
  );
};
export default CreateUser;

CreateUser.propTypes = {
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  watch: PropTypes.func,
  register: PropTypes.func,
};
