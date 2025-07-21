import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  ExportIcon,
  CurvedSSOLoginIcon,
  CurvedProfileIcon,
} from '../../assets';
import favicon from '../../assets/images/default-favicon.ico';
import { KDFM, SSO_LOGIN_TYPE } from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField, SelectField, SwitchButton } from '../../shared';
import { SettingsActions, SettingsSelectors } from '../../store/settings';
import KeycloakCredentialSection from './KeycloakCredentialSection';

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

export const settingSchema = yup.object().shape({
  selected_sso: yup.string().nullable(),

  azure_redirect_uri: yup
    .string()
    .nullable()
    .when('selected_sso', {
      is: val => val === 'azure',
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
export const SSOLoginSettings = () => {
  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({ resolver: yupResolver(settingSchema) });
  const dispatch = useDispatch();
  const settingData = useSelector(SettingsSelectors.getSettings);
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [ssoEnabledState, setSsoEnabledState] = useState(false);
  const initialSsoEnabled = settingData?.sso_enabled || false;

  const onSubmit = async data => {
    setLoading(true);
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

      setValue(
        'refresh',
        settingData.refresh === 0 ? 'Off' : String(settingData.refresh)
      );

      setValue('selected_sso', settingData?.selected_sso);
      setValue('azure_client_id', settingData?.azure_client_id);
      setValue('azure_redirect_uri', settingData?.azure_redirect_uri);
      setValue('azure_client_secret', settingData?.azure_client_secret);
      setValue('azure_tenant_id', settingData?.azure_tenant_id);
      setValue('sso_enabled', settingData?.sso_enabled);
      setSsoEnabledState(settingData?.sso_enabled || false);
      setValue('keycloak_realm', settingData?.keycloak_realm);
      setValue('keycloak_url', settingData?.keycloak_url);
      setValue('keycloak_client_id', settingData?.keycloak_client_id);
    }
  }, [settingData, setValue, dispatch]);

  useEffect(() => {
    const subscription = watch(value => {
      const isModified =
        value.refresh !==
          (settingData?.refresh === 0 ? 'Off' : settingData?.refresh) ||
        value.selected_sso !== settingData?.selected_sso ||
        value.azure_client_id !== settingData?.azure_client_id ||
        value.azure_tenant_id !== settingData?.azure_tenant_id ||
        value.azure_redirect_uri !== settingData?.azure_redirect_uri ||
        value.azure_client_secret !== settingData?.azure_client_secret ||
        value.sso_enabled !== settingData?.sso_enabled ||
        value?.keycloak_realm !== settingData?.keycloak_realm ||
        value?.keycloak_url !== settingData?.keycloak_url ||
        value?.keycloak_client_id !== settingData?.keycloak_client_id;
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

  const selectedSSO = watch('selected_sso');
  const ssoEnabled = watch('sso_enabled');

  const toggleSsoEnabled = () => {
    setSsoEnabledState(prevState => {
      const newState = !prevState;
      setValue('sso_enabled', newState, { shouldDirty: true });

      if (newState === initialSsoEnabled) {
        setIsChanged(false);
      } else {
        setIsChanged(true);
      }

      return newState;
    });
  };

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
        <>
          <InputFields className="row mb-4 align-items-center">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
              <Controller
                name="sso_enabled"
                control={control}
                render={() => (
                  <SwitchButton
                    id="openModalInput1"
                    name="SSO"
                    checked={ssoEnabledState}
                    onChange={toggleSsoEnabled}
                    isDisabled={false}
                  />
                )}
              />
            </div>
          </InputFields>

          {ssoEnabled && (
            <>
              <InputFields className="row mb-4">
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                  <SelectField
                    label={KDFM.SSO_LOGIN_TYPE}
                    name="selected_sso"
                    control={control}
                    icon={<CurvedSSOLoginIcon />}
                    errors={errors}
                    options={SSO_LOGIN_TYPE}
                    placeholder="Select SSO Login Type"
                    required={true}
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
                        icon={<CurvedProfileIcon />}
                        label="Azure Client ID"
                        placeholder="Enter Client ID"
                        errors={errors}
                        required
                      />
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="azure_client_secret"
                        register={register}
                        icon={<CurvedProfileIcon />}
                        label="Azure Client Secret"
                        placeholder="Enter Client Secret"
                        errors={errors}
                        required
                      />
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="azure_tenant_id"
                        register={register}
                        icon={<CurvedProfileIcon />}
                        label="Azure Tenant ID"
                        placeholder="Enter Tenant ID"
                        errors={errors}
                        required
                      />
                    </div>
                  </InputFields>

                  <InputFields className="row mb-4 align-items-center">
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="azure_redirect_uri"
                        register={register}
                        icon={<ExportIcon color="#444445" />}
                        label="Azure Redirect URI"
                        placeholder="Enter Redirect URI"
                        errors={errors}
                        required
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
                        icon={<CurvedProfileIcon />}
                        label="Client ID"
                        placeholder="Enter Client ID"
                        errors={errors}
                        required
                      />
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="keycloak_url"
                        register={register}
                        icon={<ExportIcon color="#444445" />}
                        label="URL"
                        placeholder="Enter URL"
                        errors={errors}
                        required
                      />
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mt-1">
                      <InputField
                        name="keycloak_realm"
                        register={register}
                        icon={<ExportIcon color="#444445" />}
                        label="Realm"
                        placeholder="Enter Realm"
                        errors={errors}
                        required
                      />
                    </div>
                    <KeycloakCredentialSection />
                  </InputFields>
                </>
              )}
            </>
          )}
        </>

        <FlexWrapper className="mt-3">
          <ButtonDiv>
            <StyledCancelButton
              variant="secondary"
              type="cancel"
              loading={loading}
              disabled={!isChanged}
              onClick={() => {
                reset(settingData);
                setSsoEnabledState(settingData?.sso_enabled || false);
                setIsChanged(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </StyledCancelButton>
            <StyledSaveButton
              type="submit"
              loading={loading}
              disabled={!isChanged}
            >
              <ButtonText>{KDFM.SAVE_SETTINGS}</ButtonText>
            </StyledSaveButton>
          </ButtonDiv>
        </FlexWrapper>
      </form>
    </Wrapper>
  );
};
