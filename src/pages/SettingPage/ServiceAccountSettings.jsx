import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { CurvedLockIcon, CurvedProfileIcon } from '../../assets';
import favicon from '../../assets/images/default-favicon.ico';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField, PasswordField } from '../../shared';
import { SettingsActions, SettingsSelectors } from '../../store/settings';

const Wrapper = styled.div`
  height: 95%;
  padding-bottom: 120px; /* Adds space below all content */
`;
const InputFields = styled.div`
  display: flex;
`;

const FlexWrapper = styled.div`
  display: flex;
  position: absolute;
  height: 53px;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  margin-top: auto;
  bottom: 20px;
`;

const ButtonText = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 1%;
`;

const StyledCancelButton = styled(Button)`
  padding: 10px;
  height: 50px;
  width: 124px;
  gap: 10px;
  border-radius: 8px;
`;

const StyledSaveButton = styled(Button)`
  padding-top: 15px;
  padding-bottom: 15px;
  height: 50px;
  width: 150px;
  gap: 10px;
  radius: 8px;
  left: 140px;
`;

const ButtonDiv = styled.div`
  display: flex;
  gap: 1rem;
`;

export const settingSchema = yup
  .object()
  .shape({
    username: yup
      .string()
      .nullable()
      .transform(value => (value === '' ? null : value))
      .test(
        'not-empty',
        'Username cannot be an empty',
        value => value === null || value.trim().length > 0
      ),

    password: yup
      .string()
      .transform(value => (value === '' ? null : value))
      .nullable()
      .test(
        'not-empty',
        'Password cannot be an empty',
        value => value === null || value.trim().length > 0
      ),
  })
  .test(
    'username-password-pair',
    'If one of username or password is filled, the other is required.',
    function (value) {
      const { username, password } = value || {};
      const hasUsername = !!username;
      const hasPassword = !!password;

      if ((hasUsername && !hasPassword) || (!hasUsername && hasPassword)) {
        return this.createError({
          path: !hasPassword ? 'password' : 'username',
          message: 'Both username and password must be filled together',
        });
      }

      return true;
    }
  );
export const ServiceAccountSettings = () => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: yupResolver(settingSchema),
    mode: 'onChange',
  });
  const dispatch = useDispatch();
  const settingData = useSelector(SettingsSelectors.getSettings);
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const onSubmit = async data => {
    setLoading(true);
    const trimmedUsername =
      typeof data?.username === 'string'
        ? data.username.trim()
        : data?.username;
    const trimmedPassword =
      typeof data?.password === 'string'
        ? data.password.trim()
        : data?.password;

    setValue('username', trimmedUsername, { shouldDirty: false });
    setValue('password', trimmedPassword, { shouldDirty: false });

    const payload = new FormData();
    const updatedFields = [];
    const appendIfChanged = (key, value, compareValue, isImage = false) => {
      if (
        (isImage && value !== compareValue && value !== undefined) ||
        (!isImage && dirtyFields[key] && value !== compareValue)
      ) {
        payload.append(key, value);
        updatedFields.push(key);
      }
    };

    if (settingData?.id) payload.append('id', settingData.id);

    appendIfChanged('username', trimmedUsername, settingData?.username);
    appendIfChanged('password', trimmedPassword, settingData?.password);

    if (dirtyFields.refresh || data.refresh !== settingData?.refresh) {
      const refreshValue = [false, 'Off'].includes(data.refresh)
        ? 0
        : data.refresh;
      appendIfChanged('refresh', refreshValue, settingData?.refresh);
    }

    try {
      if (updatedFields.length > 0) {
        dispatch(SettingsActions.createSettings(payload));
        setTimeout(() => {
          dispatch(SettingsActions.fetchSettings());
          history.push('/setting');
          setIsChanged(false);
        }, 1000);
        changeFavicon(data?.favicon || favicon);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (settingData) {
      if (settingData?.favicon) {
        changeFavicon(settingData?.favicon);
      }
      document.title = settingData?.title || 'Data Flow Manager';
      setValue('username', settingData?.username);
      setValue('password', settingData?.password);

      setValue(
        'refresh',
        settingData.refresh === 0 ? 'Off' : String(settingData.refresh)
      );
    }
  }, [settingData, setValue, dispatch]);

  useEffect(() => {
    const subscription = watch(value => {
      const isModified =
        value.username !== settingData?.username ||
        value.password !== settingData?.password ||
        value.refresh !==
          (settingData?.refresh === 0 ? 'Off' : settingData?.refresh);
      setIsChanged(isModified);
    });

    return () => subscription.unsubscribe();
  }, [watch, settingData]);

  function changeFavicon(newFaviconURL) {
    const favicon = document.getElementById('dynamic-favicon');
    if (favicon) {
      favicon.href = newFaviconURL;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = newFaviconURL;
      newFavicon.id = 'dynamic-favicon';
      document.head.appendChild(newFavicon);
    }
  }

  return (
    <Wrapper>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="-flex justify-content-end me-4">
          <InputFields className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
              <InputField
                name="username"
                type="text"
                label="Username"
                placeholder="Enter your Username"
                register={register}
                errors={errors}
                icon={<CurvedProfileIcon height={24} width={24} />}
                required
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
              <PasswordField
                required
                name="password"
                register={register}
                errors={errors}
                watch={watch}
                label="Password"
                disableToggle={false}
                placeholder="Enter your Password"
                icon={<CurvedLockIcon height={24} width={24} />}
              />
            </div>
          </InputFields>
        </div>

        <FlexWrapper className="mt-3">
          <ButtonDiv>
            <StyledCancelButton
              variant="secondary"
              type="cancel"
              loading={loading}
              disabled={!isChanged}
              onClick={() => {
                reset(settingData);
                setIsChanged(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </StyledCancelButton>
            <StyledSaveButton
              type="submit"
              loading={loading}
              disabled={!isChanged || Object.keys(errors).length > 0}
            >
              <ButtonText>{KDFM.SAVE_SETTINGS}</ButtonText>
            </StyledSaveButton>
          </ButtonDiv>
        </FlexWrapper>
      </form>
    </Wrapper>
  );
};
