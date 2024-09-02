import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';

import { theme } from '../../styles';
import { ClusterSelect, Layout } from '../../components';
import { Button, InputField, PasswordField, TextButton } from '../../shared';
import {
  ClusterIcon,
  // GoogleIcon,
  LessArrowIcon,
  // MicroSoftIcon,
  UserIcon,
} from '../../assets';
import {
  FORGOT_PASSWORD,
  // GOOGLE,
  LOGIN_TO_YOUR_ACCOUNT,
  // MICROSOFT,
  // OR_DO_IT_VIA_OTHER_ACCOUNTS,
  SIGN_IN_TO_YOUR_ACCOUNT,
  WELCOME_BACK,
} from '../../constants';
import { getRightIcon, PasswordTextMessage } from '.';
import { useGlobalContext } from '../../utils';
import { AuthenticationActions } from '../../store';
import { toast } from 'react-toastify';
// import { history } from '../../helpers/history';

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

// const PasswordTextMessage = styled.span`
//   font-size: 10px;
//   font-weight: 400;
//   color: #7a7a9d;
//   line-height: 12px;
// `;

const loginSchema = yup.object().shape({
  cluster_id: yup.string().required('Cluster is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const PATH = 'login';

export const UserLogin = () => {
  const dispatch = useDispatch();
  // setState
  const { state } = useGlobalContext();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');
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
    dispatch(AuthenticationActions.login({ ...data, token }));
  };

  console.log(token);
  return (
    <Layout>
      <Title>{`${WELCOME_BACK} 👋`}</Title>
      <SubTitle>{LOGIN_TO_YOUR_ACCOUNT}</SubTitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
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
            required
          />
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
