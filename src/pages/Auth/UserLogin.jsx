import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';

import { toast } from 'react-toastify';
import { PasswordTextMessage, getRightIcon } from '.';
import { LessArrowIcon, UserIcon } from '../../assets';
import { Layout } from '../../components';
import {
  FORGOT_PASSWORD,
  LOGIN_TO_YOUR_ACCOUNT,
  SIGN_IN_TO_YOUR_ACCOUNT,
} from '../../constants';
import { Button, InputField, PasswordField, TextButton } from '../../shared';
import { AuthenticationActions, NamespacesActions } from '../../store';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';
import { useLocation } from 'react-router-dom';

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
  justify-content: space-between;
  align-items: center;
`;

const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const PATH = 'login';

export const UserLogin = () => {
  const dispatch = useDispatch();
  // setState
  const location = useLocation();
  const { state } = useGlobalContext();
  const params = new URLSearchParams(location.search);

  const token = params.get('token');

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  useEffect(() => {
    dispatch(NamespacesActions.setSelectedCluster({}));
  }, [dispatch]);

  const onSubmit = data => {
    dispatch(AuthenticationActions.login({ ...data, token }));
  };

  return (
    <Layout>
      <SubTitle>{LOGIN_TO_YOUR_ACCOUNT}</SubTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <InputField
            name="username"
            type="text"
            label="Username"
            placeholder="Enter Your Username"
            register={register}
            errors={errors}
            icon={<UserIcon />}
            rightIcon={getRightIcon(watch, errors)}
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
            <PasswordTextMessage></PasswordTextMessage>
            <TextButton
              onClick={() =>
                toast.error(
                  'To change your password, Contact the administrator.'
                )
              }
            >
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
