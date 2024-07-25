import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { theme } from '../../styles';
import { Layout } from '../../components';
import { Button, TextButton, InputField, PasswordField } from '../../shared';
import {
  GoogleIcon,
  LessArrowIcon,
  MailIcon,
  MicroSoftIcon,
} from '../../assets';
import {
  ACCESS_TOKEN,
  EMAIL_REGEX,
  FORGOT_PASSWORD,
  GOOGLE,
  LOGIN_TO_YOUR_ACCOUNT,
  MICROSOFT,
  OR_DO_IT_VIA_OTHER_ACCOUNTS,
  SIGN_IN_TO_YOUR_ACCOUNT,
  WELCOME_BACK,
} from '../../utils';
import { login } from '../../utils/services';
import { getRightIcon } from '.';

const Title = styled.h3`
  font-weight: 500;
  font-size: 36px;
  text-align: center;
  color: ${props => props.theme.colors.darker};
  border-bottom: 1px dashed ${props => props.theme.colors.border};
  padding-bottom: 0.8rem;
  margin-bottom: 1rem;
`;

const SubTitle = styled.p`
  font-size: 28px;
  margin-bottom: 0.8rem;
  font-weight: 500;
  color: ${props => props.theme.colors.darker};
`;

const SubmitButton = styled(Button)`
  margin-top: 2.4rem;
  padding: 10px 14px;
  border-radius: 8px;

  span {
    margin-top: 4px;
    margin-left: 10px;
  }
`;

const SmallText = styled.small`
  display: block;
  margin-top: 1.4rem;
  color: ${props => props.theme.colors.darker};
  text-align: center;
`;

const SSOButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.4rem;
`;

const SSOButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: 0.35;
  padding: 1rem 1.4rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.white};
  box-shadow: 0px 1px 3px ${props => props.theme.colors.shadow};
`;

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

export const Login = () => {
  const navigate = useNavigate();
  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async data => {
    const response = await login(data);
    if (response.data?.token) {
      toast.success('Login successful');
      localStorage.setItem(ACCESS_TOKEN, response.data?.token);
      navigate('/dashboard');
    } else {
      toast.error(
        response?.message || 'Something went wrong. Please try again'
      );
    }
  };

  return (
    <Layout>
      <Title>{`👋 ${WELCOME_BACK}`}</Title>
      <SubTitle>{LOGIN_TO_YOUR_ACCOUNT}</SubTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="email"
          type="text"
          label="E-mail Address"
          placeholder="Enter your Email Address"
          register={register}
          errors={errors}
          icon={<MailIcon />}
          rightIcon={getRightIcon(watch, errors)}
        />
        <PasswordField
          name="password"
          register={register}
          errors={errors}
          watch={watch}
          required="Password is required"
          label="Password"
          helperText="Must be 8 characters at least"
        />
        <TextButton onClick={() => navigate('/forgot')}>
          {FORGOT_PASSWORD}
        </TextButton>
        <SubmitButton
          iconPosition="right"
          icon={<LessArrowIcon color={theme.colors.white} />}
          type="submit"
        >
          {SIGN_IN_TO_YOUR_ACCOUNT}
        </SubmitButton>
      </form>
      <SmallText>{OR_DO_IT_VIA_OTHER_ACCOUNTS}</SmallText>
      <SSOButtonsContainer>
        <SSOButton disabled>
          <GoogleIcon />
          <span>{GOOGLE}</span>
        </SSOButton>
        <SSOButton disabled>
          <MicroSoftIcon />
          <span>{MICROSOFT}</span>
        </SSOButton>
      </SSOButtonsContainer>
    </Layout>
  );
};
