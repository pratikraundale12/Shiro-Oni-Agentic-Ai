import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  DeploymentScheduleIcon2,
  EmailSmsTrackingIcon,
  Profile2UserIcon,
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
const LabelSelect = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: ${props => props.theme.colors.darker};
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden; /* Hides overflowing text */
  text-overflow: ellipsis; /* Adds "..." if text overflows */
`;

// const EmphasisText = styled.em`
//   font-style: italic;
//   font-size: 13px !important;
//   font-weight: 500;
//   white-space: nowrap; /* Prevents text from wrapping */
//   overflow: hidden; /* Hides overflowing text */
//   text-overflow: ellipsis; /* Adds "..." if text overflows */
// `;

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
      const isModified =
        value.refresh !==
          (settingData?.refresh === 0 ? 'Off' : settingData?.refresh) || // Direct comparison to the original value
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
          <SelectField
            label="Approver Groups"
            name="approver_groups"
            control={control}
            icon={<Profile2UserIcon />}
            errors={errors}
            options={approverOptions}
            placeholder="Select Approver Groups"
            value={
              approverOptions.find(
                option => option.value === watch('approver_groups')
              ) || null
            }
          />
        </div>

        {/* Modified middle rows container to match top row width */}
        <div className="col-xl-6 col-lg-10 col-md-10 col-sm-10 col-6 ">
          <div className="row">
            {/* First middle field - adjust to 50% width */}
            <div className="col-6 mb-1">
              <InputField
                name="group_email_id"
                register={register}
                icon={<EmailSmsTrackingIcon />}
                label={`${KDFM.GROUP_EMAIL} *`}
                placeholder={KDFM.ENTER_GROUP_EMAIL}
                errors={errors}
              />
            </div>

            {/* Second middle field - adjust to 50% width */}
            <div className="col-6 mb-1">
              <LabelSelect className="mb-3">
                {`${KDFM.EMAIL_REMINDER} *`}
                {/* <EmphasisText> ({KDFM.REMINDER_EMPHASISED_TEXT})</EmphasisText> */}
              </LabelSelect>
              <SelectField
                name="email_reminder_time"
                control={control}
                icon={<DeploymentScheduleIcon2 />}
                errors={errors}
                options={EMAIL_REMINDER_OPTIONS}
                placeholder="Select Reminder Time"
                defaultValue={EMAIL_REMINDER_OPTIONS[0]}
                sortAlphabetically={false}
              />
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-5 col-md-5 col-sm-5 col-5 mt-1">
          <LabelSelect className="mb-3">
            {KDFM.DEPLOYMENT_SCHEDULE_LIST_REFRESH}
          </LabelSelect>
          <SelectField
            name="refresh"
            control={control}
            icon={<DeploymentScheduleIcon2 />}
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
                  approver_groups: '', // Ensure this resets properly
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
