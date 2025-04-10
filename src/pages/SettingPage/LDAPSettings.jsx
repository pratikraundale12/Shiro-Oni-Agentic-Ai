import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { ClockIcon } from '../../assets';
import favicon from '../../assets/images/default-favicon.ico';
import { KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, SelectField, SwitchButton, TextButton } from '../../shared';
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

export const settingSchema = yup.object().shape({});
export const LDAPSettings = () => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, dirtyFields },
  } = useForm({ resolver: yupResolver(settingSchema) });
  const dispatch = useDispatch();
  const settingData = useSelector(SettingsSelectors.getSettings);
  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [ldapAutoSync, setLdapAutoSync] = useState(false);
  const [initialLdapAutoSync, setInitialLdapAutoSync] = useState(false);
  const [isLdapEnabled, setLdapInitialConfig] = useState(false);

  const Timeoptions = [
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 },
    { label: '45 minutes', value: 45 },
    { label: '1 hour', value: 59 },
  ];

  const selectedOptions = Number(watch('ldap_auto_sync_time_interval'));

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

      setLdapAutoSync(settingData?.ldap_auto_sync);
      setInitialLdapAutoSync(settingData?.ldap_auto_sync);

      setValue(
        'ldap_auto_sync_time_interval',
        settingData?.ldap_auto_sync_time_interval
      );

      setLdapInitialConfig(settingData?.ldapEnabled);
    }
  }, [settingData, setValue, dispatch]);

  useEffect(() => {
    const subscription = watch(values => {
      const isModified =
        values.refresh !==
          (settingData?.refresh === 0 ? 'Off' : settingData?.refresh) ||
        values.ldap_auto_sync_time_interval !==
          settingData?.ldap_auto_sync_time_interval ||
        values.ldap_auto_sync !== initialLdapAutoSync ||
        values.ldapEnabled !== settingData?.ldapEnabled;
      setIsChanged(isModified);
    });

    return () => subscription.unsubscribe();
  }, [watch, settingData, initialLdapAutoSync]);

  const handleLdapToggle = () => {
    setLdapInitialConfig(prevState => {
      const newState = !prevState;

      if (!newState) {
        setLdapAutoSync(false);
        setValue('ldap_auto_sync', false, { shouldDirty: true });
      }

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

      if (newState === initialLdapAutoSync) {
        setIsChanged(false);
      } else {
        setIsChanged(true);
      }
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
        <InputFields className="d-flex flex-column">
          <div>
            <SwitchButton
              id="openModalInput1"
              name="LDAP"
              checked={isLdapEnabled}
              onChange={handleLdapToggle}
              isDisabled={false}
            />
          </div>
          <div className="mt-4">
            <SwitchButton
              id="openModalInput2"
              name="AUTO SYNC"
              checked={ldapAutoSync}
              onChange={handleLdapAutoSyncToggle}
              isDisabled={!isLdapEnabled}
            />
          </div>
          <div className="mt-4 w-25">
            <SelectField
              label="LDAP Auto Sync Time"
              name="ldap_auto_sync_time_interval"
              control={control}
              icon={<ClockIcon />}
              errors={errors}
              options={Timeoptions}
              sortAlphabetically={false}
              placeholder="Select LDAP Auto Sync Time"
              value={Timeoptions.find(
                option =>
                  option.value ===
                  (watch('ldap_auto_sync_time_interval') ||
                    settingData?.ldap_auto_sync_time_interval)
              )}
              isDisabled={!ldapAutoSync}
              onChange={selectedOption => {
                const value = selectedOption?.value || null;
                setValue('ldap_auto_sync_time_interval', value);
                setIsChanged(true);
              }}
            />
          </div>
          <div className="mt-4">
            <LinkButton onClick={() => history.push('/ldap-configuration')}>
              {KDFM.CHANGE_CONFIGURATION}
            </LinkButton>
          </div>
        </InputFields>

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
                setLdapInitialConfig(settingData?.ldapEnabled);
                setLdapAutoSync(settingData?.ldap_auto_sync);
                setInitialLdapAutoSync(settingData?.ldap_auto_sync);
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
