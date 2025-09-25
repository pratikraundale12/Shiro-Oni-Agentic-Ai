import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';

import {
  CircleCrossIcon,
  GreaterArrowIcon,
  LessArrowIcon,
  MailIcon,
  RightArrowIcon,
} from '../../assets';
import { Layout } from '../../components';
import {
  BACK,
  EMAIL_REGEX,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUBTITLE,
  SEND_RESET_LINK,
} from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField } from '../../shared';
import {
  AuthenticationActions,
  AuthenticationSelectors,
  LoadingSelectors,
} from '../../store';
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
  @media screen and (max-width: 1400px) {
    font-size: 18px !important;
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const resetSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .matches(EMAIL_REGEX, 'Invalid email address'),
});

const DEFAULT_VALUES = {
  email: '',
};

export const getRightIcon = (watch, errors, setValue) => {
  const emailValue = watch('email');
  const isEmailValid = !errors.email && EMAIL_REGEX.test(emailValue);

  if (emailValue) {
    return isEmailValid ? (
      <RightArrowIcon />
    ) : (
      <CircleCrossIcon
        style={{ cursor: 'pointer' }}
        onClick={e => {
          e.stopPropagation();
          setValue('email', '');
        }}
      />
    );
  }
  return null;
};

export const Forgot = () => {
  const dispatch = useDispatch();
  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetSchema),
    defaultValues: DEFAULT_VALUES,
  });
  const loading = useSelector(state =>
    LoadingSelectors.getLoading(state, 'resetPasswordRequest')
  );
  const isButtonDisabled = useSelector(
    AuthenticationSelectors.getIsButtonDisabled
  );

  const onSubmit = data => {
    if (!loading && !isButtonDisabled) {
      dispatch(AuthenticationActions.resetPasswordRequest(data));
      reset(DEFAULT_VALUES);
    }
  };

  return (
    <Layout>
      <BackButtonContainer>
        <BackButton onClick={() => history.back()}>
          <GreaterArrowIcon /> <span>{BACK}</span>
        </BackButton>
      </BackButtonContainer>
      <Container>
        <div>
          <Title>{FORGOT_PASSWORD}</Title>
          <SubTitle>{FORGOT_PASSWORD_SUBTITLE}</SubTitle>
          <InputField
            name="email"
            type="email"
            label="E-mail Address"
            placeholder="Enter Your Email Address"
            required
            register={register}
            errors={errors}
            icon={<MailIcon />}
            rightIcon={getRightIcon(watch, errors, setValue)}
          />
        </div>
        <SubmitButton
          iconPosition="right"
          icon={<LessArrowIcon color={theme.colors.white} />}
          type="submit"
          onClick={handleSubmit(onSubmit)}
          disabled={isButtonDisabled || loading}
        >
          {loading ? 'Sending...' : SEND_RESET_LINK}
        </SubmitButton>
      </Container>
    </Layout>
  );
};
