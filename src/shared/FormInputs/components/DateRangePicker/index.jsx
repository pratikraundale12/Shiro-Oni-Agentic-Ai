import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

const ContainerRangePicker = styled.div`
  div > div {
    border: 1px solid #b5b5bd !important;
    color: black;
    background-color: #f5f7fa;
  }
  div > div > input {
    color: black !important;
    background-color: #f5f7fa;
  }
  div > div > input::placeholder {
    color: #4c5055 !important;
    opacity: 1; /* Ensures the color is not faded */
    font-family: 'Red Hat Display', sans-serif;
  }
`;
const DateRangePickerInput = ({ value, handleChange, customRanges }) => {
  const disabledDate = date => {
    return date > new Date();
  };
  return (
    <>
      <ContainerRangePicker>
        <DateRangePicker
          value={value}
          onChange={handleChange}
          placeholder="Select Deployment Schedule Range"
          style={{ width: 280 }}
          ranges={customRanges}
          disabledDate={disabledDate}
          showOneCalendar
          size="md"
        />
      </ContainerRangePicker>
    </>
  );
};
DateRangePickerInput.propTypes = {
  value: PropTypes.array,
  handleChange: PropTypes.func,
  customRanges: PropTypes.array,
};

export default DateRangePickerInput;
