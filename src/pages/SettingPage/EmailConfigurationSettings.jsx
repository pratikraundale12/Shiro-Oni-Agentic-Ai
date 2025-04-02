import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { MailIcon, QRIcons } from '../../assets';
import favicon from '../../assets/images/default-favicon.ico';
import { EMAIL_REGEX, KDFM } from '../../constants';
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

export const settingSchema = yup.object().shape({
  from_email: yup
    .string()
    .required('From email is required')
    .nullable()
    .matches(EMAIL_REGEX, 'Invalid email address. Please check & try again')
    .max(50, 'Email can not be greater than 25 characters'),

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
});
export const EmailConfigurationSettings = () => {
  const {
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

    appendIfChanged('from_email', data?.from_email, settingData?.from_email);

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

      setValue(
        'refresh',
        settingData.refresh === 0 ? 'Off' : String(settingData.refresh)
      );

      setValue('from_email', settingData?.from_email);
      setValue('smtp_service', settingData?.smtp_service);

      setValue('smtp_host', settingData?.smtp_host);

      setValue('smtp_port', settingData?.smtp_port);

      setValue('smtp_user', settingData?.smtp_user);

      setValue('smtp_pass', settingData?.smtp_pass);
    }
  }, [settingData, setValue, dispatch]);

  useEffect(() => {
    const subscription = watch(value => {
      const isModified =
        value.refresh !==
          (settingData?.refresh === 0 ? 'Off' : settingData?.refresh) || // Direct comparison to the original value
        value.from_email !== settingData?.from_email ||
        value.smtp_service !== settingData?.smtp_service ||
        value.smtp_host !== settingData?.smtp_host ||
        value.smtp_port !== settingData?.smtp_port ||
        value.smtp_user !== settingData?.smtp_user ||
        value.smtp_pass !== settingData?.smtp_pass;
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
