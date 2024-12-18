import classNames from 'classnames';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import { hasError } from '../../../../helpers';
import FieldErrorMessage from '../FieldErrorMessage';

const Container = styled.div`
  width: 100%;
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

  .wrapper {
    position: relative;
    margin-top: 10px;
  }

  &.error {
    input {
      border-color: ${props => props.theme.colors.error} !important;
    }
  }

  .icon-placeholder {
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
  }

  input {
    width: 100%;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 4px;
    background-color: ${props => props.theme.colors.white};
    padding: 16px 32px 16px 56px;
    font-size: 14px;
    color: ${props => props.theme.colors.darker};
    font-family: ${props => props.theme.fontNato};
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
    }
    &:disabled {
      background: ${props => props.theme.colors.darkGrey3};
      cursor: not-allowed;
    }
  }

  .icon {
    position: absolute;
    top: 14px;
    right: 10px;
    color: ${props => props.theme.colors.primary};
  }
`;

const InputField = ({
  name,
  register = null,
  errors = {},
  label,
  icon = null,
  rightIcon = null,
  type = 'text',
  required = false,
  registerOptions = {},
  className,
  value,
  onChange,
  placeholder,
  onKeyDown,
  ...props
}) => {
  const error = hasError(errors, name);

  // Default onKeyDown behavior
  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <Container
      className={classNames({
        error,
        [className]: className,
      })}
    >
      {label && (
        <label>
          {label}
          {required && <span className="required">&nbsp;*</span>}
        </label>
      )}
      <div className="wrapper">
        <span className="icon-placeholder">{icon}</span>
        <input
          value={value}
          name={name}
          type={type}
          aria-invalid={error}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          {...props}
          {...(isFunction(register) && register(name, { ...registerOptions }))}
        />
        {rightIcon && <span className="icon">{rightIcon}</span>}
      </div>
      <FieldErrorMessage errors={errors} name={name} />
    </Container>
  );
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  rightIcon: PropTypes.node,
  type: PropTypes.string,
  errors: PropTypes.shape({}),
  required: PropTypes.string,
  registerOptions: PropTypes.shape({}),
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  placeholder: PropTypes.string,
};

export default InputField;
