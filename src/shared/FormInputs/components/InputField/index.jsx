import React from 'react';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';

import FieldErrorMessage from '../FieldErrorMessage';
import { hasError } from '../../../../utils';

const InputField = ({
  name,
  register = null,
  errors = {},
  label,
  type = 'text',
  required = false,
  disabled = false,
  registerOptions = {},
  className,
  id,
  icon,
  checkicon,
  ...props
}) => {
  const error = hasError(errors, name);

  return (
    <div className="input-box">
      {label && (
        <label htmlFor={id} className="mb-2">
          {label}
          {required && <span className="required">&nbsp;*</span>}
        </label>
      )}
      <div className="input-group">
        {icon && (
          <div className="input-group-prepend">
            <span className="input-group-text" id="basic-addon1">
              {icon}
            </span>
          </div>
        )}
        <input
          name={name}
          type={type}
          className={`form-control ${className}`}
          aria-invalid={error}
          {...props}
          {...(isFunction(register) &&
            register(name, { required, ...registerOptions }))}
          disabled={disabled}
        />
        {checkicon && <span className="validation success">{checkicon}</span>}
      </div>
      <FieldErrorMessage errors={errors} name={name} />
    </div>
  );
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  register: PropTypes.func,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  errors: PropTypes.shape({}),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  icon: PropTypes.element,
  checkicon: PropTypes.element,
  registerOptions: PropTypes.shape({}),
  className: PropTypes.string,
};

export default InputField;
