import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { FileDownloadIcon, LogDocumentIcon } from '../../assets';

import { toast } from 'react-toastify';
import { Button, ModalWithIcon, SelectField, SwitchButton } from '../../shared';
import StyledDateRangePickerInput from '../../shared/FormInputs/components/StyledDateRangePickerInput';
import { SettingsActions, SettingsSelectors } from '../../store/settings';
import { SETTING_CONSTANTS } from '../../constants/setting.constant';

const Wrapper = styled.div`
  height: 95%;
  padding-bottom: 120px;
`;

const DateRangeWrapper = styled.div`
  font-size: 14px;
  font-weight: 600;
  height: 16px;
  line-height: 16px;
  margin-bottom: 6px;
  padding-top: 2px;
  cursor: default;
`;

const InputFields = styled.div`
  display: flex;
`;

const ButtonText = styled.div`
  font-size: 18px;
  font-weight: 600;
  line-height: 100%;
  letter-spacing: 1%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledSaveButton = styled(Button)`
  padding-top: 10px;
  margin-top: 30px;
  padding-bottom: 10px;
  height: 50px;
  width: 150px;
  gap: 10px;
  radius: 8px;
  left: 140px;
`;

const LogSettingsSection = styled.div`
  border-bottom: 1px solid black;
`;

const LogSettingsTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #444445;
  margin-bottom: 20px;
`;

const LogSettingsDescription = styled.p`
  font-size: 16px;
  font-family: Red Hat Display;
  font-weight: 400;
  color: #444445;
  margin-bottom: 20px;
  line-height: 1.5;
`;
const SectionSeprate = styled.div`
  font-size: 16px;
  font-family: Red Hat Display;
  font-weight: 400;
  color: #444445;
  line-height: 1.5;
`;
const OrangeText = styled.span`
  color: orange;
`;

export const settingSchema = yup.object().shape({
  logs_type: yup.string().required('Please select a log type'),
});

