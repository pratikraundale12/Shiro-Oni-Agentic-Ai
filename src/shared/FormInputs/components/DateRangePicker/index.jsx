import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import styled, { createGlobalStyle } from 'styled-components';
import { SettingsSelectors } from '../../../../store/settings';

const ContainerRangePicker = styled.div`
  & div {
    cursor: pointer;
    width: 315px !important;
  }
  cursor: pointer;
  div > div {
    border: 1px solid #b5b5bd !important;
    color: black;
    background-color: #f5f7fa;
    min-height: 38px;
  }
  div > div > input {
    color: black !important;
    background-color: #f5f7fa;
    pointer-events: none;
  }
  div > div > input::placeholder {
    color: #4c5055 !important;
    opacity: 1;
    font-family: 'Red Hat Display', sans-serif;
  }
`;

const DateRangePredefinedGlobalStyle = createGlobalStyle`
  div[data-testid='daterange-predefined-side'] {
    overflow-y: scroll !important;
  }
  
  /* Alternative global approach to hide time button */
  .rs-calendar-header-title-time {
    display: none !important;
  }
  
  /* Add gap between dropdown and input using the correct selector */
  .rs-picker-popup-daterange {
    margin-top: 8px !important;
  }
  
  /* Alternative approach using data-testid */
  div[data-testid="picker-popup"] {
    margin-top: 8px !important;
  }
  
  /* More specific targeting for placement-bottom-start */
  .rs-picker-popup.placement-bottom-start {
    transform: translateY(8px) !important;
  }
`;

const DateRangePickerInput = ({ value, handleChange, customRanges }) => {
  const settingsAPIdata = useSelector(SettingsSelectors.getSettingsData);
  const activeFormat = useMemo(() => {
    if (settingsAPIdata?.time_format === 'YYYY/MM/DD HH:MM:SS') {
      return 'yyyy/MM/dd HH:mm';
    }
    if (settingsAPIdata?.time_format === 'DD/MM/YYYY HH:MM') {
      return 'dd/MM/yyyy HH:mm';
    }
    if (settingsAPIdata?.time_format === 'MM/DD/YYYY HH:MM AM/PM') {
      return 'MM/dd/yyyy HH:mm';
    }
    return 'MM/dd/yyyy HH:mm';
  }, [settingsAPIdata?.time_format]);

  return (
    <>
      <DateRangePredefinedGlobalStyle />
      <ContainerRangePicker>
        <DateRangePicker
          value={value}
          onChange={handleChange}
          placeholder="Select Date Range"
          style={{ width: 280 }}
          ranges={customRanges}
          showOneCalendar
          size="md"
          showHeader={false}
          editable={true}
          showTime={{ format: 'HH:mm' }}
          format={activeFormat}
        />
      </ContainerRangePicker>
    </>
  );
};

DateRangePickerInput.propTypes = {
  value: PropTypes.array,
  handleChange: PropTypes.func.isRequired,
  customRanges: PropTypes.array,
};

export default DateRangePickerInput;
