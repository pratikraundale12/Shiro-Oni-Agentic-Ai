import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';
// import { isValidPhoneNumber } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input/react-hook-form-input';

import FieldErrorMessage from '../FieldErrorMessage';
import { hasError } from '../../../../helpers';

const Container = styled.div`
  width: 100%;
  margin-bottom: 1.4rem;

  path {
    fill: ${props => props.theme.colors.darker};
  }

  label {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .required {
    color: ${props => props.theme.colors.error};
    font-size: 1rem;
  }

  .wrapper {
    position: relative;
    margin-top: 10px;
  }

  .icon-placeholder {
    position: absolute;
    top: 2px;
    left: 1px;
    z-index: 1;
    height: 48px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 0 14px;
    background-color: ${props => props.theme.colors.lightGrey};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input {
    width: 100%;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    background: ${props => props.theme.colors.white};
    padding: 16px 32px 16px 56px;
    font-size: 14px;

    &.error {
      border-color: ${props => props.theme.colors.error} !important;
      outline: none;
    }

    &::placeholder {
      color: ${props => props.theme.colors.grey};
      font-family: ${props => props.theme.fontNato};
      font-size: 14px;
    }

    &:focus-visible {
      outline: none;
    }

    &:focus {
      border: 1px solid ${props => props.theme.colors.darker};
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
  icon = null,
  required,
  className,
  ...props
}) => {
  const error = hasError(errors, name);

  return (
    <Container className={className}>
      <label className="mb-0">
        {'Phone Number'}
        {required && <span className="required">&nbsp;*</span>}
      </label>
      <div className="wrapper">
        <span className="icon-placeholder">{icon}</span>
        <PhoneInput
          name={name}
          control={control}
          rules={{
            required,
            // validate: value =>
            //   !isValidPhoneNumber(value) && 'Invalid phone number',
          }}
          aria-invalid={error}
          className={classNames({
            error,
          })}
          placeholder="Enter your phone number"
          defaultCountry="IN"
          {...props}
        />
      </div>

      <FieldErrorMessage errors={errors} name={name} />
    </Container>
  );
};

PhoneField.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}),
  icon: PropTypes.node,
  required: PropTypes.string,
  className: PropTypes.string,
};

export default PhoneField;
