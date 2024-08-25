import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;

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
  div > div > input {
    width: 100%;
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
  return (
    <Container>
      {label && (
        <label className="mb-2">
          {label}
          {required && <span className="required">&nbsp;*</span>}
        </label>
      )}
      <br />
      <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
        control={control}
        errors={errors}
      />
    </Container>
  );
};
export default DateTimeInput;

DateTimeInput.propTypes = {
  startDate: PropTypes.string,
  label: PropTypes.string,
  setStartDate: PropTypes.func,
  required: PropTypes.string,
  control: PropTypes.object,
  errors: PropTypes.object,
};
