import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import { Controller } from 'react-hook-form';
import styled from 'styled-components';
import classNames from 'classnames';

import 'react-datepicker/dist/react-datepicker.css';
import FieldErrorMessage from '../FieldErrorMessage';
import { CalendarIcon } from '../../../../assets';
import { hasError } from '../../../../helpers';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 1.4rem;

  label {
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    color: ${props => props.theme.colors.darker};
  }

  .required {
    color: ${props => props.theme.colors.error};
    font-size: 1rem;
  }

  &.error {
    input {
      border-color: ${props => props.theme.colors.error} !important;
    }
  }

  .icon-placeholder {
    width: 34px;
    height: 40px;
    top: 11px;
    left: 1px;
    z-index: 1;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props => props.theme.colors.lightGrey};
  }

  input {
    position: relative;
    margin-top: 10px;
    width: 100%;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    background-color: ${props => props.theme.colors.white};
    padding: 16px 32px 16px 56px;
    font-size: 16px;
    font-family: ${props => props.theme.fontRedHat};
    color: ${props => props.theme.colors.darker};
    &::placeholder {
      color: ${props => props.theme.colors.grey};
      font-family: ${props => props.theme.fontNato};
      font-size: 14px;
    }
    &:focus-visible {
      outline: none;
    }
    &:hover {
      border: 1px solid ${props => props.theme.colors.darker};
    }
    &:focus {
      border: 1px solid ${props => props.theme.colors.darker};
    }
    &:disabled {
      background: ${props => props.theme.colors.darkGrey3};
      cursor: not-allowed;
    }
  }
`;

const DateField = ({
  name,
  label,
  control,
  errors,
  placeholder = '',
  required = false,
  onChange: customOnChange,
  scheduleDeployTime,
  ...props
}) => {
  const error = hasError(errors, name);

  return (
    <Container
      className={classNames({
        error,
      })}
    >
      {label && (
        <label>
          {label}
          {required && <span className="required">&nbsp;*</span>}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        defaultValue={null}
        render={({ field }) => {
          const onChange = value => {
            field.onChange(value);
            if (customOnChange) {
              customOnChange(value);
            }
          };
          const isToday = field.value
            ? new Date(field.value).toDateString() === new Date().toDateString()
            : true;
          return (
            <DatePicker
              showIcon
              showTimeSelect
              timeIntervals={15}
              onChange={onChange}
              selected={scheduleDeployTime ? scheduleDeployTime : field.value}
              placeholderText={placeholder}
              minDate={new Date()}
              minTime={
                isToday ? new Date() : new Date(new Date().setHours(0, 0, 0, 0))
              }
              maxTime={new Date(new Date().setHours(23, 59, 59, 0))}
              dateFormat="MMMM d, yyyy h:mm aa"
              popperPlacement="bottom-start"
              icon={
                <span className="icon-placeholder">
                  <CalendarIcon />
                </span>
              }
              {...props}
            />
          );
        }}
      />
      <FieldErrorMessage errors={errors} name={name} />
    </Container>
  );
};

DateField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}),
  date: PropTypes.instanceOf(Date),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  scheduleDeployTime: PropTypes.object,
};

export default DateField;
