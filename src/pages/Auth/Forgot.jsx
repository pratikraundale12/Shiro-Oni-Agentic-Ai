import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { theme } from '../../styles';
import { Layout } from '../../components';
import { Button, TextButton, InputField } from '../../shared';
import { resetPasswordToken } from '../../utils/services';
import {
  GreaterArrowIcon,
  LessArrowIcon,
  MailIcon,
  RightArrowIcon,
} from '../../assets';
import {
  ALREADY_HAVE_AN_ACCOUNT,
  BACK,
  FORGOT_PASSWORD_SUBTITLE,
  FORGOT_PASSWORD,
  SEND_RESET_LINK,
  SIGN_IN,
  EMAIL_REGEX,
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
  margin-top: 9rem;

  button {
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
    margin-left: 10px;
  }
`;

const resetSchema = yup.object().shape({
  email: yup
    .string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .required('Email is required'),
});

export const getRightIcon = (watch, errors) => {
  return watch('email') && !errors.email ? (
    <RightArrowIcon color={theme.colors.primary} />
  ) : null;
};

export const Forgot = () => {
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetSchema),
  });

  const onSubmit = async data => {
    try {
      const response = await resetPasswordToken(data);
      if (response) {
        navigate('/reset', {
          state: {
            refreshToken: response?.resetToken,
          },
        });
      }
    } catch (error) {
      toast.error('Error resetting password.');
    }
  };

  return (
    <Layout>
      <div>
        <BackButtonContainer>
          <BackButton onClick={() => navigate(-1)}>
            <GreaterArrowIcon /> <span>{BACK}</span>
          </BackButton>
        </BackButtonContainer>
        <Title>{FORGOT_PASSWORD}</Title>
        <SubTitle>{FORGOT_PASSWORD_SUBTITLE}</SubTitle>
        <InputField
          name="email"
          type="email"
          label="E-mail Address"
          placeholder="Enter your Email Address"
          required="Email is required"
          register={register}
          errors={errors}
          icon={<MailIcon />}
          rightIcon={getRightIcon(watch, errors)}
        />
        <SubmitButton
          iconPosition="right"
          icon={<LessArrowIcon color={theme.colors.white} />}
          type="submit"
          onClick={handleSubmit(onSubmit)}
        >
          {SEND_RESET_LINK}
        </SubmitButton>
      </div>
      <SignInContainer>
        {ALREADY_HAVE_AN_ACCOUNT}
        <TextButton onClick={() => navigate('/login')}>{SIGN_IN}</TextButton>
      </SignInContainer>
    </Layout>
  );
};
