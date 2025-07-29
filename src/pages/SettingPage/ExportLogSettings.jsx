import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import {
  AppIcon,
  FileDownloadIcon,
  InfoIcon,
  LogDocumentIcon,
} from '../../assets';

import { toast } from 'react-toastify';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { SETTING_CONSTANTS } from '../../constants/setting.constant';
import { Button, ModalWithIcon, SelectField } from '../../shared';
import StyledDateRangePickerInput from '../../shared/FormInputs/components/StyledDateRangePickerInput';
import { SettingsActions, SettingsSelectors } from '../../store/settings';

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

const GreyBoxNamespace = styled.div`
  background-color: #ffffff;
  border-radius: 20px;
`;
const TabWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: flex-start;
  border-bottom: 1px solid rgba(221, 228, 240, 1);
  flex-wrap: nowrap; /* Prevents tabs from wrapping */
  align-items: center;
  border-bottom: 1px solid rgba(221, 228, 240, 1);
  min-width: max-content; /* Ensures it doesn't shrink below content width */
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
  font: Red Hat Display;
  font-weight: 600;
  font-size: 16px;
  color: ${props =>
    props.active ? 'rgba(255, 122, 0, 1)' : 'rgba(68, 68, 69, 1)'};
  border-color: ${props =>
    props.active ? 'rgba(255, 122, 0, 1)' : 'transparent'};
  &:hover {
    color: rgba(255, 122, 0, 1);

    svg {
      stroke: rgba(255, 122, 0, 1);
    }
  }
`;

const TabsContainer = styled.div`
  width: 100%;
  overflow-x: auto; /* Enables horizontal scrolling */
  &::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none;
`;

const IconContent = styled.div`
  display: inline;
  margin-right: 6px;

  svg path {
    transition: stroke 0.3s;
  }

  ${Tab}:hover & svg path {
    stroke: rgba(255, 122, 0, 1);
  }
`;

const LogLevelLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #444445;
`;

export const settingSchema = yup.object().shape({
  logs_type: yup.string().required('Please select a log type'),
  log_level: yup.string().required('Please select a log level'),
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
  const [selectedLogLevel, setSelectedLogLevel] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isDownloadEnabled = !!watch('logs_type');

  const approverOptions = [
    { label: 'All', value: 'all' },
    { label: 'Debug', value: 'debug' },
    { label: 'Info', value: 'info' },
    { label: 'Error', value: 'error' },
  ];

  const logLevelOptions = [
    { label: 'Debug', value: 'debug' },
    { label: 'Info', value: 'info' },
    { label: 'Error', value: 'error' },
  ];

  const handleChange = value => {
    setSelectedDate(value);
  };

  const saveLogSettings = logLevel => {
    const payload = new FormData();

    if (settingData?.id) {
      payload.append('id', settingData.id);
    }

    // Send only the selected log level
    payload.append('log_level', logLevel);

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

      // Get log level from API data
      const level = settingData?.log_level || '';
      setSelectedLogLevel(level);
      setValue('log_level', level);
      setIsInitialLoad(false);
    }
  }, [settingData, setValue, watch]);

  // Watch for log level changes and save settings
  useEffect(() => {
    const logLevel = watch('log_level');
    if (logLevel && logLevel !== selectedLogLevel && !isInitialLoad) {
      setSelectedLogLevel(logLevel);
      saveLogSettings(logLevel);
    }
  }, [watch('log_level'), isInitialLoad]);

  return (
    <Wrapper>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div className="mb-0 pb-3">
          <div>
            <GreyBoxNamespace className="w-100  mb-3">
              <TabsContainer>
                <TabWrapper className="nav">
                  <Tab active={true} className="nav-item">
                    <IconContent className="nav-item">
                      <AppIcon color={'#FF7A00'} />
                    </IconContent>
                    {SETTING_CONSTANTS.LOG_CONFIGURATION}
                  </Tab>
                </TabWrapper>
              </TabsContainer>
            </GreyBoxNamespace>
          </div>
          <LogSettingsDescription>
            {SETTING_CONSTANTS.LOG_CONFIGURATION_DESCRIPTION}{' '}
            <OrangeText>
              {SETTING_CONSTANTS.LOG_CONFIGURATION_DESCRIPTION_TEXT}
            </OrangeText>
          </LogSettingsDescription>

          <div className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6 mb-3">
              <LogLevelLabel>
                {SETTING_CONSTANTS.LOG_LEVEL_LABEL}
                <div data-tooltip-id="log-level-tooltip">
                  <InfoIcon color="#444445" />
                </div>
                <ReactTooltip
                  id="log-level-tooltip"
                  place="right"
                  content={`Log levels include all higher-severity logs:

• Debug → logs Debug, Info, Error
• Info → logs Info, Error  
• Error → logs only Error`}
                  style={{
                    backgroundColor: '#333',
                    padding: '8px 12px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    zIndex: 9999,
                    maxWidth: '300px',
                    color: 'white',
                    whiteSpace: 'pre-line',
                  }}
                />
              </LogLevelLabel>
              <SelectField
                name="log_level"
                control={control}
                icon={<LogDocumentIcon color="#444445" />}
                errors={errors}
                options={logLevelOptions}
                placeholder="Select Log Level"
                required
              />
            </div>
          </div>
        </div>

        <div className="-flex justify-content-end me-4 pt-3">
          <div>
            <GreyBoxNamespace className="w-100  mb-3">
              <TabsContainer>
                <TabWrapper className="nav">
                  <Tab active={true} className="nav-item">
                    <IconContent className="nav-item">
                      <AppIcon color={'#FF7A00'} />
                    </IconContent>
                    {SETTING_CONSTANTS.LOG_EXPORT}
                  </Tab>
                </TabWrapper>
              </TabsContainer>
            </GreyBoxNamespace>
          </div>
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
