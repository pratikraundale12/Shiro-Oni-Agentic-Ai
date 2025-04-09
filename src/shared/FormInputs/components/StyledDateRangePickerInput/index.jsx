import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

const ContainerRangePicker = styled.div`
  & div {
    cursor: pointer;
  }
  cursor: pointer;
  div > div {
    border: 1px solid #b5b5bd !important;
    color: black;
    background-color: #f5f7fa;
    min-height: 50px;
    margin-top: 2px;
  }

  .rs-picker-daterange > .rs-input-group.rs-input-group-inside {
    flex-direction: row-reverse;
  }

  .rs-picker-daterange > .rs-input-group.rs-input-group-inside .rs-input {
    padding-right: 0;
    height: auto;
    verticalalign: 'middle';
    + span {
      height: auto !important;
      background-color: #f5f7fa;
      border-radius: 6px 0 0 6px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }

  div > div > input {
    color: black !important;
    // background-color: #f5f7fa;
    pointer-events: none;
  }
  div > div > input::placeholder {
    color: #4c5055 !important;
    opacity: 1; /* Ensures the color is not faded */
    font-family: 'Red Hat Display', sans-serif;
  }
`;
const StyledDateRangePickerInput = ({ value, handleChange, customRanges }) => {
  return (
    <>
      <ContainerRangePicker>
        <DateRangePicker
          value={value}
          onChange={handleChange}
          placeholder="Select Date Range"
          style={{ width: '100%' }}
          ranges={customRanges}
          showOneCalendar
          size="md"
          showHeader={false}
          editable={false}
          showTime={false}
          format="MM/dd/yyyy"
        />
      </ContainerRangePicker>
    </>
  );
};
StyledDateRangePickerInput.propTypes = {
  value: PropTypes.array,
  handleChange: PropTypes.func,
  customRanges: PropTypes.array,
};

export default StyledDateRangePickerInput;
