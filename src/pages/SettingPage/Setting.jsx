import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { KDFM, REFRESH_OPTIONS } from '../../constants';
import { SelectField, Button, UploadField, InputField } from '../../shared';
import {
  RefreshIcon,
  LogoFieldIcon,
  UploadIcon,
  MailIcon,
  QRIcons,
} from '../../assets';

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

  const onSubmit = data => {
    console.log(data);
  };

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
