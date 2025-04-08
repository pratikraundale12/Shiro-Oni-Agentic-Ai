import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';
import { CurvedDocumentIcon, FileDownloadIcon } from '../../assets';

import { Button, SelectField, ModalWithIcon } from '../../shared';
import { SettingsActions, SettingsSelectors } from '../../store/settings';
import StyledDateRangePickerInput from '../../shared/FormInputs/components/StyledDateRangePickerInput';
import { toast } from 'react-toastify';

const Wrapper = styled.div`
  height: 95%;
  padding-bottom: 120px;
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

const StyledLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  height: 16px;
  line-height: 16px;
  margin-bottom: 6px;
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
  const [selectedDate, setSelectedDate] = useState([]);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const isDownloadEnabled = !!watch('logs_type'); // enable when log type is selected

  const approverOptions = [
    { label: 'All', value: 'all' },
    { label: 'Debug', value: 'debug' },
    { label: 'Info', value: 'info' },
    { label: 'Error', value: 'error' },
  ];

  const handleChange = value => {
    setSelectedDate(value);
  };

  const handleDownloadLogs = () => {
    const logsType = watch('logs_type'); //"debug"
    const [startDate, endDate] = selectedDate || [];

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
    dispatch(SettingsActions.downloadLogsZip(payload));
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
        <div className="-flex justify-content-end me-4">
          <InputFields className="row">
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-6">
              <StyledLabel className="mb-3"> Date Range </StyledLabel>
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
                icon={<CurvedDocumentIcon color="#444445" />}
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
                disabled={!isDownloadEnabled}
                onClick={() => setIsLogsModalOpen(true)}
              >
                <ButtonText>Download Logs</ButtonText>
              </StyledSaveButton>
            </div>
          </InputFields>
        </div>
      </div>

      <ModalWithIcon
        title="Confirm Download"
        primaryButtonText="Submit"
        secondaryButtonText="Cancel"
        icon={<FileDownloadIcon height={125} width={125} />}
        primaryText="Are you sure you want to Proceed with the Download?"
        secondaryText="If Yes, Please click on the Confirm Button."
        isOpen={isLogsModalOpen}
        onSubmit={handleDownloadLogs}
        onRequestClose={() => setIsLogsModalOpen(false)}
        contentStyles={{ maxWidth: '45%', maxHeight: '80%' }}
      />
    </Wrapper>
  );
};
