import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { KDFM, REFRESH_OPTIONS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { SelectField, Button, UploadField, InputField } from '../../shared';
import {
  RefreshIcon,
  LogoFieldIcon,
  UploadIcon,
  MailIcon,
  QRIcons,
} from '../../assets';
import { SettingsActions, SettingsSelectors } from '../../store/settings';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
`;
const InputFields = styled.div`
  display: flex;
  gap: 50px;
`;

const StyledSelectField = styled(SelectField)`
  width: 25%;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledInputField = styled(InputField)`
  width: 25%;
`;

const StyledInputTitle = styled(InputField)`
  width: 50%;
`;

export const Setting = () => {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const intervalRef = useRef(null);
  const settingData = useSelector(SettingsSelectors.getSettings);
  const [refreshApi, setRefreshApi] = useState(false);

  const onSubmit = async data => {
    const payload = new FormData();
    data.logo && payload.append('logo', data.logo);
    data.favicon && payload.append('favicon', data.favicon);
    data.title && payload.append('title', data.title);
    payload.append('refresh', !data.refresh ? 0 : data.refresh);
    data.email && payload.append('email', data.email);

    try {
      dispatch(SettingsActions.createSettings(payload));
      setRefreshApi(true);

      if (data.favicon) changeFavicon(URL.createObjectURL(data.favicon));
      if (data.title) document.title = data.title;
    } catch (error) {
      console.error('Failed to submit settings:', error);
    }
  };

  useEffect(() => {
    dispatch(SettingsActions.fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settingData) {
      changeFavicon(settingData?.favicon || '%PUBLIC_URL%/favicon.ico');
      document.title = settingData?.title || 'Data Flow Manager';

      setValue('logo', settingData?.logo);
      setValue('favicon', settingData?.favicon);
      setValue('title', settingData?.title);
      setValue(
        'refresh',
        settingData.refresh === 0 ? 'off' : settingData?.refresh
      );

      setValue('email', settingData?.email);

      const logoElement = document.getElementById('logo');
      if (logoElement && settingData?.logo) {
        logoElement.src = settingData.logo;
      }
    }
  }, [settingData, setValue]);

  const refreshState = settingData?.refresh;

  useEffect(() => {
    if (refreshState !== 0) {
      intervalRef.current = setInterval(() => {
        dispatch(SettingsActions.refreshSetting());
      }, refreshState);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [dispatch, refreshState, refreshApi]);

  function changeFavicon(newFaviconURL) {
    const favicon = document.getElementById('dynamic-favicon');
    if (favicon) {
      favicon.href = newFaviconURL;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = newFaviconURL || '%PUBLIC_URL%/favicon.ico';
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
        <InputFields>
          <StyledSelectField
            label="Refresh"
            name="refresh"
            control={control}
            icon={<RefreshIcon />}
            errors={errors}
            defaultValue={
              settingData
                ? {
                    label:
                      settingData.refresh === 0 ? 'Off' : settingData?.refresh,
                    value:
                      settingData.refresh === 0 ? 'Off' : settingData?.refresh,
                  }
                : null
            }
            options={REFRESH_OPTIONS}
            placeholder="Select Cluster"
          />
          <StyledInputField
            name="email"
            register={register}
            icon={<MailIcon />}
            label={KDFM.EMAIL}
            placeholder={KDFM.ENTER_EMAIL}
            errors={errors}
          />
        </InputFields>
        <InputFields>
          <UploadField
            name="logo"
            label="Logo"
            control={control}
            watch={watch}
            icon={<LogoFieldIcon />}
            rightIcon={<UploadIcon />}
            errors={errors}
            register={register}
            image={settingData?.logo}
          />
          <UploadField
            name="favicon"
            label="Favicon"
            control={control}
            icon={<LogoFieldIcon />}
            rightIcon={<UploadIcon />}
            errors={errors}
            register={register}
            image={settingData?.favicon}
          />
        </InputFields>

        <StyledInputTitle
          name="title"
          register={register}
          icon={<QRIcons />}
          label={KDFM.META_TITLE}
          placeholder={KDFM.ENTER_META_TITLE}
          errors={errors}
        />

        <FlexWrapper>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary">{KDFM.CANCEL}</Button>
            <Button type="submit">{KDFM.SAVE_SETTINGS}</Button>
          </div>
        </FlexWrapper>
      </form>
    </Wrapper>
  );
};
