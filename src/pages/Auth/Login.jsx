import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';

import { getRightIcon } from '.';
import {
  // GoogleIcon,
  LessArrowIcon,
  MailIcon,
} from '../../assets';
import { Layout } from '../../components';
import {
  EMAIL_REGEX,
  FORGOT_PASSWORD,
  // GOOGLE,
  LOGIN_TO_YOUR_ACCOUNT,
  // MICROSOFT,
  // OR_DO_IT_VIA_OTHER_ACCOUNTS,
  SIGN_IN_TO_YOUR_ACCOUNT,
  WELCOME_BACK,
} from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField, PasswordField, TextButton } from '../../shared';
import { AuthenticationActions } from '../../store';
import { theme } from '../../styles';
import { useGlobalContext } from '../../utils';

const Title = styled.h3`
  font-weight: 500;
  font-size: 25px;
  text-align: center;
  color: ${props => props.theme.colors.darker};
  border-bottom: 1px dashed ${props => props.theme.colors.border};
  padding-bottom: 5px;
  /* margin-bottom: 1rem; */
`;

const SubTitle = styled.p`
  font-size: 20px;
  margin-bottom: 0.8rem;
  font-weight: 500;
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

// const SmallText = styled.small`
//   display: block;
//   margin-top: 1.4rem;
//   color: ${props => props.theme.colors.darker};
//   text-align: center;
// `;

// const SSOButtonsContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 1rem;
//   margin-top: 1.4rem;
// `;

// const SSOButton = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 1rem;
//   cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
//   opacity: 0.35;
//   padding: 1rem 1.4rem;
//   border-radius: 8px;
//   border: 1px solid ${props => props.theme.colors.border};
//   background-color: ${props => props.theme.colors.white};
//   box-shadow: 0px 1px 3px ${props => props.theme.colors.shadow};
// `;

const ForgetLinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = data => {
    dispatch(AuthenticationActions.login({ type: 'admin', ...data }));
  };

  return (
    <Layout>
      <Title>{`${WELCOME_BACK} 👋`}</Title>
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
            <PasswordTextMessage>
              Must be 8 characters at least
            </PasswordTextMessage>
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
