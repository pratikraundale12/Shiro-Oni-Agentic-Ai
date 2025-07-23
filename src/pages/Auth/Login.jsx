import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';

import { getRightIcon } from '.';
import { LessArrowIcon, MailIcon } from '../../assets';
import { Layout } from '../../components';
import {
  EMAIL_REGEX,
  FORGOT_PASSWORD,
  LOGIN_TO_YOUR_ACCOUNT,
  SIGN_IN_TO_YOUR_ACCOUNT,
} from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField, PasswordField, TextButton } from '../../shared';
import { AuthenticationActions, NamespacesActions } from '../../store';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';

const SubTitle = styled.p`
  font-size: 32px;
  margin-bottom: 0.8rem;
  font-weight: 600;
  line-height: 100%;
  color: ${props => props.theme.colors.darker};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const SubmitButton = styled(Button)`
  margin-top: 1.8rem;
`;

const ForgetLinkContainer = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
`;

export const PasswordTextMessage = styled.span`
  font-size: 10px;
  font-weight: 400;
  color: #7a7a9d;
  line-height: 12px;
`;

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .matches(EMAIL_REGEX, 'Invalid email address')
    .max(50, 'Email can not be greater than 25 characters')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

const PATH = 'login';

export const Login = () => {
  const dispatch = useDispatch();
  const { state } = useGlobalContext();
  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  useEffect(() => {
    dispatch(NamespacesActions.setSelectedCluster({}));
  }, [dispatch]);

  const onSubmit = data => {
    dispatch(AuthenticationActions.login({ type: 'admin', ...data }));
  };

  return (
    <Layout>
      <SubTitle>{LOGIN_TO_YOUR_ACCOUNT}</SubTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputField
            name="email"
            type="text"
            label="E-mail Address"
            placeholder="Enter your Email Address"
            register={register}
            watch={watch}
            errors={errors}
            icon={<MailIcon />}
            rightIcon={getRightIcon(watch, errors, setValue)}
            required
          />
          <PasswordField
            name="password"
            register={register}
            errors={errors}
            watch={watch}
            required
            label="Password"
          />
          <ForgetLinkContainer>
            <TextButton type="button" onClick={() => history.push('/forgot')}>
              {FORGOT_PASSWORD}
            </TextButton>
          </ForgetLinkContainer>
        </div>
        <SubmitButton
          iconPosition="right"
          icon={<LessArrowIcon color={theme.colors.white} />}
          type="submit"
          loading={state.loaders[PATH] && 'Signing In...'}
        >
          {SIGN_IN_TO_YOUR_ACCOUNT}
        </SubmitButton>
      </Form>
      {/* <SmallText>{OR_DO_IT_VIA_OTHER_ACCOUNTS}</SmallText>
          <SSOButtonsContainer>
            <SSOButton disabled>
              <GoogleIcon />
              <span>{GOOGLE}</span>
            </SSOButton>
            <SSOButton disabled>
              <MicroSoftIcon />
              <span>{MICROSOFT}</span>
            </SSOButton>
          </SSOButtonsContainer> */}
    </Layout>
  );
};
