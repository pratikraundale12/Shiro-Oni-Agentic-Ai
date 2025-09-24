import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';

import { useLocation } from 'react-router-dom';
import { GreaterArrowIcon, LessArrowIcon } from '../../assets';
import { Layout } from '../../components';
import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUBTITLE,
  RESET_YOUR_PASSWORD,
} from '../../constants';
import { history } from '../../helpers/history';
import { Button, PasswordField } from '../../shared';
import { AuthenticationActions } from '../../store';
import { theme } from '../../styles';

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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
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
  const dispatch = useDispatch();
  const {
    formState: { errors },
    watch,
    register,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = data => {
    data.resetToken = token;
    dispatch(AuthenticationActions.resetPassword(data));
  };

  const location = useLocation();

  // Extract token from query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  return (
    <Layout>
      <BackButtonContainer>
        <BackButton onClick={() => history.back()}>
          <GreaterArrowIcon /> <span>Back</span>
        </BackButton>
      </BackButtonContainer>
      <Title>{RESET_YOUR_PASSWORD}</Title>
      <SubTitle>{RESET_PASSWORD_SUBTITLE}</SubTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
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
        </div>
        <SubmitButton
          iconPosition="right"
          icon={<LessArrowIcon color={theme.colors.white} />}
          type="submit"
        >
          {RESET_PASSWORD}
        </SubmitButton>
      </Form>
    </Layout>
  );
};
