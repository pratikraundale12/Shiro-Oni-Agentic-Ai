import PropTypes from 'prop-types';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { CalendarIcon, DownArrowIcon } from '../../../../assets';

const Container = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  // height: 250px;

  path {
    fill: ${props => props.theme.colors.darkGrey1};
  }

  label {
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    margin-bottom: 6px;
    color: ${props => props.theme.colors.darker};
  }

  .required {
    color: ${props => props.theme.colors.error};
    font-size: 1rem;
  }

  & .date-picker-icon-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    border-radius: 4px;

    & path {
      fill: ${props => props.theme.colors.darker};
    }
  }

  & .date-picker-icon {
    position: absolute;
    top: 2px;
    left: 2px;
    bottom: 2px;
    z-index: 1;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.lightGrey};

    &.arrow-down {
      right: 2px;
      left: auto;
      background-color: ${props => props.theme.colors.white};
    }
  }

  & .date-picker-wrapper {
    display: flex;
    flex: 1;

    & input {
      border: 1px solid ${props => props.theme.colors.border};
      border-radius: 4px;

      &:focus-visible {
        outline: none;
      }

      &:hover {
        border: 1px solid ${props => props.theme.colors.darker};
      }

      &:focus {
        border: 1px solid ${props => props.theme.colors.darker};
      }
    }
  }
`;

const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  height: 54px;
  padding-left: 3.5rem;

  &::placeholder {
    color: ${props => props.theme.colors.grey};
    font-family: ${props => props.theme.fontNato};
    font-size: 14px;
  }
`;

const DateTimeInput = ({
  startDate,
  setStartDate,
  label,
  required = false,
  control,
  errors,
}) => {
  const handleDateChange = date => {
    setStartDate(date);
  };
  return (
    <Container>
      {label && (
        <label className="mb-2">
          {label}
          {required && <span className="required">&nbsp;*</span>}
        </label>
      )}
      <div className="date-picker-icon-wrapper">
        <div className="date-picker-icon">
          <CalendarIcon />
        </div>
        <StyledDatePicker
          selected={startDate}
          onChange={date => handleDateChange(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
          wrapperClassName="date-picker-wrapper"
          control={control}
          errors={errors}
          popperPlacement="bottom-start"
        />
        <div className="date-picker-icon arrow-down">
          <DownArrowIcon />
        </div>
      </div>
    </Container>
  );
};
export default DateTimeInput;

DateTimeInput.propTypes = {
  startDate: PropTypes.instanceOf(Date),
  label: PropTypes.string,
  setStartDate: PropTypes.func,
  required: PropTypes.string,
  control: PropTypes.object,
  errors: PropTypes.object,
};