export const ExportLogSettings = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(settingSchema) });

  const dispatch = useDispatch();
  const settingData = useSelector(SettingsSelectors.getSettings);
  const isDownloading = useSelector(SettingsSelectors.getIsDownloading);
  const [selectedDate, setSelectedDate] = useState([]);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [debugLogsEnabled, setDebugLogsEnabled] = useState(false);
  const [infoLogsEnabled, setInfoLogsEnabled] = useState(false);
  const isDownloadEnabled = !!watch('logs_type');

  const approverOptions = [
    { label: 'All', value: 'all' },
    { label: 'Debug', value: 'debug' },
    { label: 'Info', value: 'info' },
    { label: 'Error', value: 'error' },
  ];

  const handleChange = value => {
    setSelectedDate(value);
  };

  const handleDebugLogsToggle = () => {
    setDebugLogsEnabled(!debugLogsEnabled);
    // Save to API immediately
    saveLogSettings(!debugLogsEnabled, infoLogsEnabled);
  };

  const handleInfoLogsToggle = () => {
    setInfoLogsEnabled(!infoLogsEnabled);
    // Save to API immediately
    saveLogSettings(debugLogsEnabled, !infoLogsEnabled);
  };

  const saveLogSettings = (debugEnabled, infoEnabled) => {
    const payload = new FormData();

    if (settingData?.id) {
      payload.append('id', settingData.id);
    }

    payload.append('debug_logs_enabled', debugEnabled);
    payload.append('info_logs_enabled', infoEnabled);

    dispatch(SettingsActions.createSettings(payload));
    setTimeout(() => {
      dispatch(SettingsActions.fetchSettings());
    }, 1000);
  };

  const handleDownloadLogs = () => {
    const logsType = watch('logs_type');
    const [startDate, endDate] = selectedDate || [];

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const normalize = date =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (
      (startDate && normalize(startDate) > today) ||
      (endDate && normalize(endDate) > today)
    ) {
      toast.error(
        'The selected date range includes future dates. Please choose a valid range.'
      );
      return;
    }

    const formatDate = date => {
      const options = { month: 'short', day: '2-digit', year: 'numeric' };
      return (
        date.toLocaleDateString('en-US', options).replace(',', '') + ' 00:00:00'
      );
    };

    if (!logsType) {
      toast.info('Please select a log type to proceed.');
    }

    const payload = { type: logsType };

    if (startDate && endDate) {
      payload.from = formatDate(startDate);
      payload.to = formatDate(endDate);
    }
    const toastId = toast.info(
      'We are currently preparing your download. It will be ready momentarily. Thank you for your patience.'
    );
    dispatch(SettingsActions.downloadLogsZip({ ...payload, toastId }));
    setIsLogsModalOpen(false);
    setSelectedDate([]);
    setValue('logs_type', '');
  };

  useEffect(() => {
    if (settingData) {
      document.title = settingData?.title || 'Data Flow Manager';
      if (!watch('logs_type')) {
        setValue('logs_type', settingData?.logs_type || '');
      }
      setDebugLogsEnabled(settingData?.debug_logs_enabled || false);
      setInfoLogsEnabled(settingData?.info_logs_enabled || false);
    }
  }, [settingData, setValue, watch]);

  return (
    <Wrapper>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <LogSettingsSection className="mb-0 pb-3">
          <LogSettingsTitle>
            {SETTING_CONSTANTS.LOG_CONFIGURATION}
          </LogSettingsTitle>
          <LogSettingsDescription>
            {SETTING_CONSTANTS.LOG_CONFIGURATION_DESCRIPTION}{' '}
            <OrangeText>
              {SETTING_CONSTANTS.LOG_CONFIGURATION_DESCRIPTION_TEXT}
            </OrangeText>
          </LogSettingsDescription>

          <div className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mb-3">
              <SwitchButton
                id="debug-logs-toggle"
                name="Debug Logs"
                checked={debugLogsEnabled}
                onChange={handleDebugLogsToggle}
                isDisabled={false}
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mb-3">
              <SwitchButton
                id="info-logs-toggle"
                name="Info Logs"
                checked={infoLogsEnabled}
                onChange={handleInfoLogsToggle}
                isDisabled={false}
              />
            </div>
          </div>
        </LogSettingsSection>

        <div className="-flex justify-content-end me-4 pt-3">
          <SectionSeprate className="mb-3 mt-3">
            {SETTING_CONSTANTS.DATE_RANGE_TEXT}
          </SectionSeprate>
          <InputFields className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
              <DateRangeWrapper className="mb-3">
                {' '}
                {SETTING_CONSTANTS.Date_Range_LABEL}{' '}
              </DateRangeWrapper>
              <StyledDateRangePickerInput
                value={selectedDate}
                handleChange={handleChange}
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
              <SelectField
                label="Logs Type"
                name="logs_type"
                control={control}
                icon={<LogDocumentIcon color="#444445" />}
                errors={errors}
                options={approverOptions}
                placeholder="Select Logs Type"
                value={
                  approverOptions.find(
                    option => option.value === watch('logs_type')
                  ) || null
                }
                required
              />
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 d-flex align-items-center">
              <StyledSaveButton
                type="button"
                disabled={!isDownloadEnabled || isDownloading}
                onClick={() => setIsLogsModalOpen(true)}
              >
                <ButtonText>{SETTING_CONSTANTS.DOWNLOAD_LOGS}</ButtonText>
              </StyledSaveButton>
            </div>
          </InputFields>
        </div>
      </div>

      <ModalWithIcon
        title="Confirm Download"
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        icon={<FileDownloadIcon height={125} width={125} color="#444445" />}
        primaryText="Are you sure you want to proceed with the download?"
        secondaryText="If Yes, Please click on the Confirm Button."
        isOpen={isLogsModalOpen}
        onSubmit={handleDownloadLogs}
        onRequestClose={() => setIsLogsModalOpen(false)}
        contentStyles={{ maxWidth: '45%', maxHeight: '80%' }}
      />
    </Wrapper>
  );
};
