import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  CalendarIcon,
  LoginIcon,
  LogoFieldIcon,
  MailIcon,
  OpenLinkIcon,
  QRIcons,
  // RefreshIcon,
  UploadIcon,
  UserIcon,
} from '../../assets';
import favicon from '../../assets/images/default-favicon.ico';
import {
  EMAIL_REGEX,
  EMAIL_REMINDER_OPTIONS,
  KDFM,
  SCHEDULE_LIST_REFRESH_OPTIONS,
  SSO_LOGIN_TYPE,
} from '../../constants';
import { history } from '../../helpers/history';
import {
  Button,
  CheckboxField,
  InputField,
  PasswordField,
  SelectField,
  SwitchButton,
  TextButton,
  UploadField,
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
    .required('Support email is required')
    .matches(EMAIL_REGEX, 'Invalid email address. Please check & try again')
    .max(50, 'Email can not be greater than 25 characters'),
  from_email: yup
    .string()
    .required('From email is required')
    .nullable()
    .matches(EMAIL_REGEX, 'Invalid email address. Please check & try again')
    .max(50, 'Email can not be greater than 25 characters'),
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .max(25, 'Title must be 25 characters or less')
    .matches(/^[a-zA-Z0-9\s]+$/, 'Title must not contain special characters'),
  group_email_id: yup
    .string()
    .required('Group email is required')
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
  smtp_service: yup
    .string()
    .nullable()
    .test(
      'smtp-service-required',
      'SMTP Service is required',
      function (value) {
        const { smtp_host, smtp_port, smtp_user, smtp_pass } = this.parent;
        if (smtp_host || smtp_port || smtp_user || smtp_pass) {
          return value ? true : false;
        }
        return true;
      }
    ),

  smtp_host: yup
    .string()
    .nullable()
    .test('smtp-host-required', 'SMTP Host is required', function (value) {
      const { smtp_service, smtp_port, smtp_user, smtp_pass } = this.parent;
      if (smtp_service || smtp_port || smtp_user || smtp_pass) {
        return value ? true : false;
      }
      return true;
    }),

  smtp_port: yup
    .string()
    .nullable()
    .test('smtp-port-required', 'SMTP Port is required', function (value) {
      const { smtp_service, smtp_host, smtp_user, smtp_pass } = this.parent;
      if (smtp_service || smtp_host || smtp_user || smtp_pass) {
        return value ? true : false;
      }
      return true;
    }),

  smtp_user: yup
    .string()
    .nullable()
    .test('smtp-user-required', 'SMTP User is required', function (value) {
      const { smtp_service, smtp_host, smtp_port, smtp_pass } = this.parent;
      if (smtp_service || smtp_host || smtp_port || smtp_pass) {
        return value ? true : false;
      }
      return true;
    }),

  smtp_pass: yup
    .string()
    .nullable()
    .test('smtp-pass-required', 'SMTP Password is required', function (value) {
      const { smtp_service, smtp_host, smtp_port, smtp_user } = this.parent;
      if (smtp_service || smtp_host || smtp_port || smtp_user) {
        return value ? true : false;
      }
      return true;
    }),
  selected_sso: yup.string().nullable(),

  azure_redirect_uri: yup
    .string()
    .nullable()
    .when('selected_sso', {
      is: val => val === 'azure', // Adjust based on the actual value in selected_sso
      then: schema => schema.required('Azure Redirect URI is required'),
      otherwise: schema => schema.nullable(),
    }),

  azure_client_id: yup
    .string()
    .nullable()
    .when('selected_sso', {
      is: val => val === 'azure',
      then: schema => schema.required('Azure Client ID is required'),
      otherwise: schema => schema.nullable(),
    }),

  azure_client_secret: yup
    .string()
    .nullable()
    .when('selected_sso', {
      is: val => val === 'azure',
      then: schema => schema.required('Azure Client Secret is required'),
      otherwise: schema => schema.nullable(),
    }),

  azure_tenant_id: yup
    .string()
    .nullable()
    .when('selected_sso', {
      is: val => val === 'azure',
      then: schema => schema.required('Azure Tenant ID is required'),
      otherwise: schema => schema.nullable(),
    }),
  keycloak_client_id: yup
    .string()
    .nullable()
    .when('selected_sso', {
      is: val => val === 'keycloak',
      then: schema => schema.required('Keycloak Client ID is required'),
      otherwise: schema => schema.nullable(),
    }),

  keycloak_url: yup
    .string()
    .nullable()
    .when('selected_sso', {
      is: val => val === 'keycloak',
      then: schema => schema.required('Keycloak URL is required'),
      otherwise: schema => schema.nullable(),
    }),

  keycloak_realm: yup
    .string()
    .nullable()
    .when('selected_sso', {
      is: val => val === 'keycloak',
      then: schema => schema.required('Keycloak Realm is required'),
      otherwise: schema => schema.nullable(),
    }),
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

    const appendIfChanged = (key, value, compareValue) => {
      if (dirtyFields[key] && value !== compareValue) {
        payload.append(key, value);
        updatedFields.push(key);
      }
    };

    if (settingData?.id) payload.append('id', settingData.id);

    appendIfChanged('logo', data?.logo || null, settingData?.logo);
    appendIfChanged('favicon', data?.favicon || null, settingData?.favicon);
    appendIfChanged('title', data?.title, settingData?.title);
    appendIfChanged('username', data?.username, settingData?.username);
    appendIfChanged('password', data?.password, settingData?.password);
    appendIfChanged('email', data?.email, settingData?.email);
    appendIfChanged('from_email', data?.from_email, settingData?.from_email);
    appendIfChanged(
      'approver_groups',
      data?.approver_groups,
      settingData?.approver_groups
    );
    appendIfChanged(
      'group_email_id',
      data?.group_email_id,
      settingData?.group_email_id
    );
    appendIfChanged(
      'email_reminder_time',
      data?.email_reminder_time,
      settingData?.email_reminder_time
    );
    appendIfChanged(
      'selected_sso',
      data?.selected_sso,
      settingData?.selected_sso
    );
    appendIfChanged(
      'azure_client_id',
      data?.azure_client_id,
      settingData?.azure_client_id
    );
    appendIfChanged(
      'azure_redirect_uri',
      data?.azure_redirect_uri,
      settingData?.azure_redirect_uri
    );
    appendIfChanged(
      'azure_tenant_id',
      data?.azure_tenant_id,
      settingData?.azure_tenant_id
    );
    appendIfChanged(
      'azure_client_secret',
      data?.azure_client_secret,
      settingData?.azure_client_secret
    );
    appendIfChanged('sso_enabled', data?.sso_enabled, settingData?.sso_enabled);
    appendIfChanged(
      'keycloak_realm',
      data?.keycloak_realm,
      settingData?.keycloak_realm
    );
    appendIfChanged(
      'keycloak_url',
      data?.keycloak_url,
      settingData?.keycloak_url
    );
    appendIfChanged(
      'keycloak_client_id',
      data?.keycloak_client_id,
      settingData?.keycloak_client_id
    );

    appendIfChanged(
      'smtp_service',
      data?.smtp_service,
      settingData?.smtp_service
    );
    appendIfChanged('smtp_host', data?.smtp_host, settingData?.smtp_host);
    appendIfChanged('smtp_port', data?.smtp_port, settingData?.smtp_port);
    appendIfChanged('smtp_user', data?.smtp_user, settingData?.smtp_user);
    appendIfChanged('smtp_pass', data?.smtp_pass, settingData?.smtp_pass);

    if (dirtyFields.refresh || data.refresh !== settingData?.refresh) {
      const refreshValue = [false, 'Off'].includes(data.refresh)
        ? 0
        : data.refresh;
      appendIfChanged('refresh', refreshValue, settingData?.refresh);
    }

    if (
      ['ldapEnabled', 'ldap_auto_sync', 'ldap_auto_sync_time_interval'].some(
        field => dirtyFields[field] && data[field] !== settingData?.[field]
      )
    ) {
      payload.append('ldapEnabled', isLdapEnabled);
      payload.append('ldap_auto_sync', ldapAutoSync);
      updatedFields.push('ldapEnabled', 'ldap_auto_sync');
      if (ldapAutoSync) {
        payload.append('ldap_auto_sync_time_interval', selectedOptions);
        updatedFields.push('ldap_auto_sync_time_interval');
      }
    }

    try {
      if (updatedFields.length > 0) {
        dispatch(SettingsActions.createSettings(payload));
        setTimeout(() => {
          dispatch(SettingsActions.fetchSettings());
          history.push('/setting');
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
      setValue('logo', settingData?.logo);
      setValue('favicon', settingData?.favicon);
      setValue('title', settingData?.title);
      setValue('username', settingData?.username);
      setValue('password', settingData?.password);

      setValue(
        'refresh',
        settingData.refresh === 0 ? 'Off' : String(settingData.refresh)
      );

      setLdapAutoSync(settingData?.ldap_auto_sync);
      setValue(
        'ldap_auto_sync_time_interval',
        settingData?.ldap_auto_sync_time_interval
      );
      setValue('email_reminder_time', settingData?.email_reminder_time);
      setValue('selected_sso', settingData?.selected_sso);
      setValue('group_email_id', settingData?.group_email_id);
      setValue('azure_client_id', settingData?.azure_client_id);
      setValue('azure_redirect_uri', settingData?.azure_redirect_uri);
      setValue('azure_client_secret', settingData?.azure_client_secret);
      setValue('azure_tenant_id', settingData?.azure_tenant_id);
      setValue('sso_enabled', settingData?.sso_enabled);
      setValue('keycloak_realm', settingData?.keycloak_realm);
      setValue('keycloak_url', settingData?.keycloak_url);
      setValue('keycloak_client_id', settingData?.keycloak_client_id);
      setValue('email', settingData?.email);
      setValue('from_email', settingData?.from_email);
      setValue('smtp_service', settingData?.smtp_service);

      setValue('smtp_host', settingData?.smtp_host);

      setValue('smtp_port', settingData?.smtp_port);

      setValue('smtp_user', settingData?.smtp_user);

      setValue('smtp_pass', settingData?.smtp_pass);

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
        value.from_email !== settingData?.from_email ||
        value.smtp_service !== settingData?.smtp_service ||
        value.smtp_host !== settingData?.smtp_host ||
        value.smtp_port !== settingData?.smtp_port ||
        value.smtp_user !== settingData?.smtp_user ||
        value.smtp_pass !== settingData?.smtp_pass ||
        value.ldap_auto_sync_time_interval !==
          settingData?.ldap_auto_sync_time_interval ||
        value.ldap_auto_sync !== settingData?.ldap_auto_sync ||
        value.approver_groups !== settingData?.approver_groups ||
        value.group_email_id !== settingData?.group_email_id ||
        value.email_reminder_time !== settingData?.email_reminder_time ||
        value.selected_sso !== settingData?.selected_sso ||
        value.azure_client_id !== settingData?.azure_client_id ||
        value.azure_tenant_id !== settingData?.azure_tenant_id ||
        value.azure_redirect_uri !== settingData?.azure_redirect_uri ||
        value.azure_client_secret !== settingData?.azure_client_secret ||
        value.sso_enabled !== settingData?.sso_enabled ||
        value.ldapEnabled !== settingData?.ldapEnabled ||
        value?.keycloak_realm !== settingData?.keycloak_realm ||
        value?.keycloak_url !== settingData?.keycloak_url ||
        value?.keycloak_client_id !== settingData?.keycloak_client_id;
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

  const selectedSSO = watch('selected_sso');
  const ssoEnabled = watch('sso_enabled');
  useEffect(() => {
    if (ssoEnabled === false) {
      setValue('selected_sso', null);
      setValue('azure_client_id', null);
      setValue('azure_client_secret', null);
      setValue('azure_tenant_id', null);
      setValue('azure_redirect_uri', null);
      setValue('keycloak_client_id', null);
      setValue('keycloak_url', null);
      setValue('keycloak_realm', null);
    }
  }, [ssoEnabled, setValue, selectedSSO]);

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
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">
            <InputField
              name="email"
              register={register}
              icon={<MailIcon />}
              label={KDFM.SUPPORT_EMAIL}
              placeholder={KDFM.ENTER_EMAIL}
              errors={errors}
            />
          </div>

          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-6">
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
              label="Logo "
              labelWarning="(allowed: jpeg, jpg, png)"
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
              labelWarning="(allowed: ico, png)"
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
          <HeadingContent className="mt-4">{KDFM.SMTP}</HeadingContent>
        </div>
        <HeadingContentHr className="mt-3 mb-4" />
        <InputFields className="row">
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <InputField
              name="smtp_service"
              register={register}
              icon={<QRIcons />}
              label={KDFM.SMTP_SERVICE}
              placeholder={KDFM.ENTER_SMTP_SERVICE}
              errors={errors}
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <InputField
              name="smtp_host"
              register={register}
              icon={<QRIcons />}
              label={KDFM.SMTP_HOST}
              placeholder={KDFM.ENTER_SMTP_HOST}
              errors={errors}
            />
          </div>
          <div className="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-6">
            <InputField
              name="smtp_port"
              register={register}
              icon={<QRIcons />}
              label={KDFM.SMTP_PORT}
              placeholder={KDFM.ENTER_SMTP_PORT}
              errors={errors}
            />
          </div>
        </InputFields>
        <InputFields className="row">
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <InputField
              name="smtp_user"
              register={register}
              icon={<QRIcons />}
              label={KDFM.SMTP_USER}
              placeholder={KDFM.ENTER_SMTP_USER}
              errors={errors}
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <PasswordField
              name="smtp_pass"
              register={register}
              watch={watch}
              label={KDFM.SMTP_PASS}
              placeholder={KDFM.ENTER_SMTP_PASS}
              disableToggle={false}
              errors={errors}
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
            <InputField
              name="from_email"
              register={register}
              icon={<MailIcon />}
              label={KDFM.FROM_EMAIL}
              placeholder={KDFM.ENTER_EMAIL}
              errors={errors}
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
              id="openModalInput1"
              name="LDAP"
              checked={isLdapEnabled}
              onChange={handleLdapToggle}
              isDisabled={false}
            />
          </div>
          <div className="col-6 col-sm-4 col-lg-3 col-xl-2 mt-4">
            <SwitchButton
              id="openModalInput2"
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
              placeholder="Select Reminder Time"
              defaultValue={EMAIL_REMINDER_OPTIONS[0]}
            />
          </div>
          <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
            <LabelSelect className="mb-3">
              {KDFM.DEPLOYMENT_SCHEDULE_LIST_REFRESH}
            </LabelSelect>
            <SelectField
              name="refresh"
              control={control}
              icon={<CalendarIcon />}
              errors={errors}
              options={SCHEDULE_LIST_REFRESH_OPTIONS}
              placeholder="Deployment Schedule Refresh Time"
              sortAlphabetically={false}
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

        <div className="d-flex justify-content-start me-4">
          <HeadingContent className="mt-4">{KDFM.SSO_LoGIN}</HeadingContent>
        </div>
        <HeadingContentHr className="mt-3 mb-4" />
        <>
          <InputFields className="row mb-4 align-items-center">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
              <CheckboxField
                name="sso_enabled"
                label="SSO Enabled"
                register={register}
              />
            </div>
          </InputFields>

          {ssoEnabled && (
            <>
              <InputFields className="row mb-4">
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                  <LabelSelect className="mb-3">{KDFM.LOGIN_TYPE}</LabelSelect>
                  <SelectField
                    name="selected_sso"
                    control={control}
                    icon={<LoginIcon />}
                    errors={errors}
                    options={SSO_LOGIN_TYPE}
                    placeholder="Select SSO Login Type"
                  />
                </div>
              </InputFields>

              {selectedSSO === 'azure' && (
                <>
                  <InputFields className="row mb-4">
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="azure_client_id"
                        register={register}
                        icon={<UserIcon />}
                        label="Azure Client ID"
                        placeholder="Enter Client ID"
                        errors={errors}
                      />
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="azure_client_secret"
                        register={register}
                        icon={<UserIcon />}
                        label="Azure Client Secret"
                        placeholder="Enter Client Secret"
                        errors={errors}
                      />
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="azure_tenant_id"
                        register={register}
                        icon={<UserIcon />}
                        label="Azure Tenant ID"
                        placeholder="Enter Tenant ID"
                        errors={errors}
                      />
                    </div>
                  </InputFields>

                  <InputFields className="row mb-4 align-items-center">
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="azure_redirect_uri"
                        register={register}
                        icon={<OpenLinkIcon color="#444445" />}
                        label="Azure Redirect URI"
                        placeholder="Enter Redirect URI"
                        errors={errors}
                      />
                    </div>
                  </InputFields>
                </>
              )}
              {selectedSSO === 'keycloak' && (
                <>
                  <InputFields className="row mb-4">
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="keycloak_client_id"
                        register={register}
                        icon={<UserIcon />}
                        label="Client ID"
                        placeholder="Enter Client ID"
                        errors={errors}
                      />
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="keycloak_url"
                        register={register}
                        icon={<OpenLinkIcon color="#444445" />}
                        label="URL"
                        placeholder="Enter URL"
                        errors={errors}
                      />
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="keycloak_realm"
                        register={register}
                        icon={<OpenLinkIcon color="#444445" />}
                        label="Realm"
                        placeholder="Enter Realm"
                        errors={errors}
                      />
                    </div>
                  </InputFields>
                </>
              )}
            </>
          )}
        </>

        <FlexWrapper className="mt-3">
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
