import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  CalendarIcon,
  LogoFieldIcon,
  MailIcon,
  QRIcons,
  // RefreshIcon,
  UploadIcon,
  UserIcon,
} from '../../assets';
import { history } from '../../helpers/history';
import favicon from '../../assets/images/favicon.ico';
import {
  EMAIL_REGEX,
  EMAIL_REMINDER_OPTIONS,
  KDFM,
  // REFRESH_OPTIONS,
} from '../../constants';
import {
  Button,
  InputField,
  SelectField,
  UploadField,
  PasswordField,
  SwitchButton,
  TextButton,
} from '../../shared';
import { RolesSelectors } from '../../store';
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
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  margin-top: auto;
  bottom: 20px;
`;
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const HeadingContent = styled.div`
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
`;
const HeadingContentHr = styled.div`
  margin-left: -24px;
  margin-right: -24px;
  border-bottom: 1px solid #ccc;
`;

const EmphasisText = styled.em`
  font-style: italic;
  font-size: 13px !important;
  font-weight: 500;
`;

const LinkButton = styled(TextButton)`
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fontRedHat};
  font-weight: 800;
  font-size: 14px;
  text-transform: capitalize;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

export const settingSchema = yup.object().shape({
  email: yup
    .string()
    .matches(EMAIL_REGEX, 'Invalid email address. Please check & try again')
    .max(50, 'Email can not be greater than 25 characters'),
  fromEmail: yup
    .string()
    .matches(EMAIL_REGEX, 'Invalid email address. Please check & try again')
    .max(50, 'Email can not be greater than 25 characters'),
  title: yup
    .string()
    .max(25, 'Title must be 25 characters or less')
    .matches(/^[a-zA-Z0-9\s]+$/, 'Title must not contain special characters')
    .required('Title is required'),

  group_email_id: yup
    .string()
    .nullable()

    .matches(EMAIL_REGEX, 'Invalid email address. Please check & try again')
    .max(50, 'Email can not be greater than 25 characters'),

  approver_groups: yup
    .mixed()
    .test(
      'is-valid',
      'Please select at least one approver group',
      value => value !== undefined && value !== null && value !== ''
    ),
});

