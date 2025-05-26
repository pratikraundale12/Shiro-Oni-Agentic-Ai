import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  CurvedDeploymentScheduleIcon,
  EmailSmsTrackingIcon,
  CurvedProfileDoubleUserIcon,
  ClockIcon,
} from '../../assets';
import favicon from '../../assets/images/default-favicon.ico';
import {
  EMAIL_REGEX,
  EMAIL_REMINDER_OPTIONS,
  KDFM,
  SCHEDULE_LIST_REFRESH_OPTIONS,
} from '../../constants';
import { history } from '../../helpers/history';
import { Button, InputField, SelectField } from '../../shared';
import { RolesSelectors } from '../../store';
import { SettingsActions, SettingsSelectors } from '../../store/settings';

const Wrapper = styled.div`
  height: 95%;
  padding-bottom: 120px; /* Adds space below all content */
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

const GroupEmailInput = styled.div`
  label {
    margin-bottom: 6px;
  }
`;

const ButtonDiv = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledSelectField = styled(SelectField)`
  /* Container styling */
  & > div {
    margin-bottom: ${props => props.marginBottom || '4px'};
  }
  & label {
    margin-bottom: ${props => props.labelMargin || '2px'} !important;
  }
  /* Control styling (the main input area) */
  & .react-select__control {
    height: ${props => props.height || 'auto'};
    min-height: ${props => props.height || '54px'};
    border-radius: ${props => props.borderRadius || '4px'};
    margin-top: ${props => props.marginTop || '14px'};
    margin-left: ${props => props.marginLeft || '0'};
    margin-right: ${props => props.marginRight || '0'};
  }
  /* Value container styling */
  & .react-select__value-container {
    padding: ${props => props.innerPadding || props.padding || '0 8px'};
  }
  /* Menu styling */
  & .react-select__menu {
    border-radius: ${props => props.menuBorderRadius || '4px'};
  }
  /* Option styling */
  & .react-select__option {
    padding: ${props => props.optionPadding || '8px 12px'};
    font-size: ${props => props.fontSize || '14px'};
  }
`;

export const settingSchema = yup.object().shape({
  group_email_id: yup
    .string()
    .required('Group email is required')
    .nullable()
    .test('emails', 'Invalid email addresses', function (value) {
      if (!value) return true;
      const emails = value.split(',').map(email => email.trim());
      return emails.every(email => EMAIL_REGEX.test(email));
    }),

  approver_groups: yup
    .mixed()
    .test(
      'is-valid',
      'Please select at least one approver group',
      value => value !== undefined && value !== null && value !== ''
    ),
});
export const DeploymentScheduleSettings = () => {
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
  const RoleList = useSelector(RolesSelectors.getRoles);

  const approverOptions = RoleList.map(role => ({
    label: role.name,
    value: role.role_id,
  }));

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

      setValue('email_reminder_time', settingData?.email_reminder_time);
      setValue('group_email_id', settingData?.group_email_id);
      setValue('approver_groups', settingData.approver_groups || '');
    }
  }, [settingData, setValue, dispatch]);

  useEffect(() => {
    const subscription = watch(value => {
      const refreshSetting =
        settingData?.refresh === 0 ? 'Off' : String(settingData?.refresh);
      const isModified =
        String(value.refresh) !== refreshSetting ||
        value.approver_groups !== settingData?.approver_groups ||
        value.group_email_id !== settingData?.group_email_id ||
        value.email_reminder_time !== settingData?.email_reminder_time;
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
        <div className="col-xl-6 col-lg-10 col-md-10 col-sm-10 col-6 mb-4">
          <StyledSelectField
            label="Approver Groups"
            name="approver_groups"
            control={control}
            icon={<CurvedProfileDoubleUserIcon />}
            errors={errors}
            options={approverOptions}
            required
            placeholder="Select Approver Groups"
            value={
              approverOptions.find(
                option => option.value === watch('approver_groups')
              ) || null
            }
          />
        </div>

        <div className="col-xl-6 col-lg-10 col-md-10 col-sm-10 col-6 ">
          <div className="row">
            <GroupEmailInput className="col-6">
              <InputField
                name="group_email_id"
                register={register}
                icon={<EmailSmsTrackingIcon />}
                label={
                  <>
                    {KDFM.GROUP_EMAIL}{' '}
                    <em>
                      (Enter one or more email addresses, separated by commas)
                    </em>
                  </>
                }
                placeholder={KDFM.ENTER_GROUP_EMAIL}
                errors={errors}
                required={true}
              />
            </GroupEmailInput>

            <div className="col-6 mb-1">
              <StyledSelectField
                label={
                  <>
                    {KDFM.EMAIL_REMINDER}{' '}
                    <em>(before deployment schedule time)</em>
                  </>
                }
                name="email_reminder_time"
                control={control}
                icon={<ClockIcon />}
                errors={errors}
                options={EMAIL_REMINDER_OPTIONS}
                placeholder="Select Reminder Time"
                defaultValue={EMAIL_REMINDER_OPTIONS[0]}
                sortAlphabetically={false}
                required={true}
              />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-5 col-md-5 col-sm-5 col-5 mt-1">
          <StyledSelectField
            label={KDFM.DEPLOYMENT_SCHEDULE_LIST_REFRESH}
            name="refresh"
            control={control}
            icon={<CurvedDeploymentScheduleIcon />}
            errors={errors}
            options={SCHEDULE_LIST_REFRESH_OPTIONS}
            placeholder="Deployment Schedule Refresh Time"
            sortAlphabetically={false}
          />
        </div>

        <FlexWrapper className="mt-3">
          <ButtonDiv>
            <StyledCancelButton
              variant="secondary"
              type="button"
              loading={loading}
              disabled={!isChanged}
              onClick={() => {
                reset({
                  refresh:
                    settingData?.refresh === 0
                      ? 'Off'
                      : String(settingData?.refresh),
                  email_reminder_time: settingData?.email_reminder_time,
                  group_email_id: settingData?.group_email_id,
                  approver_groups: '',
                });
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
