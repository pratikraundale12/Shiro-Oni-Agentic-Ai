import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input/react-hook-form-input';

import FieldErrorMessage from '../FieldErrorMessage';
import { hasError } from '../../../../utils';

const Container = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 1rem;

  path {
    fill: ${props => props.theme.colors.darkGrey1};
  }

  label {
    font-size: 14px;
    font-weight: 600;
    line-height: 15.06px;
    margin-bottom: 5px;
  }

  .required {
    color: ${props => props.theme.colors.error};
    font-size: 1rem;
  }

  input {
    width: 100%;
    height: 42px;
    border: 1px solid ${props => props.theme.colors.darkGrey};
    border-radius: 4px;
    background: ${props => props.theme.colors.white};
    padding: 10px;
    font-size: 14px;

    &.error {
      border-color: ${props => props.theme.colors.error} !important;
      outline: none;
    }

    &::placeholder {
      color: ${props => props.theme.colors.darkGrey1};
      font-size: 14px;
    }

    &:focus-visible {
      outline: none;
    }

    &:not(:placeholder-shown),
    &:focus {
      border: 1px solid ${props => props.theme.colors.primary};

      &::placeholder {
        color: transparent;
      }
    }
    &:disabled {
      background: ${props => props.theme.colors.lightGrey2};
    }
  }
`;

const PhoneField = ({
  name,
  control,
  errors,
  required,
  className,
  ...props
}) => {
  const error = hasError(errors, name);

  return (
    <Container className={className}>
      <label>
        {'Phone Number'}
        {required && <span className="required">&nbsp;*</span>}
      </label>
      <PhoneInput
        name={name}
        control={control}
        rules={{
          required,
          validate: value =>
            !isValidPhoneNumber(value) && 'Invalid phone number',
        }}
        aria-invalid={error}
        className={classNames({
          error,
        })}
        placeholder="Enter your phone number"
        defaultCountry="IN"
        {...props}
      />
      <FieldErrorMessage errors={errors} name={name} />
    </Container>
  );
};

PhoneField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}),
  required: PropTypes.string,
  className: PropTypes.string,
};

export default PhoneField;
