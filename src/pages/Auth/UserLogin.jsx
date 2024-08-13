import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';

import { theme } from '../../styles';
import { ClusterSelect, Layout } from '../../components';
import { Button, TextButton, InputField, PasswordField } from '../../shared';
import {
  ClusterIcon,
  GoogleIcon,
  LessArrowIcon,
  MicroSoftIcon,
  UserIcon,
} from '../../assets';
import {
  FORGOT_PASSWORD,
  GOOGLE,
  LOGIN_TO_YOUR_ACCOUNT,
  MICROSOFT,
  OR_DO_IT_VIA_OTHER_ACCOUNTS,
  SIGN_IN_TO_YOUR_ACCOUNT,
  WELCOME_BACK,
} from '../../constants';
import { getRightIcon } from '.';
import { useGlobalContext } from '../../utils';
import { AuthenticationActions } from '../../store';
import { history } from '../../helpers/history';

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

const ForgetLinkContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
  cluster_id: yup.string().required('Cluster is required'),
});

const PATH = 'login';

export const UserLogin = () => {
  const dispatch = useDispatch();
  // setState
  const { state } = useGlobalContext();
  const {
    watch,
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = data => {
    dispatch(AuthenticationActions.login(data));
  };

  return (
    <Layout userLogin={true}>
      <Title>{`👋 ${WELCOME_BACK}`}</Title>
      <SubTitle>{LOGIN_TO_YOUR_ACCOUNT}</SubTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="username"
          type="text"
          label="Username"
          placeholder="Enter your Username"
          register={register}
          errors={errors}
          icon={<UserIcon />}
          rightIcon={getRightIcon(watch, errors)}
          required
        />
        <ClusterSelect
          name="cluster_id"
          control={control}
          placeholder="Select a Cluster"
          title="Select Cluster"
          backgroundColor={theme.colors.white}
          size="lg"
          icon={<ClusterIcon />}
          label="Select Cluster"
          errors={errors}
        />
        <PasswordField
          name="password"
          register={register}
          errors={errors}
          watch={watch}
          required
          label="Password"
          helperText="Must be 8 characters at least"
        />
        <ForgetLinkContainer>
          <TextButton onClick={() => history.push('/forgot')}>
            {FORGOT_PASSWORD}
          </TextButton>
        </ForgetLinkContainer>

        <SubmitButton
          iconPosition="right"
          icon={<LessArrowIcon color={theme.colors.white} />}
          type="submit"
          loading={state.loaders[PATH] && 'Signing In...'}
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