export const Setting = () => {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm({ resolver: yupResolver(settingSchema) });
  const dispatch = useDispatch();
  const settingData = useSelector(SettingsSelectors.getSettings);
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const RoleList = useSelector(RolesSelectors.getRoles);
  const [ldapAutoSync, setLdapAutoSync] = useState(false);
  const [isLdapEnabled, setLdapInitialConfig] = useState(false);

  const approverOptions = RoleList.map(role => ({
    label: role.name,
    value: role.role_id,
  }));
  const Timeoptions = [
    { label: '1 hour', value: 59 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
  ];

  const selectedOptions = Number(watch('ldap_auto_sync_time_interval'));
  const onSubmit = async data => {
    setLoading(true);
    const payload = new FormData();
    const updatedFields = [];

    if (settingData?.id) payload.append('id', settingData.id);

    if (dirtyFields.logo && data?.logo !== settingData?.logo) {
      payload.append('logo', data?.logo || null);
      updatedFields.push('logo');
    }

    if (dirtyFields.favicon && data?.favicon !== settingData?.favicon) {
      payload.append('favicon', data?.favicon || null);
      updatedFields.push('favicon');
    }

    if (dirtyFields.title && data?.title !== settingData?.title) {
      payload.append('title', data?.title);
      updatedFields.push('title');
    }

    if (dirtyFields.username && data?.username !== settingData?.username) {
      payload.append('username', data?.username);
      updatedFields.push('username');
    }

    if (dirtyFields.password && data.password !== settingData?.password) {
      payload.append('password', data.password);
      updatedFields.push('password');
    }

    if (dirtyFields.email && data?.email !== settingData?.email) {
      payload.append('email', data?.email);
      updatedFields.push('email');
    }

    if (dirtyFields.fromEmail && data?.fromEmail !== settingData?.fromEmail) {
      payload.append('fromEmail', data?.fromEmail);
      updatedFields.push('fromEmail');
    }

    if (dirtyFields.refresh || data.refresh !== settingData?.refresh) {
      const refreshValue =
        data.refresh === false || data.refresh === 'Off' ? 0 : data.refresh;
      payload.append('refresh', refreshValue);
      updatedFields.push('refresh');
    }

    if (
      dirtyFields.approver_groups &&
      data?.approver_groups !== settingData?.approver_groups
    ) {
      payload.append('approver_groups', data?.approver_groups);
      updatedFields.push('approver_groups');
    }

    if (
      dirtyFields.group_email_id &&
      data?.group_email_id !== settingData?.group_email_id
    ) {
      payload.append('group_email_id', data?.group_email_id);
      updatedFields.push('group_email_id');
    }

    if (
      dirtyFields.email_reminder_time &&
      data?.email_reminder_time !== settingData?.email_reminder_time
    ) {
      payload.append('email_reminder_time', data?.email_reminder_time);
      updatedFields.push('email_reminder_time');
    }

    if (
      (dirtyFields.ldapEnabled &&
        data?.ldapEnabled !== settingData?.ldapEnabled) ||
      (dirtyFields.ldap_auto_sync &&
        data?.ldap_auto_sync !== settingData?.ldap_auto_sync) ||
      (dirtyFields.ldap_auto_sync_time_interval &&
        data?.ldap_auto_sync_time_interval !==
          settingData?.ldap_auto_sync_time_interval)
    ) {
      payload.append('ldapEnabled', isLdapEnabled);

      payload.append('ldap_auto_sync', ldapAutoSync);
      updatedFields.push('ldap_auto_sync');

      if (ldapAutoSync) {
        payload.append('ldap_auto_sync_time_interval', selectedOptions);
        updatedFields.push('ldap_auto_sync_time_interval');
      }

      updatedFields.push('ldapEnabled');
    }

    try {
      if (updatedFields.length > 0) {
        dispatch(SettingsActions.createSettings(payload));
        setTimeout(() => {
          dispatch(SettingsActions.fetchSettings());
        }, 1000);
        setLoading(false);
        if (data?.favicon) {
          changeFavicon(data.favicon);
        } else {
          changeFavicon(favicon);
        }
      } else {
        setLoading(false);
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
        settingData.refresh === 0 ? 'Off' : settingData.refresh
      );

      setLdapAutoSync(settingData?.ldap_auto_sync);
      setValue(
        'ldap_auto_sync_time_interval',
        settingData?.ldap_auto_sync_time_interval
      );
      setValue('email_reminder_time', settingData?.email_reminder_time);
      setValue('group_email_id', settingData?.group_email_id);
      setValue('email', settingData?.email);
      setValue('fromEmail', settingData?.fromEmail);
      setValue('approver_groups', settingData.approver_groups || '');
      setLdapInitialConfig(settingData?.ldapEnabled);
      const logoElement = document.getElementById('logo');
      if (logoElement && settingData?.logo) {
        logoElement.src = settingData.logo;
      }
    }
  }, [settingData, setValue, dispatch]);

  useEffect(() => {
    const subscription = watch(value => {
      const isModified =
        value.logo !== settingData?.logo ||
        value.favicon !== settingData?.favicon ||
        value.title !== settingData?.title ||
        value.username !== settingData?.username ||
        value.password !== settingData?.password ||
        value.refresh !==
          (settingData?.refresh === 0 ? 'Off' : settingData?.refresh) || // Direct comparison to the original value
        value.email !== settingData?.email ||
        value.fromEmail !== settingData?.fromEmail ||
        value.ldap_auto_sync_time_interval !==
          settingData?.ldap_auto_sync_time_interval ||
        value.ldap_auto_sync !== settingData?.ldap_auto_sync ||
        value.approver_groups !== settingData?.approver_groups ||
        value.group_email_id !== settingData?.group_email_id ||
        value.email_reminder_time !== settingData?.email_reminder_time ||
        value.ldapEnabled !== settingData?.ldapEnabled;

      setIsChanged(isModified);
    });

    return () => subscription.unsubscribe();
  }, [watch, settingData]);

  const handleLdapToggle = () => {
    setLdapInitialConfig(prevState => {
      const newState = !prevState;

      if (!newState) {
        setLdapAutoSync(false);
        setValue('ldap_auto_sync', false, { shouldDirty: true });
      }

      setIsChanged(true);
      setValue('ldapEnabled', newState, { shouldDirty: true });
      return newState;
    });
  };

  const handleLdapAutoSyncToggle = () => {
    if (!isLdapEnabled) {
      return;
    }

    setLdapAutoSync(prevState => {
      const newState = !prevState;
      setValue('ldap_auto_sync', newState, { shouldDirty: true });
      setIsChanged(true);
      return newState;
    });
  };

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
        <div className="d-flex justify-content-start me-4">
          <HeadingContent>{KDFM.APP}</HeadingContent>
        </div>
        <HeadingContentHr className="mt-3 mb-4" />
        <InputFields className="row">
          {/* <div className="col-xl-2 col-lg-6 col-md-6 col-sm-6 col-6">
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
          </div> */}
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <InputField
              name="email"
              register={register}
              icon={<MailIcon />}
              label={KDFM.SUPPORT_EMAIL}
              placeholder={KDFM.ENTER_EMAIL}
              errors={errors}
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <InputField
              name="fromEmail"
              register={register}
              icon={<MailIcon />}
              label={KDFM.FROM_EMAIL}
              placeholder={KDFM.ENTER_EMAIL}
              errors={errors}
            />
          </div>
          <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-6">
            <InputField
              name="title"
              register={register}
              icon={<QRIcons />}
              label={KDFM.META_TITLE}
              placeholder={KDFM.ENTER_META_TITLE}
              errors={errors}
            />
          </div>
        </InputFields>

        <InputFields className="row">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">
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
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">
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
        <div className="d-flex justify-content-start me-4">
          <HeadingContent className="mt-4">{KDFM.LDAP}</HeadingContent>
        </div>
        <HeadingContentHr className="mt-3 mb-4" />
        <InputFields className="row">
          <div className="col-6 col-sm-4 col-lg-3 col-xl-2 mt-4">
            <SwitchButton
              id="openModalInput"
              name="LDAP"
              checked={isLdapEnabled}
              onChange={handleLdapToggle}
              isDisabled={false}
            />
          </div>
          <div className="col-6 col-sm-4 col-lg-3 col-xl-2 mt-4">
            <SwitchButton
              id="openModalInput"
              name="AUTO SYNC"
              checked={ldapAutoSync}
              onChange={handleLdapAutoSyncToggle}
              isDisabled={!isLdapEnabled}
            />
          </div>
          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-6 mb-4">
            <SelectField
              label="LDAP Auto Sync Time"
              name="ldap_auto_sync_time_interval"
              control={control}
              icon={<QRIcons />}
              errors={errors}
              options={Timeoptions}
              placeholder="Select LDAP Auto Sync Time"
              value={Timeoptions.find(
                option =>
                  option.value ===
                  (watch('ldap_auto_sync_time_interval') ||
                    settingData?.ldap_auto_sync_time_interval)
              )} // Watch the value or use settingData fallback
              isDisabled={!ldapAutoSync}
              onChange={selectedOption => {
                const value = selectedOption?.value || null;
                setValue('ldap_auto_sync_time_interval', value);
                setIsChanged(true);
              }}
            />
          </div>
          <div className="col-md mt-5">
            <LinkButton onClick={() => history.push('/ldap-configuration')}>
              {KDFM.CHANGE_CONFIGURATION}
            </LinkButton>
          </div>
        </InputFields>
        <div className="d-flex justify-content-start me-4">
          <HeadingContent className="mt-2">
            {KDFM.SCHEDULE_DIPLOYMENT}
          </HeadingContent>
        </div>
        <HeadingContentHr className="mt-3 mb-4" />
        <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-8 mb-4">
          <SelectField
            label="Approver Groups"
            name="approver_groups"
            control={control}
            icon={<QRIcons />}
            errors={errors}
            options={approverOptions}
            placeholder="Select Approver Groups"
            value={approverOptions.find(
              option =>
                option.value ===
                (watch('approver_groups') || settingData?.approver_groups)
            )}
          />
        </div>
        <InputFields className="row">
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <InputField
              name="group_email_id"
              register={register}
              icon={<MailIcon />}
              label={KDFM.GROUP_EMAIL}
              placeholder={KDFM.ENTER_GROUP_EMAIL}
              errors={errors}
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
            <LabelSelect className="mb-3">
              {KDFM.EMAIL_REMINDER}
              <EmphasisText> ({KDFM.REMINDER_EMPHASISED_TEXT})</EmphasisText>
            </LabelSelect>
            <SelectField
              name="email_reminder_time"
              control={control}
              icon={<CalendarIcon />}
              errors={errors}
              options={EMAIL_REMINDER_OPTIONS}
              placeholder="Select Reminter Time"
              defaultValue={EMAIL_REMINDER_OPTIONS[0]}
            />
          </div>
        </InputFields>
        <div className="d-flex justify-content-start me-4">
          <HeadingContent className="mt-4">
            {KDFM.SERVICE_ACCOUNT}
          </HeadingContent>
        </div>
        <HeadingContentHr className="mt-3 mb-4" />
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
                disableToggle={false}
                placeholder="Enter your Password"
              />
            </div>
          </InputFields>
        </div>

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
