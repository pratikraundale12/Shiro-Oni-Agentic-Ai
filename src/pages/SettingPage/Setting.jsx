import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  LogoFieldIcon,
  MailIcon,
  QRIcons,
  RefreshIcon,
  UploadIcon,
} from '../../assets';
import { KDFM, REFRESH_OPTIONS } from '../../constants';
import { changeFavicon } from '../../helpers';
import { Button, InputField, SelectField, UploadField } from '../../shared';
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
  const settingData = useSelector(SettingsSelectors.getSettings);
  const [loading, setLoading] = useState(false);

  const onSubmit = async data => {
    setLoading(true);
    const payload = new FormData();
    payload.append('logo', data?.logo || null);
    payload.append('favicon', data?.favicon || null);
    payload.append('title', data?.title);
    payload.append(
      'refresh',
      data.refresh === false || data.refresh === 'Off' ? 0 : data.refresh
    );
    data.email && payload.append('email', data.email);

    try {
      dispatch(SettingsActions.createSettings(payload));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Failed to submit settings:', error);
    }
  };

  useEffect(() => {
    if (settingData) {
      if (settingData?.favicon) {
        changeFavicon(settingData?.favicon);
      }
      document.title = settingData?.title || 'Data Flow Manager';
      setValue('logo', settingData?.logo);
      setValue('favicon', settingData?.favicon);
      setValue('title', settingData?.title);
      setValue(
        'refresh',
        settingData.refresh === 0 ? 'Off' : settingData?.refresh
      );
      setValue('email', settingData?.email);
      const logoElement = document.getElementById('logo');
      if (logoElement && settingData?.logo) {
        logoElement.src = settingData.logo;
      }
    }
  }, [settingData, setValue]);

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
            setValue={setValue}
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
            setValue={setValue}
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
            <Button type="reset" variant="secondary">
              {KDFM.CANCEL}
            </Button>
            <Button type="submit" loading={loading}>
              {KDFM.SAVE_SETTINGS}
            </Button>
          </div>
        </FlexWrapper>
      </form>
    </Wrapper>
  );
};
