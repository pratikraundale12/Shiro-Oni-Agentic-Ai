import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  LogoFieldIcon,
  MailIcon,
  QRIcons,
  RefreshIcon,
  UploadIcon,
  UserIcon,
} from '../../assets';
import favicon from '../../assets/images/favicon.ico';
import { EMAIL_REGEX, KDFM, REFRESH_OPTIONS } from '../../constants';
import {
  Button,
  InputField,
  SelectField,
  UploadField,
  PasswordField,
} from '../../shared';
import { RolesSelectors } from '../../store';
import { SettingsActions, SettingsSelectors } from '../../store/settings';

const Wrapper = styled.div`
  margin-top: 4px;
  height: 95%;
`;
const InputFields = styled.div`
  display: flex;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  bottom: 20px;
`;
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;

export const settingSchema = yup.object().shape({
  email: yup
    .string()
    .matches(EMAIL_REGEX, 'Invalid email address')
    .max(50, 'Email can not be greater than 25 characters'),

  title: yup
    .string()
    .max(25, 'Title must be 25 characters or less')
    .matches(/^[a-zA-Z0-9\s]+$/, 'Title must not contain special characters')
    .required('Title is required'),
});

export const Setting = () => {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(settingSchema) });
  const dispatch = useDispatch();
  const settingData = useSelector(SettingsSelectors.getSettings);
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const RoleList = useSelector(RolesSelectors.getRoles);

  const approverOptions = RoleList.map(role => ({
    label: role.name,
    value: role.role_id,
  }));

  const onSubmit = async data => {
    setLoading(true);
    const payload = new FormData();
    payload.append('logo', data?.logo || null);
    payload.append('favicon', data?.favicon || null);
    payload.append('title', data?.title);
    payload.append('username', data?.username);
    payload.append('password', data?.password);

    payload.append(
      'refresh',
      data.refresh === false || data.refresh === 'Off' ? 0 : data.refresh
    );
    data.email && payload.append('email', data.email);
    payload.append(
      'approver_groups',
      JSON.stringify(data?.approver_groups || null)
    );

    try {
      dispatch(SettingsActions.createSettings(payload));
      dispatch(SettingsActions.fetchSettings());
      setLoading(false);
      if (data?.favicon) {
        changeFavicon(data.favicon);
      } else {
        changeFavicon(favicon);
      }
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
      setValue('username', settingData?.username);
      setValue('password', settingData?.password);

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
  }, [settingData, setValue, dispatch]);

  useEffect(() => {
    reset({
      approver_groups: settingData?.approver_groups.map(item => item.id),
    });
  }, [settingData, reset]);

  useEffect(() => {
    const subscription = watch(value => {
      const isModified =
        value.logo !== settingData?.logo ||
        value.favicon !== settingData?.favicon ||
        value.title !== settingData?.title ||
        value.username !== settingData?.username ||
        value.password !== settingData?.password ||
        value.refresh !==
          (settingData?.refresh === 0 ? 'Off' : settingData?.refresh) ||
        value.email !== settingData?.email ||
        value.approver_groups !== settingData?.approver_groups;

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
        <InputFields className="row">
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <SelectField
              label="Refresh"
              name="refresh"
              control={control}
              icon={<RefreshIcon />}
              errors={errors}
              defaultValue={
                settingData
                  ? {
                      label:
                        settingData.refresh === 0
                          ? 'Off'
                          : settingData?.refresh,
                      value:
                        settingData.refresh === 0
                          ? 'Off'
                          : settingData?.refresh,
                    }
                  : null
              }
              options={REFRESH_OPTIONS}
              placeholder="Select Cluster"
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <InputField
              name="email"
              register={register}
              icon={<MailIcon />}
              label={KDFM.EMAIL}
              placeholder={KDFM.ENTER_EMAIL}
              errors={errors}
            />
          </div>
        </InputFields>
        <InputFields className="row">
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
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
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
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
          </div>
        </InputFields>
        <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-8">
          <InputField
            name="title"
            register={register}
            icon={<QRIcons />}
            label={KDFM.META_TITLE}
            placeholder={KDFM.ENTER_META_TITLE}
            errors={errors}
          />
        </div>
        <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-8 mb-2">
          <SelectField
            isMulti
            name="approver_groups"
            control={control}
            icon={<QRIcons />}
            label="Approver Groups"
            errors={errors}
            options={approverOptions}
            placeholder="Select Approver Groups"
          />
        </div>
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 form-ele mt-1 mb-2">
          <LabelSelect className="mb-3">Nifi Service Account Scope</LabelSelect>
        </div>
        <InputFields className="row">
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <InputField
              name="username"
              type="text"
              label="Username"
              placeholder="Enter your Username"
              register={register}
              errors={errors}
              icon={<UserIcon />}
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <PasswordField
              name="password"
              register={register}
              errors={errors}
              watch={watch}
              label="Password"
              disableToggle={true}
              placeholder="Enter your Password"
            />
          </div>
        </InputFields>
        <FlexWrapper>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button type="submit" loading={loading} disabled={!isChanged}>
              {KDFM.SAVE_SETTINGS}
            </Button>
          </div>
        </FlexWrapper>
      </form>
    </Wrapper>
  );
};
