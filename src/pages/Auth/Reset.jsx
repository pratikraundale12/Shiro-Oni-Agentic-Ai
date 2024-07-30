import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

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
import { resetPassword } from '../../utils/services/auth';

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
const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(
      /[@$!%*?&]/,
      'Password must contain at least one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const Reset = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    formState: { errors },
    watch,
    register,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async data => {
    const response = await resetPassword({
      password: data.password,
      resetToken: state.refreshToken,
    });
    if (response.status === 204) {
      navigate('/success');
    } else {
      toast.error(
        response?.message || 'Something went wrong. Please try again'
      );
    }
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <PasswordField
            name="password"
            label="New Password"
            placeholder="Enter your New Password"
            required
            register={register}
            errors={errors}
            watch={watch}
            helperText="Make sure your new password is strong and secure."
            showStrengthMeter
          />
          <PasswordField
            name="confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm your New Password"
            required
            register={register}
            errors={errors}
            watch={watch}
            showStrengthMeter
          />
          <SubmitButton
            iconPosition="right"
            icon={<LessArrowIcon color={theme.colors.white} />}
            type="submit"
          >
            {RESET_PASSWORD}
          </SubmitButton>
        </form>
      </div>
      <SignInContainer>
        {ALREADY_HAVE_AN_ACCOUNT}
        <TextButton onClick={() => navigate('/login')}>{SIGN_IN}</TextButton>
      </SignInContainer>
    </Layout>
  );
};
