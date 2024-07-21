import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { theme } from '../../styles';
import { Layout } from '../../components';
import { Button, TextButton, PasswordField } from '../../shared';
import { GreaterArrowIcon, LessArrowIcon } from '../../assets';
import {
  ALREADY_HAVE_AN_ACCOUNT,
  RESET_PASSWORD_SUBTITLE,
  RESET_PASSWORD,
  RESET_YOUR_PASSWORD,
  SIGN_IN,
} from '../../utils';

const BackButtonContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  border-bottom: 1px dashed ${props => props.theme.colors.border};
`;

const BackButton = styled.button`
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  font-family: ${props => props.theme.fontNato};
  font-weight: 500;
  font-size: 20px;
  color: ${props => props.theme.colors.darker};
  padding-bottom: 0.8rem;
  cursor: pointer;

  span {
    margin-left: 10px;
  }
`;

const Title = styled.p`
  font-size: 28px;
  margin-bottom: 0.6rem;
  font-weight: 500;
  color: ${props => props.theme.colors.darker};
`;

const SubTitle = styled.p`
  font-size: 14px;
  margin-bottom: 1.4rem;
  font-weight: 500;
  color: ${props => props.theme.colors.darker};
`;

const SubmitButton = styled(Button)`
  padding: 10px 14px;
  border-radius: 8px;

  span {
    margin-top: 2px;
    margin-left: 10px;
  }
`;

const SignInContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
    margin-left: 10px;
  }
`;

export const Reset = () => {
  const navigate = useNavigate();
  const {
    formState: { errors },
    watch,
    register,
    handleSubmit,
  } = useForm();

  const onSubmit = data => console.log(data);

  return (
    <Layout>
      <div>
        <BackButtonContainer>
          <BackButton onClick={() => navigate(-1)}>
            <GreaterArrowIcon /> <span>Back</span>
          </BackButton>
        </BackButtonContainer>
        <Title>{RESET_YOUR_PASSWORD}</Title>
        <SubTitle>{RESET_PASSWORD_SUBTITLE}</SubTitle>
        <PasswordField
          name="password"
          label="New Password"
          placeholder="Enter your New Password"
          required="Password is required"
          register={register}
          errors={errors}
          watch={watch}
          helperText="Make sure your new password is strong and secure."
        />
        <PasswordField
          name="confirmPassword"
          label="Confirm New Password"
          placeholder="Confirm your New Password"
          required="Password is required"
          register={register}
          errors={errors}
          watch={watch}
        />
      </div>
      <SubmitButton
        iconPosition="right"
        icon={<LessArrowIcon color={theme.colors.white} />}
        type="submit"
        onClick={handleSubmit(onSubmit)}
      >
        {RESET_PASSWORD}
      </SubmitButton>
      <SignInContainer>
        {ALREADY_HAVE_AN_ACCOUNT}
        <TextButton onClick={() => navigate('/login')}>{SIGN_IN}</TextButton>
      </SignInContainer>
    </Layout>
  );
};
