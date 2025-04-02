import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { LogoFieldIcon, MailIcon, QRIcons, UploadIcon } from '../../assets';
import favicon from '../../assets/images/default-favicon.ico';
import { EMAIL_REGEX, KDFM } from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField, UploadField } from '../../shared';
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
  email: yup
    .string()
    .required('Support email is required')
    .matches(EMAIL_REGEX, 'Invalid email address. Please check & try again')
    .max(50, 'Email can not be greater than 25 characters'),
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .max(25, 'Title must be 25 characters or less')
    .matches(/^[a-zA-Z0-9\s]+$/, 'Title must not contain special characters'),
});
export const AppSettings = () => {
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

    appendIfChanged('logo', data?.logo, settingData?.logo, true);
    appendIfChanged('favicon', data?.favicon, settingData?.favicon, true);
    appendIfChanged('title', data?.title, settingData?.title);
    appendIfChanged('email', data?.email, settingData?.email);

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
      setValue('logo', settingData?.logo);
      setValue('favicon', settingData?.favicon);
      setValue('title', settingData?.title);

      setValue(
        'refresh',
        settingData.refresh === 0 ? 'Off' : String(settingData.refresh)
      );

      setValue('email', settingData?.email);
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
        value.refresh !==
          (settingData?.refresh === 0 ? 'Off' : settingData?.refresh) || // Direct comparison to the original value
        value.email !== settingData?.email;
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
        <FlexWrapper className="mt-3">
          <ButtonDiv>
            <StyledCancelButton
              variant="secondary"
              type="button"
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
