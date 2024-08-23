import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { KDFM, REFRESH_OPTIONS } from '../../constants';
import { useDispatch } from 'react-redux';
import { SelectField, Button, UploadField, InputField } from '../../shared';
import { useSelector } from 'react-redux';
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
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const settingData = useSelector(SettingsSelectors.getSettings);

  const onSubmit = data => {
    console.log(data, 'formDataadada');

    // Create a new FormData instance
    const payload = new FormData();

    // Append each field to the FormData object
    payload.append('logo', data.logo);
    payload.append('favicon', data.favicon);
    payload.append('title', data.title);
    payload.append('refresh', data.refresh);
    payload.append('email', data.email);

    // Dispatch the action with FormData payload
    dispatch(SettingsActions.createSettings(payload));

    // const favicon = document.getElementById('favicon');
    // favicon.href = 'path/to/new/favicon.ico';

    // Change the title
    document.title = data.title;

    // Update the logo (assuming you have a state or prop to update the logo src)
    // const logoElement = document.getElementById('logo');
    // if (logoElement) {
    //   logoElement.src = 'path/to/new/logo.png';
    // }
  };

  useEffect(() => {
    dispatch(SettingsActions.fetchSettings());
  }, [dispatch]);

  console.log('Component data:', settingData);

  return (
    <Wrapper>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          // height: '100%',
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
            options={REFRESH_OPTIONS}
            placeholder="Select Cluster"
          />
          <StyledInputField
            name="Email"
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
          />
          <UploadField
            name="favicon"
            label="Favicon"
            control={control}
            icon={<LogoFieldIcon />}
            rightIcon={<UploadIcon />}
            errors={errors}
            register={register}
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
